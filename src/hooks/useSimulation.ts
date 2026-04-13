import { useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_CONFIG } from '../simulation/constants';
import { runSimulation } from '../simulation/controller';
import { IntegrationMethod, Sample, SimResult, SimulationConfig, SimulationPhase } from '../simulation/types';

interface ComparisonDataPoint {
  t: number;
  eulerAltitude: number;
  rk4Altitude: number;
}

const PHASE_LABEL: Record<SimulationPhase, string> = {
  idle: 'Inactiva',
  orbit: 'En órbita',
  descent: 'Descendiendo',
  landed: 'Aterrizaje exitoso',
  impact: 'Impacto',
  escape: 'Escape',
  paused: 'Pausada'
};

export const useSimulation = () => {
  const [config, setConfig] = useState<SimulationConfig>(DEFAULT_CONFIG);
  const [result, setResult] = useState<SimResult>(() => runSimulation(DEFAULT_CONFIG, null));
  const [descentStartTime, setDescentStartTime] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [comparisonData, setComparisonData] = useState<ComparisonDataPoint[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setResult(runSimulation(config, descentStartTime));
    setCursor(0);
  }, [config, descentStartTime]);

  useEffect(() => {
    if (!running || paused) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const speedFactor = 2;
    const tick = () => {
      setCursor((prev) => {
        const next = Math.min(prev + speedFactor, result.samples.length - 1);
        if (next >= result.samples.length - 1) {
          setRunning(false);
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running, paused, result.samples.length]);

  const visibleSamples = useMemo(() => result.samples.slice(0, cursor + 1), [result.samples, cursor]);
  const currentSample: Sample = visibleSamples[visibleSamples.length - 1] ?? result.samples[0];

  const startOrbit = () => {
    setDescentStartTime(null);
    setResult(runSimulation(config, null));
    setCursor(0);
    setPaused(false);
    setRunning(true);
  };

  const startDescent = () => {
    const t0 = currentSample.t;
    setDescentStartTime(t0);
    const newResult = runSimulation(config, t0);
    setResult(newResult);
    const closestIndex = newResult.samples.findIndex((s) => s.t >= t0);
    setCursor(Math.max(0, closestIndex));
    setPaused(false);
    setRunning(true);
  };

  const togglePause = () => {
    if (!running) return;
    setPaused((p) => !p);
  };

  const reset = () => {
    setDescentStartTime(null);
    setResult(runSimulation(config, null));
    setCursor(0);
    setPaused(false);
    setRunning(false);
    setComparisonData([]);
  };

  const compareEulerVsRk4 = () => {
    const euler = runSimulation({ ...config, method: 'euler' }, descentStartTime ?? 40, 'euler');
    const rk4 = runSimulation({ ...config, method: 'rk4' }, descentStartTime ?? 40, 'rk4');

    const minLen = Math.min(euler.samples.length, rk4.samples.length);
    const merged: ComparisonDataPoint[] = [];
    for (let i = 0; i < minLen; i += 8) {
      merged.push({
        t: euler.samples[i].t,
        eulerAltitude: euler.samples[i].altitude,
        rk4Altitude: rk4.samples[i].altitude
      });
    }

    setComparisonData(merged);
  };

  const setMethod = (method: IntegrationMethod) => setConfig((c) => ({ ...c, method }));

  const updateConfigValue = (key: keyof SimulationConfig, value: number) => {
    setConfig((current) => ({ ...current, [key]: value }));
  };

  return {
    config,
    setMethod,
    updateConfigValue,
    startOrbit,
    startDescent,
    togglePause,
    reset,
    compareEulerVsRk4,
    running,
    paused,
    samples: visibleSamples,
    allSamples: result.samples,
    currentSample,
    statusLabel: paused ? PHASE_LABEL.paused : PHASE_LABEL[currentSample.phase],
    statusMessage: result.status.message,
    comparisonData
  };
};
