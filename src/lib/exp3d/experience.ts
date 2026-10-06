// The shell: DOM queries, mode decisions, the enter/exit/resize lifecycle,
// the single frame loop, pointer capture, the frame watchdog, the theme
// observer, and the __exp3d debug export. The corridor owns the shared
// scene and camera and the CSS3D half of the frame; the environment is an
// optional WebGL layer on top of it.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import {
  createEnvironment,
  readThemeColors,
  type EnvTier,
  type Environment,
  type ThemeColors,
} from './environment';
import {
  CORRIDOR,
  PARALLAX,
  cameraAt,
  cardOpacity,
  composePose,
  layoutFor,
  nextTier,
  place,
  type CameraPose,
  type Layout,
  type Parallax,
  type Placement,
  type Tier,
} from './layout';

gsap.registerPlugin(ScrollTrigger);

export interface ExperienceHandle {
  destroy(): void; // idempotent full teardown; safe to call twice
}

// The domain has exactly four live states, encoded as one discriminated
// union instead of booleans that must agree. A dead environment is null,
// not a tier value, so a live renderer with tier off is unrepresentable.
type Experience =
  | { mode: 'flat' } // no corridor, no gl
  | { mode: '3d'; corridor: Corridor; gl: Environment | null }; // corridor always, env optional

interface CardEntry {
  el: HTMLElement;
  article: HTMLElement;
  object: CSS3DObject;
  placement: Placement;
}

// Corridor owns the shared scene and camera and the CSS3D half of the frame.
interface Corridor {
  scene: THREE.Scene; // shared: env.root hangs here, both renderers read it
  camera: THREE.PerspectiveCamera;
  renderer: CSS3DRenderer;
  entries: CardEntry[];
  layout: Layout;
  tween: gsap.core.Tween; // scrub tween still owns proxy.p; its smoothing is the scroll damping
  trigger: ScrollTrigger;
  progress: () => number; // returns proxy.p, the scrub-smoothed value
  applyFrame: (pose: CameraPose, p: number) => void; // card DOM only, no renderer call
  teardown: () => void; // kill tween, re-parent cards, remove DOM, clear styles
}

// Per-actor input state. The pointermove listener writes only `pointer`; the
// frame loop writes only `parallax`. No actor writes another actor's state;
// the merge happens at the frame read boundary.
interface InputState {
  pointer: Parallax; // latest raw pointer position, [-1, 1], (0, 0) until first move
  parallax: Parallax; // damped, converges to pointer
}

// Mounting is idempotent: a second call returns the live handle, which
// covers Astro HMR re-running scripts.
const mounts = new WeakMap<HTMLElement, ExperienceHandle>();

export function mountExperience(section: HTMLElement): ExperienceHandle {
  const existing = mounts.get(section);
  if (existing) return existing;
  const handle = createHandle(section);
  mounts.set(section, handle);
  return handle;
}

