import { describe, expect, it } from 'vitest';
import { buildOfficeScene, GROUND_Y } from './office';
import { officeLabel, railPeriod } from './labels';

describe('buildOfficeScene', () => {
  it.each([
    ['small', 1],
    ['medium', 2],
    ['large', 3],
    ['enterprise', 3],
  ] as const)('draws %s with %i tower(s)', (size, count) => {
    expect(buildOfficeScene(size).towers).toHaveLength(count);
  });

  it('makes the enterprise campus taller than the large campus', () => {
    expect(buildOfficeScene('enterprise').peakTop).toBeLessThan(buildOfficeScene('large').peakTop);
  });

  it('keeps every scene inside the view box', () => {
    for (const size of ['small', 'medium', 'large', 'enterprise'] as const) {
      const scene = buildOfficeScene(size);
      expect(scene.peakTop).toBeGreaterThan(0);
      expect(scene.peakTop).toBeLessThan(GROUND_Y);

      for (const tower of scene.towers) {
        expect(tower.body.top).not.toContain('NaN');
        expect(tower.body.left).not.toContain('NaN');
        expect(tower.body.right).not.toContain('NaN');
        expect(tower.windows.left.panes.length).toBeGreaterThan(0);
        expect(tower.windows.right.panes.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('labels', () => {
  it('drops legal suffixes and parenthetical notes', () => {
    expect(officeLabel('MC Group (SET-listed)')).toBe('MC Group');
    expect(officeLabel('Ayudhya Capital Services (Krungsri)')).toBe('Ayudhya Capital');
    expect(officeLabel('P.N.L. Co., Ltd.')).toBe('P.N.L.');
  });

  it('uses a real dash on the rail', () => {
    expect(railPeriod('Jan 2022 - Jun 2022')).toBe('Jan 2022 — Jun 2022');
  });
});
