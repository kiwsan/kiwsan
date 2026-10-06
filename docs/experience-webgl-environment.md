# Hybrid WebGL environment under the CSS3D corridor

Synthesized design package. Base: sonnet candidate. Grafts from opus candidate (marked). Both candidate packages at `/tmp/arena-corridor-env/candidate-{sonnet,opus}/` during synthesis.

## Problem

`WorkExperience.astro` runs a CSS3D corridor that owns every invariant the site cares about: crisp HTML cards, a scroll-scrubbed camera, a verified readability contract (`tests/corridor-check.mjs`), flat and no-JS fallbacks. This change adds a WebGL environment layer behind it: an obsidian floor with specular neon reflections, fog, dust, glow, mouse parallax, a damped camera. The shape is non-obvious because two renderers must share one camera without drift, a pointer actor and a scroll actor both want the camera, and the verification contract cannot regress even when WebGL is slow or absent. The constraint that dominates everything: corridor-check drives headless chromium whose WebGL is SwiftShader software rendering, with 450ms sample waits baked into the sweep, so no full-screen post-processing chain may sit on the frame budget.

## Synthesis decision

Base sonnet, 29–25 over opus on the arena rubric (cross-judge and orchestrator scores agree). Sonnet wins the two load-bearing criteria: caller surface depth (two names, `mountExperience` + `destroy`) and data structure quality (the `Experience` discriminated union, `null` as dead environment, `CameraBase`/`CameraPose` split). Opus wins renderer/loop composition only, where its ownership law is the cleanest fork (d) statement of either package.

Grafted from opus onto sonnet:

1. ScrollTrigger `onEnter`/`onLeave` loop gating. Sonnet's tradeoff text claims on-screen bounding but its loop pseudocode has no gate; opus gates the loop and renders frame 0 synchronously on enter.
2. The `elementFromPoint` hit-test criterion, the best z-order check in either package.
3. Per-card pad and strip brightness driven by the same `cardOpacity` the DOM cards use, remapped from `[DIM_FLOOR, 1]` to `[0.25, 1]`, so the environment breathes on the corridor's own rhythm.
4. A `phase` and `stepDowns` field in `__exp3d.env` so ladder and context-loss regressions are visible to corridor-check.
5. The `NoToneMapping` note: the canvas must melt into the page background, and fog must never seam against the clear color.
6. Bloom as an explicit non-goal for this change: if bloom is ever wanted, gate it behind a capability probe plus a hysteresis watchdog, never as the CI base tier.

Rejected from both: two synced scenes/cameras (drift by construction), texture-baking cards (forbidden by task), `UnrealBloomPass` as base tier (full-screen pass chain on SwiftShader), keeping the corridor inline in the .astro script (pure math untestable outside a browser, and `astro check` becomes the only gate).

Dropout: the fable runner seat died (`model_not_found: claude-fable-5-1`); arena proceeded with N−1 per its Phase B rule.

## Usage (caller's view)

The component script shrinks to one call and one handle.

```astro
<!-- src/components/WorkExperience.astro, the entire <script> -->
<script>
  import { mountExperience } from '../lib/exp3d/experience';

  const section = document.getElementById('experience') as HTMLElement;
  const handle = mountExperience(section);

  // Astro's client router may swap pages; release the 3D world before the
  // section dies. destroy() is idempotent.
  document.addEventListener('astro:before-swap', () => handle.destroy(), { once: true });
</script>
```

Second call site, the verification contract. Corridor-check reads, and the module writes, every frame; the `env` block is additive, everything else unchanged:

```js
window.__exp3d = {
  mode: '3d',
  progress: p,
  camZ: pose.z,
  lookX: pose.lookX,
  cards: [{ index, lane, x, z, opacity, visible, rotationY }], // unchanged shape
  env: { tier: 'full' | 'lite' | 'off', phase: 'live' | 'off', stepDowns, msEMA, bg: '#1a1b26' },
};
```

Third call site, a node unit test of the pure math (Node 24 runs TypeScript directly, no loader):

