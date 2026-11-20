import { describe, expect, it } from 'vitest';
import { workforceFunctions, workforceHub, workforceRoleCount } from '../../data/workforce';
import { buildWorkforceScene, WORKFORCE_VIEWBOX } from './workforce';

describe('workforce data', () => {
  it('has 25 roles across the hub and six functions', () => {
    expect(workforceRoleCount).toBe(25);
    expect(workforceFunctions).toHaveLength(6);
    expect(workforceFunctions.reduce((sum, fn) => sum + fn.roles.length, 0) + 1).toBe(25);
    expect(workforceHub.name).toBe('chief-of-staff');
  });

  it('keeps one role per pod desk', () => {
    expect(workforceFunctions.map((fn) => fn.roles.length)).toEqual([8, 3, 3, 4, 3, 3]);
  });
});

describe('buildWorkforceScene', () => {
  it('draws one pod per function and one agent per role', () => {
    const scene = buildWorkforceScene();

    expect(scene.viewBox).toBe(WORKFORCE_VIEWBOX);
    expect(scene.pods).toHaveLength(6);
    expect(scene.pods.reduce((sum, pod) => sum + pod.agents.length, 0)).toBe(24);

    for (const pod of scene.pods) {
      expect(pod.agents).toHaveLength(pod.count);
    }
  });

  it('centres the hub in the view box', () => {
    const scene = buildWorkforceScene();
    const [minX, minY, width, height] = scene.viewBox.split(' ').map(Number);

    expect(scene.hub.cx).toBe(minX + width / 2);
    expect(scene.hub.cy).toBe(minY + height / 2);
  });

  it('keeps every shape finite and inside the view box', () => {
    const scene = buildWorkforceScene();
    const [minX, minY, width, height] = scene.viewBox.split(' ').map(Number);

    for (const pod of scene.pods) {
      expect(pod.cx).toBeGreaterThan(minX);
      expect(pod.cx).toBeLessThan(minX + width);
      expect(pod.cy).toBeGreaterThan(minY);
      expect(pod.cy).toBeLessThan(minY + height);

      for (const path of [pod.top, pod.left, pod.right]) {
        expect(path).not.toContain('NaN');
      }

      for (const agent of pod.agents) {
        expect(agent.x).toBeGreaterThan(minX);
        expect(agent.x).toBeLessThan(minX + width);
        expect(agent.y).toBeGreaterThan(minY);
        expect(agent.y).toBeLessThan(minY + height);
      }
    }

    for (const rail of scene.rails) {
      expect(rail.d).not.toContain('NaN');
      expect(rail.d.startsWith('M')).toBe(true);
    }
  });

  it('connects every function to the hub with a rail', () => {
    const scene = buildWorkforceScene();

    expect(scene.rails).toHaveLength(6);
    expect(scene.rails.map((rail) => rail.id)).toEqual(workforceFunctions.map((fn) => fn.id));
  });
});
