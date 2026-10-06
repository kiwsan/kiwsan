// Pure corridor math. No DOM, no three: a node test imports this file directly
// (Node 24 strips the types) and corridor-check reads the same numbers the
// browser does.

export type Lane = -1 | 1;

export interface Placement {
  index: number;
  lane: Lane;
  x: number; // world units: lane * laneOffset(width)
  z: number; // -(READ_DISTANCE + index * SPACING), always negative
  readAt: number; // progress in [0, 1] where this card is current
}

// Base pose is scroll-owned; Pose is what the frame loop writes to the camera.
// pose.z === base.z by construction, so the monotonic camZ contract stays provable.
export interface CameraBase {
  z: number;
  lookX: number;
}

export interface CameraPose {
  z: number; // scroll-owned, parallax never writes it
  x: number; // parallax shift
  lookX: number; // base look + parallax
  lookY: number; // parallax tilt, 0 at rest
}

export interface Parallax {
  x: number; // each in [-1, 1], (0, 0) = today's camera
  y: number;
}

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
  READ_DISTANCE: 700,
  SPACING: 950,
  FOV: 55,
  TURN: (20 * Math.PI) / 180, // rotateY toward the corridor center
  HOLD: 0.62, // fraction of each segment the camera parks at a card
  BILLBOARD_REACH: 2600, // camera units over which a card turns to face the camera
  DIM_REACH: 2200, // camera units over which a card fades toward its floor
  DIM_FLOOR: 0.75, // far cards stay legible
  CULL_DISTANCE: 120, // hide cards at/behind the camera plane
  MIN_3D_WIDTH: 769,
  LOOK_AHEAD: 1200,
} as const;

export const PARALLAX = { LOOK: 80, SHIFT: 50, TILT: 120, DAMPING: 8 } as const;

// Tier ladder policy, pure so a node test can pin it. Policy: EMA > TIER_MS
// steps down one level, sticky for the session (never climbs back).
export const TIER_MS = 12;
export type Tier = 'full' | 'lite' | 'off';
export function nextTier(tier: Tier, frameEmaMs: number): Tier {
  if (tier === 'off') return 'off';
  if (frameEmaMs <= TIER_MS) return tier;
  return tier === 'full' ? 'lite' : 'off';
}

export function laneOffset(width: number): number {
  return Math.min(260, width * 0.18);
}

export function place(index: number, count: number, width: number): Placement {
  const lane: Lane = index % 2 === 0 ? -1 : 1;
  return {
    index,
    lane,
    x: lane * laneOffset(width),
    z: -(CORRIDOR.READ_DISTANCE + index * CORRIDOR.SPACING),
    readAt: index / (count - 1),
  };
}

// The camera path as a pure function of progress. Each segment parks at a
// card for HOLD of the scroll, then travels to the next card's read point.
// lookX pans piecewise-linearly between adjacent cards' lanes.
export function cameraAt(p: number, placements: Placement[]): CameraBase {
  const travel = CORRIDOR.SPACING * (placements.length - 1);
  const span = 1 / (placements.length - 1);
  const seg = Math.min(placements.length - 2, Math.floor(p / span));
  const t = (p - seg * span) / span;
  const from = placements[seg];
  const to = placements[seg + 1];
  const k = Math.min(1, Math.max(0, (t - CORRIDOR.HOLD) / (1 - CORRIDOR.HOLD)));
  const z = -seg * CORRIDOR.SPACING - (to.readAt - from.readAt) * travel * k;
  const lookX = (from.x + (to.x - from.x) * k) * 0.6;
  return { z, lookX };
}

// Depth cue: cards away from their read position fade toward DIM_FLOOR,
// never below it, so neighbors stay legible while the current card is full.
export function cardOpacity(p: number, placement: Placement, travel: number): number {
  const error = Math.abs(p - placement.readAt) * travel;
  return Math.max(CORRIDOR.DIM_FLOOR, 1 - error / CORRIDOR.DIM_REACH);
}

export function layoutFor(width: number, count: number): Layout {
  const placements = Array.from({ length: count }, (_, i) => place(i, count, width));
  return {
    placements,
    count,
    laneOffset: laneOffset(width),
    travel: CORRIDOR.SPACING * (count - 1),
    corridor: {
      zMin: placements[count - 1].z,
      zMax: placements[0].z,
    },
  };
}

// The only place camera pose leaves the pure domain. Invariants: pose.z === base.z;
// (0, 0) parallax reproduces today's camera exactly.
export function composePose(base: CameraBase, parallax: Parallax): CameraPose {
  return {
    z: base.z,
    x: parallax.x * PARALLAX.SHIFT,
    lookX: base.lookX + parallax.x * PARALLAX.LOOK,
    lookY: parallax.y * PARALLAX.TILT,
  };
}
