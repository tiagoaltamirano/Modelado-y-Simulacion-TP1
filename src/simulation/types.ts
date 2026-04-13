export type IntegrationMethod = 'euler' | 'rk4';
export type SimulationPhase = 'idle' | 'orbit' | 'descent' | 'landed' | 'impact' | 'escape' | 'paused';

export interface SimulationConfig {
  x0: number;
  y0: number;
  vx0: number;
  vy0: number;
  thrust: number;
  fuel0: number;
  h: number;
  totalTime: number;
  method: IntegrationMethod;
}

export interface State {
  x: number;
  y: number;
  vx: number;
  vy: number;
  fuel: number;
  t: number;
}

export interface Sample extends State {
  r: number;
  speed: number;
  altitude: number;
  phase: SimulationPhase;
}

export interface SimStatus {
  phase: SimulationPhase;
  method: IntegrationMethod;
  touchSpeed: number | null;
  message: string;
}

export interface SimResult {
  samples: Sample[];
  status: SimStatus;
}
