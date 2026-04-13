import { MOON_RADIUS } from './constants';
import { interpolateState } from './interpolation';
import { radius } from './physics';
import { State } from './types';

const height = (s: State): number => radius(s.x, s.y) - MOON_RADIUS;

export const detectTouchdownByBisection = (prev: State, curr: State, iterations = 22): State => {
  let left = prev;
  let right = curr;

  for (let i = 0; i < iterations; i += 1) {
    const mid = interpolateState(left, right, 0.5);
    const hLeft = height(left);
    const hMid = height(mid);

    if (hLeft === 0) {
      return left;
    }

    if (hLeft * hMid <= 0) {
      right = mid;
    } else {
      left = mid;
    }
  }

  return interpolateState(left, right, 0.5);
};
