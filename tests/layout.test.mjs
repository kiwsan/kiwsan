// Node unit test for the pure corridor math. Node 24 runs the .ts directly
// via type stripping, no loader. Run with `node tests/layout.test.mjs`.
import assert from 'node:assert/strict';
import {
  CORRIDOR,
  PARALLAX,
  TIER_MS,
  cameraAt,
  cardOpacity,
  composePose,
  laneOffset,
  layoutFor,
  nextTier,
  place,
} from '../src/lib/exp3d/layout.ts';

const placeAll = (count, width) => Array.from({ length: count }, (_, i) => place(i, count, width));
const ps = placeAll(6, 1440);

// The spec's usage block, verbatim intent. cameraAt(0, ...) yields -0 here,
// so the checks use ===, which treats -0 and 0 as equal.
assert.ok(cameraAt(0, placeAll(6, 1440)).z === 0);
assert.ok(composePose(cameraAt(0, ps), { x: 1, y: 0 }).z === 0); // parallax never writes z

// place: lanes alternate, z always negative and strictly receding.
assert.deepEqual(ps.map((p) => p.lane), [-1, 1, -1, 1, -1, 1]);
ps.forEach((p, i) => assert.equal(p.z, -(CORRIDOR.READ_DISTANCE + i * CORRIDOR.SPACING)));
ps.forEach((p, i) => assert.equal(p.readAt, i / 5));
assert.equal(ps[0].x, -laneOffset(1440));
assert.equal(laneOffset(1440), Math.min(260, 1440 * 0.18));

// cameraAt: z starts at 0, never increases, ends at -travel.
const camZs = Array.from({ length: 21 }, (_, i) => cameraAt(i / 20, ps).z);
assert.ok(camZs[0] === 0);
assert.ok(camZs.every((z, i) => i === 0 || z <= camZs[i - 1]), 'camZ must be monotonic');
assert.ok(Math.abs(camZs[20] - -CORRIDOR.SPACING * 5) < 1e-9);

// cardOpacity: full at the read point, bounded by DIM_FLOOR, symmetric.
const travel = CORRIDOR.SPACING * 5;
assert.equal(cardOpacity(ps[2].readAt, ps[2], travel), 1);
assert.ok(cardOpacity(0.5, ps[0], travel) >= CORRIDOR.DIM_FLOOR);
assert.equal(
  cardOpacity(ps[2].readAt + 0.05, ps[2], travel),
  cardOpacity(ps[2].readAt - 0.05, ps[2], travel)
);

// composePose: (0, 0) parallax reproduces today's camera exactly.
const base = cameraAt(0.4, ps);
assert.deepEqual(composePose(base, { x: 0, y: 0 }), { z: base.z, x: 0, lookX: base.lookX, lookY: 0 });
const deflected = composePose(base, { x: 1, y: -1 });
assert.equal(deflected.z, base.z);
assert.equal(deflected.x, PARALLAX.SHIFT);
assert.equal(deflected.lookX, base.lookX + PARALLAX.LOOK);
assert.equal(deflected.lookY, -PARALLAX.TILT);

// layoutFor: placements derived once, span covers every card.
const layout = layoutFor(1024, 6);
assert.equal(layout.count, 6);
assert.equal(layout.placements.length, 6);
assert.equal(layout.corridor.zMin, -(CORRIDOR.READ_DISTANCE + 5 * CORRIDOR.SPACING));
assert.equal(layout.corridor.zMax, -CORRIDOR.READ_DISTANCE);
assert.equal(layout.laneOffset, laneOffset(1024));

// Tier ladder: steps down one level above TIER_MS, sticky below it, off is terminal.
assert.equal(nextTier('full', TIER_MS), 'full');
assert.equal(nextTier('full', TIER_MS + 1), 'lite');
assert.equal(nextTier('lite', TIER_MS + 1), 'off');
assert.equal(nextTier('lite', TIER_MS - 1), 'lite');
assert.equal(nextTier('off', TIER_MS + 100), 'off');

console.log('layout tests passed');