```js
// tests/layout.test.mjs (new, run with `node tests/layout.test.mjs`)
import { place, cameraAt, composePose } from '../src/lib/exp3d/layout.ts';
assert.equal(cameraAt(0, placeAll(6, 1440)).z, 0);
assert.equal(composePose(cameraAt(0, ps), { x: 1, y: 0 }).z, 0); // parallax never writes z
```

## Shape

### Module map

Three files, each owning one body of knowledge. A reader traces any question in two hops: component -> experience.ts -> layout.ts or environment.ts.

- `src/lib/exp3d/layout.ts` — pure corridor math, no DOM, no three. `Placement`, `Layout`, `CameraBase`, `CameraPose`, `composePose`, the `CORRIDOR` constants, the tier ladder policy.
- `src/lib/exp3d/environment.ts` — the WebGL world. Creates and owns every three object (floor, strips, walls, glow sprites, dust), the renderer, theme colors, context-loss wiring, disposal.
- `src/lib/exp3d/experience.ts` — the shell. DOM queries, `decideMode`, enter/exit/resize lifecycle, the frame loop, pointer capture, the frame watchdog, the theme observer, the `__exp3d` export.
- `src/env.d.ts` — gains a `declare global` typing for `window.__exp3d` so `astro check` sees the debug contract.

### Data structures first

The domain has exactly four live states, encoded as one discriminated union instead of booleans that must agree. `gl` alive with mode flat is unrepresentable:

```ts
// experience.ts
type Experience =
  | { mode: 'flat' }                                                    // no corridor, no gl
  | { mode: '3d'; corridor: Corridor; gl: Environment | null };         // corridor always, env optional
```

Corridor owns the shared scene and camera. Environment is optional on top of it, never the other way around. A dead environment is `null`, not a tier value, so the type cannot describe a live renderer with tier off.

```ts
// layout.ts
export type Lane = -1 | 1;

export interface Placement {
  index: number;
  lane: Lane;
  x: number;        // world units: lane * laneOffset(width)
  z: number;        // -(READ_DISTANCE + index * SPACING), always negative
  readAt: number;   // progress in [0, 1] where this card is current
}

// Base pose is scroll-owned; Pose is what the frame loop writes to the camera.
// pose.z === base.z by construction, so the monotonic camZ contract stays provable.
export interface CameraBase { z: number; lookX: number; }

export interface CameraPose {
  z: number;        // scroll-owned, parallax never writes it
  x: number;        // parallax shift
  lookX: number;    // base look + parallax
  lookY: number;    // parallax tilt, 0 at rest
}

export interface Parallax { x: number; y: number; }  // each in [-1, 1], (0, 0) = today's camera

// The single layout both worlds consume. Environment geometry derives from
// placements, never from constants, so cards and env features cannot drift.
export interface Layout {
  placements: Placement[];
  count: number;
  laneOffset: number;
  travel: number;
  corridor: { zMin: number; zMax: number };
}

export const CORRIDOR = {
  READ_DISTANCE: 800, SPACING: 950, FOV: 55,
  TURN: (20 * Math.PI) / 180,
  DIM_REACH: 2800, DIM_FLOOR: 0.55,
  CULL_DISTANCE: 120, MIN_3D_WIDTH: 769, LOOK_AHEAD: 1200,
} as const;

export const PARALLAX = { LOOK: 80, SHIFT: 50, TILT: 120, DAMPING: 8 } as const;

export function laneOffset(width: number): number {
  return Math.min(260, width * 0.18);
}
export function place(index: number, count: number, width: number): Placement { not implemented }
export function cameraAt(p: number, placements: Placement[]): CameraBase { not implemented }
export function cardOpacity(p: number, placement: Placement, travel: number): number { not implemented }
export function layoutFor(width: number, count: number): Layout { not implemented }
// The only place camera pose leaves the pure domain. Invariants: pose.z === base.z;
// (0, 0) parallax reproduces today's camera exactly.
export function composePose(base: CameraBase, parallax: Parallax): CameraPose { not implemented }

// Tier ladder policy, pure so a node test can pin it. Policy: EMA > TIER_MS over
// a 60-frame window steps down one level, sticky for the session. TIER_MS = 12.
export type Tier = 'full' | 'lite' | 'off';
export function nextTier(tier: Tier, frameEmaMs: number): Tier { not implemented }
```

