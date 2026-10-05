# Arena rubric — Work Experience 3D (GSAP ScrollTrigger)

Task: replace the IntersectionObserver reveal in WorkExperience.astro with a
GSAP ScrollTrigger 3D effect. Candidates A (cinematic rotateX entrance, opus),
B (pinned 3D stack, opus after fable model rejected), C (depth dolly, salvaged
after sonnet seat died on an image-read API error; build verified by parent).

Ground truth (verified in thread): current markup on origin/main is
`article.timeline-item > div.timeline-card` inside `.timeline` with
`.timeline-line` and `.timeline-dot` (commit 4c5bc4a, user's redesign).
e2e page object selects `.work-card`, which matches nothing on main; both
A and C independently added `work-card` as an alias class on the article.

Criteria (0-5 each):
1. Depth readability — does the section read as 3D without hurting text
   legibility; is the effect felt, not gimmicky.
2. Motion quality — scrub smoothness, easing, no jank or overshoot;
   effect hands control back cleanly after settling.
3. Fallback safety — prefers-reduced-motion and no-JS both leave all six
   cards fully visible with h3/.company/.period/.tech-tag reachable;
   mobile degrades; no horizontal overflow, no layout shift.
4. Code quality — diff size and clarity, design tokens used, dead
   observer/CSS removed, markup classes preserved, maintainer story.
5. Theme integrity — works in both dark and light themes, hover polish
   (lift/shadow) survives the GSAP lifecycle.

## Synthesis

Base: A (cinematic entrance). Picked by the parent and the cross-judge
independently: only candidate that pairs a legible 3D read with a clean
hand-off after settling, and every fallback path is green with the e2e
selector fixed.

Grafts into the base:
- try/catch guard clearing inline props on setup failure (from B)
- removal of the dead data-index attribute (from C)

Rejected:
- B as base: pins ~3.6 viewport heights (scroll trap feel), hover lift
  dies after settle, never fixed the .work-card e2e selector
- C's pointer tilt: JS-owned hover on desktop loses the lift under
  reduced motion; A's CSS `translate` hover covers it without JS
- B's preserve-3d avoidance rationale was moot for A's direction
  (A uses per-item perspective, not a shared scene)

Seat notes: B's fable seat rejected by the API (model unavailable),
rerun on opus. C's sonnet seat died on an image-input API error after
implementing; its uncommitted worktree diff was salvaged and
build-verified by the parent.

Verification: npm run build green; node tests/motion-check.mjs passed
all 5 checks (overflow, parked states, reverse scrub, fast jump,
reduced-motion); full e2e suite result in the PR.

## Round 2: real 3D replaces the entrance

The user judged the cinematic entrance not wow and picked the Three.js
direction. Implemented as a CSS3D corridor (three 0.186.1), not WebGL
texture planes, so card text stays DOM-crisp and the e2e/SEO surface
is unchanged. Design decisions: corridor spacing 950 units, read
distance 800, 20 degree lane turn, 400vh runway with sticky stage,
flat fallback on reduced motion/no JS/under 769px. WebGL texture
planes were rejected because text would blur and content would need
duplication for accessibility. Verified by tests/corridor-check.mjs
and the full e2e suite.
