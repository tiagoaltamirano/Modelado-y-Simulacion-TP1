import { State } from './types';

export const lerp = (a: number, b: number, alpha: number): number => a + alpha * (b - a);

export const interpolateState = (a: State, b: State, alpha: number): State => ({
  x: lerp(a.x, b.x, alpha),
  y: lerp(a.y, b.y, alpha),
  vx: lerp(a.vx, b.vx, alpha),
  vy: lerp(a.vy, b.vy, alpha),
  fuel: lerp(a.fuel, b.fuel, alpha),
  t: lerp(a.t, b.t, alpha)
});