```ts
// environment.ts
export type EnvTier = 'full' | 'lite';  // 'off' is represented by null in Experience

export interface ThemeColors {
  bg: string; primary: string; secondary: string; muted: string;
}

export interface Environment {
  readonly renderer: THREE.WebGLRenderer;
  readonly canvas: HTMLCanvasElement;
  readonly root: THREE.Group;       // everything env-shaped lives under this group
  tier: EnvTier;
  update(dt: number, pose: CameraPose, p: number): void;  // dust drift, glow pulse via cardOpacity
  relayout(layout: Layout): void;   // resize: strips, walls, underglows follow the new lanes
  setTheme(colors: ThemeColors): void;  // scene.background, fog color, material colors
  teardown(): void;                 // dispose geometries, materials, textures, render targets
}

export interface EnvironmentOptions {
  stage: HTMLElement;
  scene: THREE.Scene;               // the corridor's shared scene
  layout: Layout;
  colors: ThemeColors;
  onContextLost: () => void;        // experience sets gl = null, corridor keeps running
  onContextRestored: () => void;    // experience rebuilds at 'lite'
}

// Throws only when a WebGL context cannot be created. The caller catches,
// warns, and keeps the corridor, so a GPU-less machine still gets crisp cards.
export function createEnvironment(options: EnvironmentOptions): Environment { not implemented }

// Boundary parse of CSS custom properties; falls back to the design tokens
// when a variable is missing or not a color (boundary-discipline).
export function readThemeColors(section: HTMLElement): ThemeColors { not implemented }
```

```ts
// experience.ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import { createEnvironment } from './environment';

export interface ExperienceHandle {
  destroy(): void;  // idempotent full teardown; safe to call twice
}
export function mountExperience(section: HTMLElement): ExperienceHandle { not implemented }
// Mounting is idempotent too: a WeakMap<HTMLElement, ExperienceHandle> returns
// the live handle on a second call, which covers Astro HMR re-running scripts.

interface CardEntry {
  el: HTMLElement;
  article: HTMLElement;
  object: CSS3DObject;
  placement: Placement;
}

// Corridor owns the shared scene and camera and the CSS3D half of the frame.
interface Corridor {
  scene: THREE.Scene;               // shared: env.root hangs here, both renderers read it
  camera: THREE.PerspectiveCamera;
  renderer: CSS3DRenderer;
  entries: CardEntry[];
  layout: Layout;
  tween: gsap.core.Tween;           // scrub tween still owns proxy.p; its smoothing is the scroll damping
  trigger: ScrollTrigger;
  progress: () => number;           // returns proxy.p, the scrub-smoothed value
  applyFrame: (pose: CameraPose, p: number) => void;  // card DOM only, no renderer call
  teardown: () => void;             // kill tween, re-parent cards, remove DOM, clear styles
}

// Per-actor input state. The pointermove listener writes only `pointer`; the
// frame loop writes only `parallax`. No actor writes another actor's state;
// the merge happens at the frame read boundary.
interface InputState {
  pointer: Parallax;    // latest raw pointer position, [-1, 1], (0, 0) until first move
  parallax: Parallax;   // damped, converges to pointer
}
```

### The frame loop, the one place rendering happens

ScrollTrigger's `onUpdate` stops calling render. A single rAF loop owns rendering, and the loop is the only writer of `camera.position` and `camera.lookAt`. Three input channels feed it, each with one owner: the gsap tween owns `proxy.p` (scrub smoothing is the scroll damping), the pointer listener owns `pointer`, the loop owns `parallax`. The pose is composed from all three at the read boundary. Graft 1: the loop is gated by the corridor trigger's `onEnter`/`onLeave`/`onEnterBack`/`onLeaveBack` (plus `document.hidden` pause), so no GPU or DOM work happens while the section is off-screen; enter renders frame 0 synchronously before the first rAF.

