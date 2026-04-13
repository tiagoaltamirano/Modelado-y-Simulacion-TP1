import { SimulationConfig } from './types';

export const MOON_RADIUS = 1737.4;
export const MU = 4902.8;
export const SAFE_TOUCHDOWN_SPEED = 0.08;
export const ESCAPE_RADIUS = 8000;
export const FUEL_CONSUMPTION = 0.6;

export const DEFAULT_CONFIG: SimulationConfig = {
  x0: 0,
  y0: MOON_RADIUS + 150,
  vx0: 1.55,
  vy0: 0,
  thrust: 0.0012,
  fuel0: 120,
  h: 1,
  totalTime: 5000,
  method: 'rk4'
};
