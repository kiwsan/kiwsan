// The WebGL environment layer. Creates and owns every three object (floor,
// walls, neon rails, under-glow bars, dust), the renderer, theme colors,
// context-loss wiring, and disposal. Everything env-shaped hangs under
// root, a child of the corridor's shared scene.
import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { CORRIDOR, cardOpacity, type CameraPose, type Layout, type Placement } from './layout';

export type EnvTier = 'full' | 'lite'; // 'off' is represented by null in Experience

export interface ThemeColors {
  bg: string;
  primary: string;
  secondary: string;
  muted: string;
  // The spec names the wall colors as tokens, so they ride along as fields
  // instead of baked constants the light theme could not reach.
  surface: string;
  border: string;
}

export interface Environment {
  readonly renderer: THREE.WebGLRenderer;
  readonly canvas: HTMLCanvasElement;
  readonly root: THREE.Group; // everything env-shaped lives under this group
  tier: EnvTier;
  update(dt: number, pose: CameraPose, p: number): void; // dust drift, glow pulse via cardOpacity
  relayout(layout: Layout): void; // resize: strips, walls, underglows follow the new lanes
  setTheme(colors: ThemeColors): void; // scene.background, fog color, material colors
  teardown(): void; // dispose geometries, materials, textures, render targets
}

export interface EnvironmentOptions {
  stage: HTMLElement;
  scene: THREE.Scene; // the corridor's shared scene
  layout: Layout;
  colors: ThemeColors;
  tier: EnvTier;
  onContextLost: () => void; // experience sets gl = null, corridor keeps running
  onContextRestored: () => void; // experience rebuilds at 'lite'
}

const WALL_GAP = 40;
const WALL_HEIGHT = 1500;
const FLOOR_Y = -220; // the floor sits below the camera/card plane; at y=0 it
// would be edge-on to the y=0 camera and collapse to the horizon line
const FLOOR_EXTRA = 60; // floor reaches past the walls so no seam shows at the edges
const RAIL_Y = 24;
const DUST_FULL = 800;
const DUST_LITE = 300;
const DUST_DRIFT = 14; // world units per second toward the camera
const DUST_HEIGHT = 1200;

const FALLBACKS: ThemeColors = {
  bg: '#1a1b26',
  primary: '#7aa2f7',
  secondary: '#5d7dc4',
  muted: '#9aa5ce',
  surface: '#24283b',
  border: '#414868',
};

const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const SHORT_HEX = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i;

