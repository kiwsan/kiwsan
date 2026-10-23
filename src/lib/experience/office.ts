export interface CubeGeometry {
  top: string;
  left: string;
  right: string;
}

export interface TowerSpec {
  cx: number;
  halfWidth: number;
  height: number;
  roof?: 'setback' | 'antenna';
}

export interface OfficeProfile {
  pad: number;
  floors: number;
  label: string;
  towers: TowerSpec[];
}

export interface WindowGeometry {
  panes: string;
  lit: string;
}

export interface TowerGeometry extends TowerSpec {
  topY: number;
  depth: number;
  body: CubeGeometry;
  setback: CubeGeometry | null;
  antenna: { x: number; base: number; tip: number } | null;
  windows: { left: WindowGeometry; right: WindowGeometry };
}

export interface OfficeScene {
  pad: CubeGeometry;
  towers: TowerGeometry[];
  peakTop: number;
  sizeLabel: string;
  floors: number;
}

export const BASE_Y = 116;
export const GROUND_Y = 144;
export const CENTER_X = 100;

/* Isometric primitives for one office block. cx/cy is the centre of the top
   face; every tower sits on a shared base line inside a 200x150 viewBox so the
   cluster stays centred on the timeline spine. */
const cube = (cx: number, cy: number, w: number, h: number, v: number): CubeGeometry => ({
  top: `M${cx},${cy - h} L${cx + w},${cy} L${cx},${cy + h} L${cx - w},${cy} Z`,
  left: `M${cx - w},${cy} L${cx},${cy + h} L${cx},${cy + h + v} L${cx - w},${cy + v} Z`,
  right: `M${cx + w},${cy} L${cx},${cy + h} L${cx},${cy + h + v} L${cx + w},${cy + v} Z`,
});

/* Company size is editorial data, so the drawing grammar lives in one table:
   small is one low block, enterprise is a three-tower campus. */
const OFFICE_PROFILES = {
  small: {
    pad: 28,
    floors: 6,
    label: 'SMALL',
    towers: [{ cx: 100, halfWidth: 17, height: 38 }],
  },
  medium: {
    pad: 38,
    floors: 10,
    label: 'MEDIUM',
    towers: [
      { cx: 84, halfWidth: 15, height: 32 },
      { cx: 118, halfWidth: 19, height: 50, roof: 'setback' },
    ],
  },
  large: {
    pad: 46,
    floors: 14,
    label: 'LARGE',
    towers: [
      { cx: 68, halfWidth: 14, height: 34 },
      { cx: 100, halfWidth: 18, height: 56 },
      { cx: 132, halfWidth: 14, height: 42 },
    ],
  },
  enterprise: {
    pad: 48,
    floors: 20,
    label: 'ENTERPRISE',
    towers: [
      { cx: 64, halfWidth: 13, height: 36 },
      { cx: 100, halfWidth: 22, height: 66, roof: 'antenna' },
      { cx: 136, halfWidth: 13, height: 46 },
    ],
  },
} satisfies Record<string, OfficeProfile>;

export type CompanySize = keyof typeof OFFICE_PROFILES;

/* Windows follow each wall's isometric basis. One path holds every pane on a
   face, so a three-tower campus stays cheap to render. */
const faceWindows = (
  cx: number,
  topY: number,
  halfWidth: number,
  depth: number,
  height: number,
  side: 'left' | 'right'
): WindowGeometry => {
  const rows = Math.min(4, Math.max(2, Math.round(height / 16)));
  const cols = Math.min(3, Math.max(2, Math.round(halfWidth / 8)));
  const uStart = 0.13;
  const uSpan = 0.74;
  const vStart = 0.11;
  const vSpan = 0.78;
  const cellW = uSpan / cols;
  const cellH = vSpan / rows;
  const winW = cellW * 0.56;
  const winH = cellH * 0.46;
  const point = (u: number, v: number) =>
    side === 'left'
      ? ([cx - halfWidth + u * halfWidth, topY + u * depth + v * height] as const)
      : ([cx + u * halfWidth, topY + depth - u * depth + v * height] as const);
  const panes: string[] = [];
  const lit: string[] = [];
  const offset = side === 'left' ? 0 : 2;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const u0 = uStart + col * cellW + (cellW - winW) / 2;
      const u1 = u0 + winW;
      const v0 = vStart + row * cellH + (cellH - winH) / 2;
      const v1 = v0 + winH;
      const [x0, y0] = point(u0, v0);
      const [x1, y1] = point(u1, v0);
      const [x2, y2] = point(u1, v1);
      const [x3, y3] = point(u0, v1);
      const pane = `M${x0.toFixed(1)} ${y0.toFixed(1)} L${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} L${x3.toFixed(1)} ${y3.toFixed(1)} Z`;
      panes.push(pane);
      if ((row + col + offset) % 3 === 0) lit.push(pane);
    }
  }

  return { panes: panes.join(' '), lit: lit.join(' ') };
};

const buildTower = (spec: TowerSpec): TowerGeometry => {
  const depth = spec.halfWidth * 0.5;
  const topY = BASE_Y - spec.height;
  const body = cube(spec.cx, topY, spec.halfWidth, depth, spec.height);
  const setbackWidth = spec.halfWidth * 0.56;
  const setback =
    spec.roof === 'setback' ? cube(spec.cx, topY - 6, setbackWidth, setbackWidth * 0.5, 6) : null;
  const antenna =
    spec.roof === 'antenna' ? { x: spec.cx, base: topY - depth - 1, tip: topY - depth - 12 } : null;

  return {
    ...spec,
    topY,
    depth,
    body,
    setback,
    antenna,
    windows: {
      left: faceWindows(spec.cx, topY, spec.halfWidth, depth, spec.height, 'left'),
      right: faceWindows(spec.cx, topY, spec.halfWidth, depth, spec.height, 'right'),
    },
  };
};

export const buildOfficeScene = (companySize: CompanySize): OfficeScene => {
  const profile = OFFICE_PROFILES[companySize];
  const towers = profile.towers.map(buildTower);
  const tallest = towers.reduce((a, b) => (a.height > b.height ? a : b));

  return {
    pad: cube(CENTER_X, BASE_Y + 2, profile.pad, profile.pad * 0.5, 3),
    towers,
    peakTop: tallest.topY - tallest.depth,
    sizeLabel: profile.label,
    floors: profile.floors,
  };
};
