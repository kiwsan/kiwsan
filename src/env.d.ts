/// <reference path="../.astro/types.d.ts" />

interface Exp3DCardDebug {
  index: number;
  lane: -1 | 1;
  x: number;
  z: number;
  opacity: string;
  visible: boolean;
  rotationY: number;
}

interface Exp3DEnvDebug {
  tier: 'full' | 'lite' | 'off';
  phase: 'live' | 'off';
  stepDowns: number;
  msEMA: number;
  bg: string;
}

interface Exp3DDebug {
  mode: '3d' | 'flat';
  progress?: number;
  camZ?: number;
  lookX?: number;
  cards?: Exp3DCardDebug[];
  env?: Exp3DEnvDebug;
}

declare global {
  interface Window {
    __exp3d?: Exp3DDebug;
  }
}

export {};