// Boundary parse of CSS custom properties; falls back to the design tokens
// when a variable is missing or not a color (boundary-discipline). Browsers
// serialize computed color tokens in shortest form, so #ffffff comes back as
// #fff and must be normalized before the hex check.
function normalizeColor(value: string): string | null {
  const v = value.trim();
  if (HEX_COLOR.test(v)) return v;
  const short = SHORT_HEX.exec(v);
  if (short) return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`;
  return null;
}

export function readThemeColors(section: HTMLElement): ThemeColors {
  const style = getComputedStyle(section);
  const read = (name: string, fallback: string): string =>
    normalizeColor(style.getPropertyValue(name)) ?? fallback;
  return {
    bg: read('--color-bg', FALLBACKS.bg),
    primary: read('--color-primary', FALLBACKS.primary),
    secondary: read('--color-secondary', FALLBACKS.secondary),
    muted: read('--color-text-muted', FALLBACKS.muted),
    surface: read('--color-surface', FALLBACKS.surface),
    border: read('--color-border', FALLBACKS.border),
  };
}

// cardOpacity's [DIM_FLOOR, 1] range remapped to [0.25, 1], so strip and
// under-glow brightness breathes on the corridor's own rhythm.
function glowBrightness(opacity: number): number {
  const t = (Math.min(1, opacity) - CORRIDOR.DIM_FLOOR) / (1 - CORRIDOR.DIM_FLOOR);
  return 0.25 + 0.75 * Math.max(0, t);
}

// The far end must fade into the background by the last card: pick the
// FogExp2 density so the factor is ~0.03 at the corridor's far card.
function fogDensity(layout: Layout): number {
  const reach = layout.corridor.zMax - layout.corridor.zMin + 2 * CORRIDOR.READ_DISTANCE;
  return 2.2 / reach;
}

function corridorCenter(layout: Layout): number {
  return (layout.corridor.zMin + layout.corridor.zMax) / 2;
}

function floorWidth(layout: Layout): number {
  return 2 * (layout.laneOffset + WALL_GAP + FLOOR_EXTRA);
}

function spanWithReach(layout: Layout): number {
  return layout.corridor.zMax - layout.corridor.zMin + 2 * CORRIDOR.READ_DISTANCE;
}

interface WallPair {
  wall: THREE.Mesh;
  edge: THREE.Mesh;
  side: 1 | -1;
}

interface Rail {
  rail: THREE.Mesh;
  material: THREE.MeshBasicMaterial;
  side: 1 | -1;
}

interface Underglow {
  mesh: THREE.Mesh;
  material: THREE.MeshBasicMaterial;
  placement: Placement;
}

// Throws only when a WebGL context cannot be created. The caller catches,
// warns, and keeps the corridor, so a GPU-less machine still gets crisp cards.
export function createEnvironment(options: EnvironmentOptions): Environment {
  const { stage, scene, colors, tier } = options;
  let layout = options.layout;

  const renderer = new THREE.WebGLRenderer({ antialias: false });
  // No antialias: SwiftShader software rendering pays MSAA per frame, and the
  // watchdog threshold is tighter than that cost on headless CI machines.
  const canvas = renderer.domElement;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  canvas.style.position = 'absolute';
  canvas.style.inset = '0';
  canvas.style.zIndex = '0';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.pointerEvents = 'none';
  stage.insertBefore(canvas, stage.firstChild);

  const root = new THREE.Group();
  scene.add(root);

  const onLost = (event: Event) => {
    event.preventDefault(); // without it the browser never fires restored
    options.onContextLost();
  };
  const onRestored = () => options.onContextRestored();
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  const fog = new THREE.FogExp2(colors.bg, fogDensity(layout));
  scene.fog = fog;
  scene.background = new THREE.Color(colors.bg);

  // Floor: a Reflector in the full tier (mirrors only WebGL geometry, never
  // the DOM cards), a plain plane in lite.
  const floor: Reflector | THREE.Mesh =
    tier === 'full'
      ? new Reflector(new THREE.PlaneGeometry(floorWidth(layout), spanWithReach(layout)), {
          textureWidth: 512,
          textureHeight: 256,
          color: new THREE.Color(colors.bg),
        })
      : new THREE.Mesh(
          new THREE.PlaneGeometry(floorWidth(layout), spanWithReach(layout)),
          new THREE.MeshBasicMaterial({ color: colors.surface })
        );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, FLOOR_Y, corridorCenter(layout));
  root.add(floor);

  // Walls at x = +/- (laneOffset + wallGap), surface with a faint border edge.
  const makeWall = (side: 1 | -1): WallPair => {
    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(spanWithReach(layout), WALL_HEIGHT),
      new THREE.MeshBasicMaterial({ color: colors.surface, side: THREE.DoubleSide })
    );
    wall.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2; // face the corridor
    wall.position.set(
      side * (layout.laneOffset + WALL_GAP),
      FLOOR_Y + WALL_HEIGHT / 2,
      corridorCenter(layout)
    );
    const edge = new THREE.Mesh(
      new THREE.BoxGeometry(2, 3, spanWithReach(layout)),
      new THREE.MeshBasicMaterial({ color: colors.border })
    );
    edge.position.set(side * (layout.laneOffset + WALL_GAP), FLOOR_Y + WALL_HEIGHT, corridorCenter(layout));
    root.add(wall, edge);
    return { wall, edge, side };
  };
  const walls = [makeWall(1), makeWall(-1)];

  // Neon rails: one continuous strip per wall at x = +/- laneOffset.
  const makeRail = (side: 1 | -1): Rail => {
    const material = new THREE.MeshBasicMaterial({ color: colors.primary, transparent: true, opacity: 1 });
    const rail = new THREE.Mesh(new THREE.BoxGeometry(spanWithReach(layout), 4, 4), material);
    rail.position.set(side * layout.laneOffset, FLOOR_Y + RAIL_Y, corridorCenter(layout));
    root.add(rail);
    return { rail, material, side };
  };
  const rails = [makeRail(1), makeRail(-1)];

  // One under-glow bar per card, lying on the floor at its placement.
  const underglows: Underglow[] = layout.placements.map((placement) => {
    const material = new THREE.MeshBasicMaterial({
      color: colors.primary,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(500, 36), material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(placement.x, FLOOR_Y + 2, placement.z);
    root.add(mesh);
    return { mesh, material, placement };
  });

  // Dust: one Points cloud drifting toward the camera, z wrapped modulo span.
  const dustCount = tier === 'full' ? DUST_FULL : DUST_LITE;
  const dustPositions = new Float32Array(dustCount * 3);
  const dustMaterial = new THREE.PointsMaterial({
    color: colors.muted,
    size: 3,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    fog: true,
  });
  const dust = new THREE.Points(new THREE.BufferGeometry(), dustMaterial);
  dust.frustumCulled = false;
  root.add(dust);

  const seedDust = (): void => {
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() * 2 - 1) * (layout.laneOffset + WALL_GAP);
      dustPositions[i * 3 + 1] = Math.random() * DUST_HEIGHT;
      dustPositions[i * 3 + 2] = layout.corridor.zMin + Math.random() * (layout.corridor.zMax - layout.corridor.zMin);
    }
    dust.geometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  };
  seedDust();

  const update = (dt: number, _pose: CameraPose, p: number): void => {
    const zSpan = layout.corridor.zMax - layout.corridor.zMin;
    for (let i = 0; i < dustCount; i++) {
      let z = dustPositions[i * 3 + 2] - DUST_DRIFT * dt;
      if (z < layout.corridor.zMin) z += zSpan;
      dustPositions[i * 3 + 2] = z;
    }
    dust.geometry.attributes.position.needsUpdate = true;

    // Glow pulse on the corridor's own rhythm. Rails follow the card nearest
    // to p; each under-glow follows its own card.
    const nearest = layout.placements.reduce((best, placement) =>
      Math.abs(p - placement.readAt) < Math.abs(p - best.readAt) ? placement : best
    );
    const railBrightness = glowBrightness(cardOpacity(p, nearest, layout.travel));
    for (const { material } of rails) material.opacity = railBrightness;
    for (const glow of underglows) {
      glow.material.opacity = glowBrightness(cardOpacity(p, glow.placement, layout.travel));
    }
  };

  const relayout = (next: Layout): void => {
    layout = next;
    floor.geometry.dispose();
    floor.geometry = new THREE.PlaneGeometry(floorWidth(layout), spanWithReach(layout));
    floor.position.set(0, FLOOR_Y, corridorCenter(layout));
    for (const { wall, edge, side } of walls) {
      wall.geometry.dispose();
      wall.geometry = new THREE.PlaneGeometry(spanWithReach(layout), WALL_HEIGHT);
      wall.position.set(
        side * (layout.laneOffset + WALL_GAP),
        FLOOR_Y + WALL_HEIGHT / 2,
        corridorCenter(layout)
      );
      edge.geometry.dispose();
      edge.geometry = new THREE.BoxGeometry(2, 3, spanWithReach(layout));
      edge.position.set(
        side * (layout.laneOffset + WALL_GAP),
        FLOOR_Y + WALL_HEIGHT,
        corridorCenter(layout)
      );
    }
    for (const { rail, side } of rails) {
      rail.geometry.dispose();
      rail.geometry = new THREE.BoxGeometry(spanWithReach(layout), 4, 4);
      rail.position.set(side * layout.laneOffset, FLOOR_Y + RAIL_Y, corridorCenter(layout));
    }
    layout.placements.forEach((placement, i) => {
      underglows[i].placement = placement;
      underglows[i].mesh.position.set(placement.x, FLOOR_Y + 2, placement.z);
    });
    seedDust();
  };

  const setTheme = (colors: ThemeColors): void => {
    fog.color.set(colors.bg);
    scene.background = new THREE.Color(colors.bg);
    for (const { material } of rails) material.color.set(colors.primary);
    for (const glow of underglows) glow.material.color.set(colors.primary);
    dustMaterial.color.set(colors.muted);
    for (const { wall, edge } of walls) {
      (wall.material as THREE.MeshBasicMaterial).color.set(colors.surface);
      (edge.material as THREE.MeshBasicMaterial).color.set(colors.border);
    }
    if (floor instanceof Reflector) {
      // Reflector's material is a ShaderMaterial whose tint lives in the
      // color uniform; r186's Material base has no .color property.
      (floor.material as THREE.ShaderMaterial).uniforms.color.value = new THREE.Color(colors.bg);
    } else {
      (floor.material as THREE.MeshBasicMaterial).color.set(colors.surface);
    }
  };

  let disposed = false;
  const teardown = (): void => {
    if (disposed) return;
    disposed = true;
    canvas.removeEventListener('webglcontextlost', onLost);
    canvas.removeEventListener('webglcontextrestored', onRestored);
    root.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
        object.geometry.dispose();
        const material = object.material as THREE.Material | THREE.Material[];
        const materials = Array.isArray(material) ? material : [material];
        for (const m of materials) m.dispose();
      }
    });
    if (floor instanceof Reflector) floor.getRenderTarget().dispose();
    scene.remove(root);
    scene.fog = null;
    scene.background = null;
    renderer.dispose();
    canvas.remove();
  };

  return {
    renderer,
    canvas,
    root,
    tier,
    update,
    relayout,
    setTheme,
    teardown,
  };
}