function createHandle(section: HTMLElement): ExperienceHandle {
  const runwayEl = section.querySelector<HTMLElement>('.runway');
  const stageEl = section.querySelector<HTMLElement>('.stage');
  const cardEls = Array.from(section.querySelectorAll<HTMLElement>('.timeline-card'));

  let exp: Experience = { mode: 'flat' };
  let deadEnv: Environment | null = null; // context-lost env, kept until restore or destroy
  let colors: ThemeColors = readThemeColors(section);
  const ladder = { tier: 'full' as Tier, stepDowns: 0 }; // sticky for this mount's life
  const input: InputState = { pointer: { x: 0, y: 0 }, parallax: { x: 0, y: 0 } };
  const loop = { raf: null as number | null, last: 0, emaMs: 0, frames: 0, active: false };
  let destroyed = false;
  let resizeTimer: number | undefined;

  const decideMode = (): '3d' | 'flat' => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'flat';
    if (window.innerWidth < CORRIDOR.MIN_3D_WIDTH) return 'flat';
    if (!runwayEl || !stageEl || cardEls.length < 2) return 'flat';
    return '3d';
  };

  const writeFlat = (): void => {
    Object.assign(window, { __exp3d: { mode: 'flat' } });
  };

  // Last written debug values, so the theme observer can refresh the debug
  // contract even while the frame loop is gated off.
  let debugState: { p: number; pose: CameraPose } | null = null;

  const writeDebug = (p: number, pose: CameraPose): void => {
    if (exp.mode !== '3d') return;
    debugState = { p, pose };
    const tier: 'full' | 'lite' | 'off' = exp.gl?.tier ?? 'off';
    window.__exp3d = {
      mode: '3d',
      progress: p,
      camZ: pose.z,
      lookX: pose.lookX,
      cards: exp.corridor.entries.map((entry) => ({
        index: entry.placement.index,
        lane: entry.placement.lane,
        x: entry.placement.x,
        z: entry.placement.z,
        opacity: entry.el.style.opacity,
        visible: entry.object.visible,
        rotationY: entry.object.rotation.y,
      })),
      env: {
        tier,
        phase: loop.active && !document.hidden ? 'live' : 'off',
        stepDowns: ladder.stepDowns,
        msEMA: loop.emaMs,
        bg: colors.bg,
      },
    };
  };

  const dampParallax = (dt: number): void => {
    const k = 1 - Math.exp(-PARALLAX.DAMPING * dt); // frame-rate independent lerp
    input.parallax.x += (input.pointer.x - input.parallax.x) * k;
    input.parallax.y += (input.pointer.y - input.parallax.y) * k;
  };

  const rebuildEnv = (tier: EnvTier): void => {
    if (exp.mode !== '3d') return;
    const old = exp.gl ?? deadEnv;
    if (old) {
      old.teardown();
      deadEnv = null;
    }
    exp.gl = null;
    try {
      exp.gl = createEnvironment({
        stage: stageEl as HTMLElement,
        scene: exp.corridor.scene,
        layout: exp.corridor.layout,
        colors,
        tier,
        onContextLost: () => {
          if (exp.mode === '3d') {
            deadEnv = exp.gl;
            exp.gl = null;
          }
        },
        onContextRestored: () => rebuildEnv('lite'),
      });
      ladder.tier = tier;
    } catch (error) {
      console.warn('Work Experience environment rebuild failed:', error);
      ladder.tier = 'off';
    }
  };

  const applyWatchdog = (): void => {
    const next = nextTier(ladder.tier, loop.emaMs);
    if (next === ladder.tier) return;
    ladder.tier = next;
    ladder.stepDowns++;
    console.info(`exp3d: frame EMA ${loop.emaMs.toFixed(1)}ms, stepping tier to ${next}`);
    if (next === 'off' && exp.mode === '3d') {
      exp.gl?.teardown();
      exp.gl = null;
    } else if (next === 'lite') {
      rebuildEnv('lite');
    }
  };

  const renderFrame = (now: number, pOverride?: number): void => {
    if (exp.mode !== '3d') return;
    const corridor = exp.corridor;
    const dt = loop.last ? Math.min(0.05, Math.max(0, (now - loop.last) / 1000)) : 0;
    loop.last = now;
    loop.frames++;
    if (loop.frames % 60 === 0) applyWatchdog();

    // Read gl after the watchdog: a tier drop tears the env down mid-frame.
    const gl = exp.gl;
    const p = pOverride ?? corridor.progress();
    const t0 = performance.now();
    dampParallax(dt);
    const pose = composePose(cameraAt(p, corridor.layout.placements), input.parallax);

    corridor.camera.position.set(pose.x, 0, pose.z); // the only camera writer
    corridor.camera.lookAt(pose.lookX, pose.lookY, pose.z - CORRIDOR.LOOK_AHEAD);

    corridor.applyFrame(pose, p); // card opacity/visible/rotation
    gl?.update(dt, pose, p); // dust, glow pulse
    corridor.renderer.render(corridor.scene, corridor.camera); // DOM above
    gl?.renderer.render(corridor.scene, corridor.camera); // canvas below, Reflector sub-render inside
    writeDebug(p, pose);
    // The watchdog watches frame WORK, not the rAF cadence: a 60Hz display
    // paces frames at 16.7ms wall time no matter how little the frame does,
    // so a dt-based EMA would step every tier down on every machine.
    loop.emaMs = loop.emaMs * 0.9 + (performance.now() - t0) * 0.1;
  };

  const schedule = (): void => {
    if (loop.raf !== null || destroyed || !loop.active || document.hidden || exp.mode !== '3d') return;
    loop.raf = requestAnimationFrame(frame);
  };
  const cancel = (): void => {
    if (loop.raf !== null) {
      cancelAnimationFrame(loop.raf);
      loop.raf = null;
    }
  };
  const frame = (now: number): void => {
    loop.raf = null;
    if (loop.active && !document.hidden && exp.mode === '3d') renderFrame(now);
    schedule();
  };
  const activate = (): void => {
    loop.active = true;
    if (document.hidden) return;
    renderFrame(performance.now()); // synchronous frame 0 before the first rAF
    schedule();
  };
  const deactivate = (trigger: ScrollTrigger): void => {
    loop.active = false;
    cancel();
    if (document.hidden) return;
    // One settled frame at the boundary's true progress: leaving at the end
    // must show the last card at full opacity, not the last eased sample.
    renderFrame(performance.now(), trigger.progress);
  };

  const enter3d = (): void => {
    if (!runwayEl || !stageEl) throw new Error('corridor DOM missing');
    section.classList.add('is-3d');
    runwayEl.hidden = false;

    const renderer = new CSS3DRenderer();
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.zIndex = '1';
    // The container divs must never win a hit test: elementFromPoint has to
    // resolve to the cards. The card elements set pointer-events: auto.
    renderer.domElement.style.pointerEvents = 'none';
    stageEl.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(CORRIDOR.FOV, 1, 1, 20000);
    const entries: CardEntry[] = [];

    try {
      const width = stageEl.clientWidth;
      const height = stageEl.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      for (const [index, el] of cardEls.entries()) {
        const article = el.parentElement as HTMLElement;
        const placement = place(index, cardEls.length, width);
        const object = new CSS3DObject(el);
        object.position.set(placement.x, 0, placement.z);
        object.rotation.y = -placement.lane * CORRIDOR.TURN; // left lane faces +x, toward center
        scene.add(object);
        entries.push({ el, article, object, placement });
      }

      const layout = layoutFor(width, cardEls.length);

      const applyFrame = (pose: CameraPose, p: number): void => {
        const travel = layout.travel;
        for (const entry of entries) {
          const { placement } = entry;
          const distance = Math.abs(p - placement.readAt) * travel;
          const face = Math.max(0, 1 - distance / CORRIDOR.BILLBOARD_REACH);
          // Blend the fixed lane turn toward facing the camera, so the card
          // being read sits flat while the corridor still reads as a corridor.
          const billboard = Math.atan2(pose.lookX - placement.x, pose.z - placement.z);
          entry.object.rotation.y = -placement.lane * CORRIDOR.TURN * (1 - face) + billboard * face;
          // CSS3DRenderer does no frustum culling; a card at or behind the camera
          // plane would project mirrored and blow up across the stage.
          entry.object.visible = pose.z - placement.z > CORRIDOR.CULL_DISTANCE;
          entry.el.style.opacity = cardOpacity(p, placement, travel).toFixed(3);
        }
      };

      // Drive a proxy with a scrub-tween so progress eases after scroll stops.
      // The tween owns proxy.p; the frame loop reads it. onUpdate no longer
      // renders: one rAF loop is the only place rendering happens.
      const proxy = { p: 0 };
      const tween = gsap.to(proxy, {
        p: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: runwayEl,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onEnter: activate,
          onLeave: deactivate,
          onEnterBack: activate,
          onLeaveBack: deactivate,
        },
      });
      const trigger = tween.scrollTrigger as ScrollTrigger;

      const teardown = (): void => {
        tween.kill();
        for (const entry of entries) {
          entry.el.style.opacity = '';
          entry.article.appendChild(entry.el);
        }
        renderer.domElement.remove();
      };

      const corridor: Corridor = {
        scene,
        camera,
        renderer,
        entries,
        layout,
        tween,
        trigger,
        progress: () => proxy.p,
        applyFrame,
        teardown,
      };

      // Enter order: corridor first, then the environment inside its own
      // try/catch. An environment failure warns and leaves gl null: the cards
      // are the product, the environment is a progressive enhancement.
      exp = { mode: '3d', corridor, gl: null };
      try {
        if (ladder.tier !== 'off') {
          rebuildEnv(ladder.tier === 'lite' ? 'lite' : 'full');
        }
      } catch (error) {
        console.warn('Work Experience environment disabled:', error);
        exp.gl = null;
      }
      // Setup frame at p=0: all cards are visible there, so the CSS3D
      // renderer appends every card element into the stage DOM (invisible
      // cards are skipped), and the stage never shows unrendered cards
      // while scrolling toward the runway before onEnter.
      renderFrame(performance.now(), 0);
      if (trigger.isActive) activate(); // rebuilt mid-range (rewiden): resume now
    } catch (error) {
      // Corridor setup failed: put every card back in the flat timeline.
      for (const entry of entries) {
        entry.el.style.opacity = '';
        entry.article.appendChild(entry.el);
      }
      renderer.domElement.remove();
      section.classList.remove('is-3d');
      runwayEl.hidden = true;
      throw error;
    }
  };

  const exit3d = (): void => {
    cancel();
    loop.active = false;
    if (exp.mode === '3d') {
      exp.gl?.teardown();
      exp.corridor.teardown();
    }
    deadEnv?.teardown();
    deadEnv = null;
    exp = { mode: 'flat' };
    section.classList.remove('is-3d');
    if (runwayEl) runwayEl.hidden = true;
    writeFlat();
  };

  const syncForResize = (): void => {
    const mode = decideMode();
    if (mode === '3d' && exp.mode === 'flat') {
      try {
        enter3d();
      } catch (error) {
        console.warn('Work Experience corridor disabled:', error);
      }
      return;
    }
    if (mode === 'flat' && exp.mode === '3d') {
      exit3d();
      return;
    }
    if (exp.mode === '3d' && stageEl) {
      const width = stageEl.clientWidth;
      const height = stageEl.clientHeight;
      exp.corridor.renderer.setSize(width, height);
      exp.corridor.camera.aspect = width / height;
      exp.corridor.camera.updateProjectionMatrix();
      exp.corridor.layout = layoutFor(width, cardEls.length);
      for (const entry of exp.corridor.entries) {
        entry.placement = exp.corridor.layout.placements[entry.placement.index];
        entry.object.position.x = entry.placement.x;
      }
      exp.gl?.renderer.setSize(width, height);
      exp.gl?.relayout(exp.corridor.layout);
      ScrollTrigger.refresh();
      renderFrame(performance.now());
    }
  };

  const onResize = (): void => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(syncForResize, 150);
  };

  const onVisibility = (): void => {
    if (document.hidden) {
      cancel();
    } else if (loop.active) {
      renderFrame(performance.now());
      schedule();
    }
  };

  // The pointer listener is gated on fine pointers; coarse pointers keep the
  // camera at rest. The loop damps `parallax` toward `pointer` each frame.
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const onPointerMove = (event: PointerEvent): void => {
    input.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    input.pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  };
  if (finePointer) window.addEventListener('pointermove', onPointerMove);

  // Theme follows the same observer path as the cards: a MutationObserver on
  // data-theme re-reads the CSS custom properties and re-tints the env.
  const themeObserver = new MutationObserver(() => {
    colors = readThemeColors(section);
    if (exp.mode === '3d') {
      exp.gl?.setTheme(colors);
      if (!loop.active && debugState) writeDebug(debugState.p, debugState.pose);
    }
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibility);

  try {
    if (decideMode() === '3d') {
      enter3d();
    } else {
      writeFlat();
    }
  } catch (error) {
    exit3d();
    console.warn('Work Experience corridor disabled:', error);
  }

  const destroy = (): void => {
    if (destroyed) return;
    destroyed = true;
    cancel();
    loop.active = false;
    window.removeEventListener('resize', onResize);
    if (finePointer) window.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('visibilitychange', onVisibility);
    themeObserver.disconnect();
    exit3d();
  };

  return { destroy };
}