```ts
// experience.ts, pseudocode for the tricky logic
function frame(now: number): void {
  if (exp.mode !== '3d' || document.hidden) { reschedule(); return; }
  const { corridor, gl } = exp;
  const dt = clamp((now - loop.last) / 1000, 0, 0.05);
  loop.last = now;
  loop.emaMs = loop.emaMs * 0.9 + dt * 1000 * 0.1;
  // TODO: every 60 frames, if mean frame time > TIER_MS, lowerTier(); sticky,
  // console.info once. full -> reflector off, particles halved; lite -> gl = null.

  const p = corridor.progress();
  damp(input.parallax, input.pointer, dt, PARALLAX.DAMPING);  // frame-rate independent lerp
  const pose = composePose(cameraAt(p, corridor.layout.placements), input.parallax);

  corridor.camera.position.set(pose.x, 0, pose.z);            // the only camera writer
  corridor.camera.lookAt(pose.lookX, pose.lookY, pose.z - CORRIDOR.LOOK_AHEAD);

  corridor.applyFrame(pose, p);                               // card opacity/visible/rotation
  gl?.update(dt, pose, p);                                    // dust, glow pulse
  corridor.renderer.render(corridor.scene, corridor.camera);   // DOM above
  gl?.renderer.render(corridor.scene, corridor.camera);       // canvas below, Reflector sub-render inside
  writeDebug(p, pose, gl?.tier ?? 'off', loop.emaMs);
  loop.raf = requestAnimationFrame(frame);
}
```

Rendering both worlds from one scene and one camera. `CSS3DRenderer` walks the scene and renders only `CSS3DObject`s; `WebGLRenderer` renders only meshes and points. The object kinds are disjoint, so one shared scene graph cannot cross-render, and camera drift between the layers is impossible by construction. Canvas goes into the stage first (absolute, z-index 0, `aria-hidden="true"`, `pointer-events: none`), the CSS3D element second (z-index 1). Parallax listens on `window` gated on `matchMedia('(pointer: fine)')`; card hover stays as today.

Environment contents, all derived from `layout.placements`:

- Clear color = `bg` token, `NoToneMapping` (graft 5): the canvas melts into the page background and fog never seams against it. Tone mapping would shift fog-blended pixels against the raw clear color.
- Floor: one `three/addons/objects/Reflector.js` plane at a fixed 512x256 render target, spanning the corridor plus the read distance at each end. It mirrors only WebGL geometry (strips, dust), never the cards, which is exactly the wanted effect and avoids mirrored text. `lite` tier drops it for a plain dark plane.
- Walls: two planes at `x = +/- (laneOffset + wallGap)`, surface token #24283b with a faint #414868 edge.
- Neon strips: continuous rails along the walls at `x = +/- laneOffset`, color #7aa2f7, plus one under-glow bar per card at its `placement.x/z`. Brightness follows `cardOpacity(p, placement, travel)` remapped from `[DIM_FLOOR, 1]` to `[0.25, 1]` (graft 3).
- Dust: one `THREE.Points`, ~800 vertices in full tier, 300 in lite, color #9aa5ce, opacity ~0.5, `depthWrite: false`, `fog: true`, inside the corridor span, drifting on the CPU each frame with z wrapped modulo the span.
- Fog: `FogExp2`, density derived from the corridor span so the far end fades into the background by the last card. Fog affects GL meshes only; DOM cards are untouched, so readability is unaffected.

No composer, no lights, no shadows. Glow is the emissive strips plus additive sprites and fog. Budget: environment layer at most 4 ms/frame at 1440p on integrated graphics, reflector sub-render at most 1 ms, `pixelRatio` clamped to 2. Degradation triggers in order: WebGL context creation failure or loss turns the env off while the corridor keeps rendering; the frame watchdog steps full to lite to off at 12 ms EMA, sticky within the session; `document.hidden` pauses the loop; reduced motion and width under 769 fall to flat exactly as today.

### Lifecycle

