# Feature: GSAP ScrollTrigger 3D work experience

## Round 8: vertical timeline layout (user: scroll then arrange runs + office as a vertical timeline)
- [x] 1. design — one spine down the stage; per job row = rail (period label → mini iso desk + agent → company pill) | full run card; all 6 cards visible & stacked; per-card IO typing reveal; packet travels the spine; chips/hotspots/single-panel removed
- [x] 2. delegate — opencode/deepseek-v4.1-flash-free, commit 4c42961, cherry-picked as 96b2bbf; deviations accepted (short pill only, spine height measured, past-run settle, hover tilt removed)
- [x] 3. lead review — light/dark/mobile screenshots verified; lead fix: caption said oldest→newest while order is newest first (73893b5)
- [x] 4. verify — build clean; chromium e2e 55/55; delegate DOM smoke 25/25 (6 visible cards, all type on scroll, spine/nodes aligned, mobile no overflow)
- [x] 5. commits + PR — pushed 96b2bbf + 73893b5; PR #71 body updated (11 commits)

## Round 7: Work Experience IS the 3D AI Office (user clarified: merge scene into #experience, drop separate #office) — SUPERSEDED by Round 8 (timeline layout)
- [x] 1. design — v3 spec: office stage = grid(scene 1fr | active run card 380px); desks = jobs via generic layoutDesks(n) (back row ceil, front rest, spread 152); pill = deskLabel(company) + period line2; career path dotted polyline 01→06 + traveling packet; panels keep .work-card/.tech-tag/.period/.company/.trace-* contracts; typing on activation, IO once on section; #office + AiOffice.astro + office-shot.mjs deleted same wave
- [x] 2. delegate — opencode/deepseek-v4.1-flash-free, commit 047b21b in own worktree, cherry-picked as 7cc4f71; deviations accepted (two-column collapse ≤1180px, hit box 15%, inset pill ring, centered scene, mobile pills drop period, typing ≤620ms)
- [x] 3. lead review — screenshots light/dark/mobile verified; lead fix: scene-meta row (career floor + agents online · 06 chip, pulse dot) to seat the floor (2c27f3e)
- [x] 4. verify — build clean; chromium e2e 55/55 after lead fix; selector contract confirmed by tests
- [x] 5. commits + PR — pushed 7cc4f71 + 2c27f3e; PR #71 body rewritten for the merged design (9 commits)
- [x] 6. interrogate — not contested; user-driven direction (explicitly chose "Work Experience = 3D AI Office")

