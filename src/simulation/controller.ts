import { ESCAPE_RADIUS, MOON_RADIUS, SAFE_TOUCHDOWN_SPEED } from './constants';
import { detectTouchdownByBisection } from './events';
import { eulerStep, rk4Step } from './integrators';
import { radius, speed } from './physics';
import { IntegrationMethod, Sample, SimResult, SimulationConfig, SimulationPhase, State } from './types';

const makeSample = (state: State, phase: SimulationPhase): Sample => {
  const r = radius(state.x, state.y);
  return {
    ...state,
    r,
    speed: speed(state.vx, state.vy),
    altitude: r - MOON_RADIUS,
    phase
  };
};

const stepWithMethod = (method: IntegrationMethod, state: State, h: number, phase: SimulationPhase, thrust: number): State =>
  method === 'euler' ? eulerStep(state, h, phase, thrust) : rk4Step(state, h, phase, thrust);

export const runSimulation = (
  config: SimulationConfig,
  descentStartTime: number | null,
  methodOverride?: IntegrationMethod
): SimResult => {
  const method = methodOverride ?? config.method;
  let phase: SimulationPhase = 'orbit';
  let state: State = {
    x: config.x0,
    y: config.y0,
    vx: config.vx0,
    vy: config.vy0,
    fuel: config.fuel0,
    t: 0
  };

  const samples: Sample[] = [makeSample(state, phase)];
  let touchSpeed: number | null = null;
  let message = 'Órbita inicial estable.';

  while (state.t < config.totalTime) {
    if (descentStartTime !== null && state.t >= descentStartTime && phase === 'orbit') {
      phase = 'descent';
      message = 'Descenso lunar iniciado.';
    }

    const prev = state;
    const thrust = phase === 'descent' ? config.thrust : 0;
    const next = stepWithMethod(method, prev, config.h, phase, thrust);

    const rPrev = radius(prev.x, prev.y);
    const rNext = radius(next.x, next.y);

    if (rPrev >= MOON_RADIUS && rNext <= MOON_RADIUS) {
      const touchdown = detectTouchdownByBisection(prev, next);
      touchSpeed = speed(touchdown.vx, touchdown.vy);
      phase = touchSpeed <= SAFE_TOUCHDOWN_SPEED ? 'landed' : 'impact';
      message = phase === 'landed' ? 'Aterrizaje exitoso (controlado).' : 'Impacto: velocidad de contacto alta.';
      samples.push(makeSample(touchdown, phase));
      break;
    }

    if (rNext > ESCAPE_RADIUS) {
      phase = 'escape';
      message = 'Escape del sistema lunar (r > r_escape).';
      samples.push(makeSample(next, phase));
      break;
    }

    state = next;
    samples.push(makeSample(state, phase));
  }

  if (state.t >= config.totalTime && (phase === 'orbit' || phase === 'descent')) {
    message = 'Simulación finalizada por tiempo total.';
  }

  return {
    samples,
    status: {
      phase,
      method,
      touchSpeed,
      message
    }
  };
};