Enter order builds the corridor first, then the environment inside its own try/catch. A corridor setup failure tears everything down and rethrows, as today. An environment failure warns and leaves `gl` null: the cards are the product, the environment is a progressive enhancement, and this asymmetry is the load-bearing decision. Exit order runs the loop down, then `gl.teardown()`, then `corridor.teardown()`. Both transitions are idempotent, which the rewiden test (narrow to flat, widen to 3d) exercises. Resize re-derives `layoutFor(width, count)`, re-places lanes, calls `gl?.relayout(layout)`, resizes both renderers, refreshes ScrollTrigger, and renders once immediately. Context loss calls the options callbacks; restore rebuilds at lite and stays off on failure. Theme follows the same observer path as the cards: a MutationObserver on `data-theme` re-reads CSS custom properties and calls `gl?.setTheme`, so the environment responds to the light theme the same way the card surfaces do.

## Decisions on open questions

- Theme: the environment follows the `data-theme` flip via `setTheme`, not a forced-dark observatory. Corridor-check asserts theme response of card surfaces; an environment that follows tokens stays coherent with the page.
- Sticky tier: accepted. The watchdog steps down but never climbs back within a session.
- Touch parallax: not synthesized from scroll velocity in this change. Parallax stays at rest on coarse pointers (the `pointer: fine` gate).
- Node test: `tests/layout.test.mjs` imports the .ts directly; Node 24 runs TypeScript with type stripping, no loader dependency.
- Idle-settle pause: skipped. The viewport gate (graft 1) plus `document.hidden` pause bound the battery cost; an idle-settle state machine is real complexity for a later change.

## Success criteria

Each criterion is phrased so `tests/corridor-check.mjs` or `tests/e2e` can check it mechanically.

1. Every existing corridor-check assertion passes unmodified: mode 3d, 6 cards, no horizontal overflow at 1440/1024/800, a readable card at every sweep sample, camZ monotonic, rotateY sign at p=0, cull coverage at or below 0.75, mobile flat with 6 restored cards, rewiden rebuild, card theme response, reduced-motion flat, no-JS static.
2. In 3d mode, `__exp3d.env` exists with tier full or lite at the boot sample, `env.bg` equals the page's `--color-bg` token before the theme flip and changes after `data-theme='light'`, and `phase`/`stepDowns` are present (graft 4).
3. The stage contains exactly one canvas in 3d mode, it precedes the CSS3D container in the stage, carries `aria-hidden="true"` and `pointer-events: none`, and page scrollWidth stays within 1px of clientWidth at all three widths.
4. The readability sweep still finds at least one readable card at every sample with the pointer pinned to a viewport corner before sampling, proving parallax at full deflection cannot push the current card out of reach.
5. camZ at a fixed scroll position is identical before and after moving the pointer, proving parallax never writes z.
6. `elementFromPoint` at a readable card's center resolves to the card or one of its descendants, never the canvas (graft 2).
7. All six `.timeline-card` elements remain live HTML in the stage with intact h3, company, and period text in 3d mode, proving no texture baking; the a11y e2e spec passes unchanged.
8. Flat, reduced-motion, and no-JS sessions contain no canvas in the stage and report `__exp3d.mode === 'flat'` exactly as today.
9. Cycling narrow-to-wide three times leaves exactly one canvas and no orphaned nodes in the stage, proving dispose does not leak across enter/exit cycles.
10. No console errors in any session; the watchdog announces tier drops via `console.info` only. `nextTier` is pure and exported, pinned by the node test.

## Next implementation step

Create `src/lib/exp3d/layout.ts` by moving `place`, `cameraAt`, `cardOpacity`, `laneOffset`, and the `CORRIDOR` constants verbatim out of the component script, re-point the component at it, and re-run corridor-check before any WebGL code exists.

## Implementation reconciliation

Recorded during implementation; each entry names the deviation, the evidence, and why the design still holds.