## Round 6: additive "Inside the AI Office" showcase (user picked option B after keeping terminal) — SUPERSEDED by Round 7 (folded into #experience)
- [x] 1. `how` — new standalone section; e2e anchor map checked (#experience/#projects/#contact asserted by responsive.spec; nav untouched; .work-card/.tech-tag/.period/.company names must NOT appear in the new component, cards locator declares `.work-card`)
- [x] 2. design — scene topology + zone data table defined in lead brief (6 zones = gateway/MCP wall/infra/OPS pipeline/agent lounge/assist desk; SVG offsets precomputed; zero WebGL)
- [x] 3. checkpoint: blocking = anchor/class collision scan (done); workstreams n/a (one new component + one index import); shared state n/a (delegate sole writer in own worktree); decomposition = one writer (scene art + interaction live in one file)
- [x] 4. delegate worked to opencode/deepseek-v4.1-flash-free — commit 84cce67 in own worktree, cherry-picked as 39fe8d8
- [x] 5. verify — build clean; chromium e2e 55/55 after lead fixes; screenshots light/dark/post-click/mobile + office-numerics; lead fixes: lounge moved to center floor (548,296), SVG text labels dropped, hotspot anchored to label with scaled % hit boxes (b2dd0b7)
- [x] 6. commits: feat(office) + fix(office label seats) + probe office-shot.mjs
- [x] 7. interrogate — not contested; user picked direction B explicitly
- [x] 8. PR: #71 updated with office summary

- [x] 1. `how` (read WorkExperience.astro in full, e2e specs, design tokens) over the affected subsystem
- [x] 2. design exploration via arena (novel UI, exhaust-the-design-space: 3 competing directions) for parallel design exploration
- [x] 3. Throughput checkpoint: gates = arena framing + rubric (docs/arena-rubric.md); workstreams = 3 candidates in own worktrees (A opus done, C salvaged, B rerunning on opus after fable model rejected); shared state eliminated via worktrees, main branch untouched by candidates; synthesis is single-writer by design (arena Phase E graft)
- [x] 5. Verify on the matching surface (merged as PR #69, all checks green)
- [x] 6. Rebase into small, ordered commits
- [ ] 7. `interrogate` if the design is contested
- [x] 8. Opening a PR (#69 merged)

## Round 2: replace cinematic with Three.js real 3D (user picked WebGL museum walk)
- [x] 1. how: CSS3DRenderer/CSS3DObject verified in three 0.186.1 (context7), component read
- [x] 2. design: CSS3DRenderer over WebGL texture planes (crisp text, a11y, no SEO duplication)
- [x] 3. checkpoint: single owner delegate (opus) in own worktree; gates = brief + design; one writer by design
- [x] 4. delegate implementation
- [x] 5. verify: build + e2e + motion-check updated
- [x] 6. commit sequence: replace feat cinematic, keep chore/test/docs
- [x] 8. update PR #69 (merged, d860337)

## Round 5: replace 3D corridor with Terminal / Agent Trace (user picked from 2026-AI menu)
- [x] 1. `how` over the affected subsystem — done inline: exp3d single importer (WorkExperience.astro), e2e selector contract (.work-card/.period/.company/.tech-tag), gsap+three used only by exp3d, layout.test.mjs+corridor-check.mjs are corridor-owned, playwright forces reducedMotion:reduce
- [x] 2. `architect` — n/a design-direction contest: user already picked the direction from the menu (Terminal/Agent Trace); single data shape fixed by existing content frontmatter; design spec written into delegate brief
- [x] 3. Throughput checkpoint:
    - Blocking first steps. Done: importer/e2e/deps triangulation above before fan-out.
    - Independent workstreams. n/a fan-out: one component file + its one lib; splitting markup/CSS/anim creates cross-file contracts with no parallel payoff.
    - Shared mutable state. Single writer by design: delegate worked alone in its own worktree (opencode worktree terminal-agent-trace); main checkout untouched during the write.
    - Smallest safe decomposition. One writer: terminal visual identity lives as one component; delegate = feature model opencode/deepseek-v4.1-flash-free; lead reviewed the diff and verified visually.
- [x] 4. Delegate code-writing to opencode/deepseek-v4.1-flash-free via `general` subagent — commits 059d0af + 0e5d529, own worktree, spec deviations only: role/org lines for e2e classes, `is-live` opacity reset (pending gate), `-- EOF --` form, :global() scoping for html[data-trace]
- [x] 5. Verify on the matching surface — merged 0e5d529 to main, build clean, screenshots led review (light/dark/mobile rest + dark motion mid-frame via tests/trace-shot.mjs), e2e re-run on main: 165 passed (chromium+webkit+mobile-chrome); Firefox unrunnable both in worktree and main (sandbox_extension_issue_file_to_process at browser boot — environment, pre-dates this change)
- [x] 6. Rebase into small, ordered commits: 059d0af feat → 0e5d529 chore(exp3d removal) → 77da4f5 chore(verification probe); local main rolled back to 5db94b6, PR branch from 0e5d529+probe
- [x] 7. `interrogate` — not contested; user picked the direction and visual review agreement between delegate report and lead screenshots
- [x] 8. Opening a PR — https://github.com/kiwsan/kiwsan/pull/71

## Round 3: hybrid WebGL environment under the corridor (user: "wow" upgrade, picked hybrid)
- [ ] 1. `how` over the affected subsystem
- [ ] 2. `architect` for parallel design exploration
  - [x] A Ground: WorkExperience.astro read in full (script, styles, mode switch, cleanup, __exp3d contract), corridor-check.mjs, e2e inventory, global.css tokens (Tokyo Night), package.json
  - [ ] B Sketch: arena, 3 runners (opus/fable/sonnet per architect runners line), runner-prompt.md pass-through, rationale-template.md packages
    - [x] A Frame: rubric = caller-surface depth, data-structure quality, renderer/loop composition, perf/degradation plan, lifecycle integrity, verification alignment
    - [x] B Fan out: 3 background runners → DROPOUT: fable runner died (model_not_found claude-fable-5-1), proceeded with N-1 = opus + sonnet per arena Phase B rule + user directive
    - [x] C Cross-judge: opus judge, verdict 29-25 sonnet (judge.md)
    - [x] D Pick: base sonnet (agreement: judge + orchestrator)
    - [x] E Graft from opus: loop viewport gating, elementFromPoint criterion, cardOpacity-driven pads, env.phase/stepDowns debug, NoToneMapping melt, bloom deferred behind probe+watchdog
    - [x] F Verify: synthesized package re-screened vs design-red-flags (no shallow module, no leakage, no temporal decomposition) and corridor-check constraints
  - [x] Screen candidates vs design-red-flags.md, synthesize (interface depth) → docs/experience-webgl-environment.md
  - [x] C Agree: no checkpoint — synthesized sketch ships as scaffold commit docs/experience-webgl-environment.md
  - [ ] D Implement against sketch (delegate, feature model opus, own worktree)
  - [ ] E Scrap if the sketch keeps producing friction
- [ ] 3. Write the throughput checkpoint as four todo items. A dimension that genuinely does not apply (single file, no fan-out) keeps its item with `n/a: <reason>` rather than being dropped:
  - [x] Blocking first steps. Gates run before fan-out. → gate = synthesized package docs/experience-webgl-environment.md + success criteria, read by delegate before writing
  - [x] Independent workstreams. Disjoint files, services, or layers parallelize. Shared writes serialize. → n/a fan-out: corridor/environment/frame share one scene, one camera, one frame loop; single coherent change
  - [x] Shared mutable state. Default to splitting the target (the **separate-before-serializing-shared-state** principle skill). Serialize only for real invariants. → delegate gets own worktree (isolation: worktree); main untouched; placements/scene stay single-owner inside the module
  - [x] Smallest safe decomposition. If one worker is best, name why. → one writer by design: splitting corridor/env/frame across workers would collide on the shared scene graph and frame loop with no parallel payoff
- [ ] 4. Delegate code-writing to a subagent using your configured feature model with a specific scope (file paths, named data shape and its organizing structure, a state machine over scattered booleans, a table/registry over branching, a typed model over repeated shape assumptions, chosen before the delegate writes logic, and success criteria). When the implementation admits multiple valid shapes (error handling, abstraction layer, test structure), delegate via the **arena** skill instead so the runners surface the alternatives and the cross-judge guards the pick. Mandatory: no skip-with-reason escape. **Give every file-writing delegate its own worktree** and do not write files or run a suite in a worktree a delegate still holds.
- [ ] 5. Verify on the matching surface. "Inconclusive" or wrong-surface is not a pass. Flag it.
- [ ] 6. Rebase into small, ordered commits. Stack follow-ups. Use the **sequence-verifiable-units** principle skill.
- [ ] 7. If the design is contested, `interrogate` before shipping.
- [ ] 8. Run **Opening a PR**.
