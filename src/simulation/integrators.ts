import { derivatives } from './physics';
import { SimulationPhase, State } from './types';

const addScaled = (s: State, k: State, scale: number): State => ({
  x: s.x + k.x * scale,
  y: s.y + k.y * scale,
  vx: s.vx + k.vx * scale,
  vy: s.vy + k.vy * scale,
  fuel: s.fuel + k.fuel * scale,
  t: s.t + k.t * scale
});

const asState = (
  dx: number,
  dy: number,
  dvx: number,
  dvy: number,
  dfuel: number,
  dt: number
): State => ({ x: dx, y: dy, vx: dvx, vy: dvy, fuel: dfuel, t: dt });

export const eulerStep = (state: State, h: number, phase: SimulationPhase, thrust: number): State => {
  const k1 = derivatives(state, phase, thrust);
  return {
    x: state.x + h * k1.dx,
    y: state.y + h * k1.dy,
    vx: state.vx + h * k1.dvx,
    vy: state.vy + h * k1.dvy,
    fuel: Math.max(0, state.fuel + h * k1.dfuel),
    t: state.t + h
  };
};

export const rk4Step = (state: State, h: number, phase: SimulationPhase, thrust: number): State => {
  const k1d = derivatives(state, phase, thrust);
  const k1 = asState(k1d.dx, k1d.dy, k1d.dvx, k1d.dvy, k1d.dfuel, 1);

  const s2 = addScaled(state, k1, h / 2);
  const k2d = derivatives(s2, phase, thrust);
  const k2 = asState(k2d.dx, k2d.dy, k2d.dvx, k2d.dvy, k2d.dfuel, 1);

  const s3 = addScaled(state, k2, h / 2);
  const k3d = derivatives(s3, phase, thrust);
  const k3 = asState(k3d.dx, k3d.dy, k3d.dvx, k3d.dvy, k3d.dfuel, 1);

  const s4 = addScaled(state, k3, h);
  const k4d = derivatives(s4, phase, thrust);
  const k4 = asState(k4d.dx, k4d.dy, k4d.dvx, k4d.dvy, k4d.dfuel, 1);

  return {
    x: state.x + (h / 6) * (k1.x + 2 * k2.x + 2 * k3.x + k4.x),
    y: state.y + (h / 6) * (k1.y + 2 * k2.y + 2 * k3.y + k4.y),
    vx: state.vx + (h / 6) * (k1.vx + 2 * k2.vx + 2 * k3.vx + k4.vx),
    vy: state.vy + (h / 6) * (k1.vy + 2 * k2.vy + 2 * k3.vy + k4.vy),
    fuel: Math.max(0, state.fuel + (h / 6) * (k1.fuel + 2 * k2.fuel + 2 * k3.fuel + k4.fuel)),
    t: state.t + h
  };
};