1. **Watchdog EMA measures frame work, not rAF cadence.** The spec's pseudocode derives the EMA from `now - loop.last`. A 60 Hz display paces frames at 16.7 ms wall time regardless of work, so a dt-based EMA exceeds TIER_MS (12) on every real machine. Measured in headless chromium with the environment at tier off (no canvas at all): EMA stayed 16.6-16.7 ms. The EMA now measures `performance.now()` around the frame's work (steady state ~0.4-0.5 ms under SwiftShader), which is the only reading consistent with the spec's own budget ("environment layer at most 4 ms/frame"). The dt still drives dust drift and parallax damping.
2. **ElementFromPoint cannot resolve the cards on Blink (criterion 6).** A full-viewport scan over the corridor finds zero points that hit-test a `.timeline-card`, even with `pointer-events: auto` forced on every stage element. A minimal repro shows Blink hit-tests a plain `perspective` + `preserve-3d` chain (25/25 hits) but not CSS3DRenderer's `perspective(f) scale(f) translateZ(f) matrix3d(inv)` single-element chain. Card hover has therefore never worked in 3d mode; "card hover stays as today" holds because the flat CSS is untouched. The load-bearing half of the criterion survives structurally: the canvas sits at z-index 0 under the CSS3D container and carries `pointer-events: none`, so it can never win a point. Corridor-check asserts hit-never-canvas, hit-inside-stage, and that the readable card's projected rect contains the point; the card-resolution clause is recorded as blocked by the browser, not by the design.
3. **One mount-time frame and one settled frame per leave transition.** The loop gate alone leaves two visible seams: the sticky stage shows unrendered cards while scrolling toward the runway before onEnter (the scrub tween jumps proxy.p to the current progress at creation, so a mid-range rebuild would render only the currently visible cards, and CSS3DRenderer appends only visible card elements, which the rewiden check caught as `cardsInStage=2`), and leaving at the end freezes the last eased sample (the sweep's final sample read a stale p=0.900 instead of 1.000). Enter now renders frame 0 at p=0 synchronously (all cards visible, all appended) and leave renders one frame at the trigger's true progress. The continuous loop stays fully gated; these are single frames at transitions.
4. **Corridor-check launches chromium with `--enable-unsafe-swiftshader`.** Modern chromium no longer creates software WebGL contexts by default (`canvas.getContext('webgl')` returns null without the flag), which would leave the environment permanently off in CI. The flag restores the SwiftShader premise the spec's budget argument assumes.
5. **Known-noise console filter extended.** The GTM collect pixel moved to `www.google.com/g/collect` and its DNS failure logs a bare `net::ERR_NAME_NOT_RESOLVED`; both appear on clean d860337 and are unrelated to the corridor. The filter now covers both so criterion 10 measures real errors only.
6. **Constants conflict inside the spec.** The doc says to move the constants verbatim, but its own CORRIDOR block names READ_DISTANCE 800, DIM_REACH 2800, DIM_FLOOR 0.55 while the component shipped 700, 2200, 0.75. The task's unit 1 enumerated the spec values, which the implementation took; corridor-check passes unmodified with them. HOLD (0.62) and BILLBOARD_REACH (2600) stay in CORRIDOR although the spec block omits them, because cameraAt and applyFrame need them.
7. **ThemeColors carries surface and border too.** The spec names the wall colors as tokens (#24283b surface, #414868 border) but its ThemeColors interface has only four fields, which would pin the walls to dark constants under the light theme. readThemeColors reads all six custom properties with design-token fallbacks; the four spec fields are unchanged.
8. **EnvironmentOptions gains a tier field.** The spec's interface listing omits it, but the watchdog's lite rebuild and restore-at-lite need createEnvironment to build the right tier. Additive only.
9. **Rails' brightness follows the nearest card.** The spec says strips follow cardOpacity(p, placement, travel) but a continuous rail has no placement; the implementation uses the placement nearest to p so the rails breathe on the corridor's rhythm.
10. **Renderer created without antialias.** SwiftShader pays MSAA per frame and the environment is flat-shaded fog and glow; the spec does not require AA and the watchdog budget benefits.
11. **No-JS sessions report no __exp3d, exactly as today.** Criterion 8's "report __exp3d.mode === 'flat'" cannot apply to a page whose scripts never run; corridor-check asserts canvas absence there and mode flat in the JS sessions.
