import { workforceFunctions, type WorkforceFunction } from '../../data/workforce';

export interface DeskGeometry {
  top: string;
  left: string;
  right: string;
  x: number;
  y: number;
}

export interface PodGeometry {
  id: WorkforceFunction['id'];
  label: string;
  accent: string;
  count: number;
  cx: number;
  cy: number;
  width: number;
  top: string;
  left: string;
  right: string;
  desks: DeskGeometry[];
  labelY: number;
}

export interface HubGeometry {
  cx: number;
  cy: number;
  radius: number;
  desks: DeskGeometry[];
  labelY: number;
}

export interface RailGeometry {
  id: WorkforceFunction['id'];
  accent: string;
  d: string;
}

export interface WorkforceScene {
  viewBox: string;
  pods: PodGeometry[];
  hub: HubGeometry;
  rails: RailGeometry[];
}

export const WORKFORCE_VIEWBOX = '0 0 1000 640';
export const WORKFORCE_HUB = { cx: 500, cy: 320, radius: 80 } as const;

/* Six pods around the hub; Product & Eng sits on top because it owns the
   largest team and the longest handoff chain. */
const SLOTS: Record<WorkforceFunction['id'], { cx: number; cy: number; w: number }> = {
  product: { cx: 500, cy: 128, w: 220 },
  prototype: { cx: 790, cy: 236, w: 168 },
  research: { cx: 790, cy: 424, w: 168 },
  marketing: { cx: 500, cy: 520, w: 178 },
  support: { cx: 210, cy: 424, w: 168 },
  security: { cx: 210, cy: 236, w: 168 },
};

const round = (value: number) => Math.round(value * 10) / 10;

const deskAt = (x: number, y: number, w = 20, h = 10, depth = 4): DeskGeometry => {
  const top = `M${round(x)} ${round(y - h)} L${round(x + w / 2)} ${round(y)} L${round(x)} ${round(y + h)} L${round(x - w / 2)} ${round(y)} Z`;
  const left = `M${round(x - w / 2)} ${round(y)} L${round(x)} ${round(y + h)} L${round(x)} ${round(y + h + depth)} L${round(x - w / 2)} ${round(y + depth)} Z`;
  const right = `M${round(x + w / 2)} ${round(y)} L${round(x)} ${round(y + h)} L${round(x)} ${round(y + h + depth)} L${round(x + w / 2)} ${round(y + depth)} Z`;

  return { top, left, right, x: round(x), y: round(y) };
};

/* A pod's desk count is its role count. Keep the grid shallow so the desks
   read as furniture, not a heatmap. */
const desksFor = (count: number, cx: number, cy: number, width: number): DeskGeometry[] => {
  const cols = Math.min(4, count);
  const rows = Math.ceil(count / cols);
  const xStep = width * 0.18;
  const yStep = width * 0.14;
  const desks: DeskGeometry[] = [];

  for (let i = 0; i < count; i += 1) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = cx + (col - (cols - 1) / 2) * xStep;
    const y = cy + (row - (rows - 1) / 2) * yStep;
    desks.push(deskAt(x, y));
  }

  return desks;
};

const buildPod = (fn: WorkforceFunction): PodGeometry => {
  const slot = SLOTS[fn.id];
  const halfH = slot.w * 0.27;
  const thickness = 8;

  return {
    id: fn.id,
    label: fn.label,
    accent: fn.accent,
    count: fn.roles.length,
    cx: slot.cx,
    cy: slot.cy,
    width: slot.w,
    top: `M${slot.cx} ${round(slot.cy - halfH)} L${round(slot.cx + slot.w / 2)} ${slot.cy} L${slot.cx} ${round(slot.cy + halfH)} L${round(slot.cx - slot.w / 2)} ${slot.cy} Z`,
    left: `M${round(slot.cx - slot.w / 2)} ${slot.cy} L${slot.cx} ${round(slot.cy + halfH)} L${slot.cx} ${round(slot.cy + halfH + thickness)} L${round(slot.cx - slot.w / 2)} ${slot.cy + thickness} Z`,
    right: `M${round(slot.cx + slot.w / 2)} ${slot.cy} L${slot.cx} ${round(slot.cy + halfH)} L${slot.cx} ${round(slot.cy + halfH + thickness)} L${round(slot.cx + slot.w / 2)} ${slot.cy + thickness} Z`,
    desks: desksFor(fn.roles.length, slot.cx, slot.cy, slot.w),
    labelY: round(slot.cy + halfH + 22),
  };
};

const railTo = (fn: WorkforceFunction): RailGeometry => {
  const slot = SLOTS[fn.id];
  const dx = slot.cx - WORKFORCE_HUB.cx;
  const dy = slot.cy - WORKFORCE_HUB.cy;
  const length = Math.hypot(dx, dy);
  const ux = dx / length;
  const uy = dy / length;

  const start = WORKFORCE_HUB.radius + 6;
  const end = slot.w * 0.42;
  const sx = WORKFORCE_HUB.cx + ux * start;
  const sy = WORKFORCE_HUB.cy + uy * start;
  const ex = slot.cx - ux * end;
  const ey = slot.cy - uy * end;

  const mx = (sx + ex) / 2;
  const my = (sy + ey) / 2;
  const px = -(ey - sy);
  const py = ex - sx;
  const plen = Math.hypot(px, py) || 1;
  const bend = length * 0.1;
  const qx = round(mx + (px / plen) * bend);
  const qy = round(my + (py / plen) * bend);

  return {
    id: fn.id,
    accent: fn.accent,
    d: `M${round(sx)} ${round(sy)} Q${qx} ${qy} ${round(ex)} ${round(ey)}`,
  };
};

export const buildWorkforceScene = (): WorkforceScene => ({
  viewBox: WORKFORCE_VIEWBOX,
  pods: workforceFunctions.map(buildPod),
  hub: {
    cx: WORKFORCE_HUB.cx,
    cy: WORKFORCE_HUB.cy,
    radius: WORKFORCE_HUB.radius,
    desks: [deskAt(WORKFORCE_HUB.cx, WORKFORCE_HUB.cy + 4, 38, 18, 7)],
    labelY: WORKFORCE_HUB.cy + WORKFORCE_HUB.radius + 24,
  },
  rails: workforceFunctions.map(railTo),
});
