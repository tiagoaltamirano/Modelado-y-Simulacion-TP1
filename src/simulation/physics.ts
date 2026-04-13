import { FUEL_CONSUMPTION, MU } from './constants';
import { SimulationPhase, State } from './types';

export interface Derivative {
  dx: number;
  dy: number;
  dvx: number;
  dvy: number;
  dfuel: number;
}

const clamp = (value: number, min = 0): number => (value < min ? min : value);

export const radius = (x: number, y: number): number => Math.sqrt(x * x + y * y);
export const speed = (vx: number, vy: number): number => Math.sqrt(vx * vx + vy * vy);

export const gravityAcceleration = (x: number, y: number): { ax: number; ay: number } => {
  const r = Math.max(radius(x, y), 1e-6);
  const factor = -MU / (r * r * r);
  return { ax: factor * x, ay: factor * y };
};

const descentControl = (
  state: State,
  phase: SimulationPhase,
  thrustMagnitude: number
): { ax: number; ay: number; fuelRate: number } => {
  if (phase !== 'descent' || state.fuel <= 0 || thrustMagnitude <= 0) {
    return { ax: 0, ay: 0, fuelRate: 0 };
  }

  const v = speed(state.vx, state.vy);
  const r = radius(state.x, state.y);
  const altitude = r - 1737.4;

  const retroFactor = altitude > 80 ? 1 : 0.45;
  const verticalBrake = altitude < 35 ? 1.35 : 0.55;

  const ux = v > 1e-6 ? -state.vx / v : -state.x / r;
  const uy = v > 1e-6 ? -state.vy / v : -state.y / r;

  const rx = -state.x / r;
  const ry = -state.y / r;

  const ax = thrustMagnitude * (retroFactor * ux + verticalBrake * rx);
  const ay = thrustMagnitude * (retroFactor * uy + verticalBrake * ry);
  const use = clamp(Math.sqrt(ax * ax + ay * ay), 0);

  return { ax, ay, fuelRate: use * FUEL_CONSUMPTION };
};

export const derivatives = (state: State, phase: SimulationPhase, thrust: number): Derivative => {
  const g = gravityAcceleration(state.x, state.y);
  const control = descentControl(state, phase, thrust);

  return {
    dx: state.vx,
    dy: state.vy,
    dvx: g.ax + control.ax,
    dvy: g.ay + control.ay,
    dfuel: -control.fuelRate
  };
};
