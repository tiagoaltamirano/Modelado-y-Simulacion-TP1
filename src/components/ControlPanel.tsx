import { IntegrationMethod, SimulationConfig } from '../simulation/types';

interface Props {
  config: SimulationConfig;
  running: boolean;
  paused: boolean;
  onChange: (key: keyof SimulationConfig, value: number) => void;
  onSetMethod: (method: IntegrationMethod) => void;
  onStartOrbit: () => void;
  onStartDescent: () => void;
  onTogglePause: () => void;
  onReset: () => void;
  onCompare: () => void;
}

const numberFields: Array<{ key: keyof SimulationConfig; label: string; step: string }> = [
  { key: 'x0', label: 'Posición inicial x0 (km)', step: '0.1' },
  { key: 'y0', label: 'Posición inicial y0 (km)', step: '0.1' },
  { key: 'vx0', label: 'Velocidad inicial vx0 (km/s)', step: '0.01' },
  { key: 'vy0', label: 'Velocidad inicial vy0 (km/s)', step: '0.01' },
  { key: 'thrust', label: 'Empuje descenso (km/s²)', step: '0.0001' },
  { key: 'fuel0', label: 'Combustible inicial', step: '1' },
  { key: 'h', label: 'Paso h (s)', step: '0.1' },
  { key: 'totalTime', label: 'Tiempo total (s)', step: '10' }
];

const ControlPanel = ({
  config,
  running,
  paused,
  onChange,
  onSetMethod,
  onStartOrbit,
  onStartDescent,
  onTogglePause,
  onReset,
  onCompare
}: Props) => (
  <aside className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
    <h2 className="mb-4 text-lg font-medium text-emerald-300">Controles</h2>
    <div className="space-y-3">
      {numberFields.map((field) => (
        <label key={field.key} className="block">
          <span className="mb-1 block text-xs text-slate-300">{field.label}</span>
          <input
            type="number"
            step={field.step}
            value={config[field.key] as number}
            onChange={(e) => onChange(field.key, Number(e.target.value))}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-blue-400 focus:outline-none"
          />
        </label>
      ))}

      <label className="block">
        <span className="mb-1 block text-xs text-slate-300">Método numérico</span>
        <select
          value={config.method}
          onChange={(e) => onSetMethod(e.target.value as IntegrationMethod)}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
        >
          <option value="euler">Euler</option>
          <option value="rk4">Runge-Kutta 4</option>
        </select>
      </label>
    </div>

    <div className="mt-4 grid grid-cols-2 gap-2">
      <button className="rounded bg-blue-600 px-3 py-2 text-sm font-medium" onClick={onStartOrbit}>
        Iniciar órbita
      </button>
      <button className="rounded bg-orange-500 px-3 py-2 text-sm font-medium" onClick={onStartDescent}>
        Iniciar descenso
      </button>
      <button
        className="rounded bg-slate-700 px-3 py-2 text-sm font-medium"
        onClick={onTogglePause}
        disabled={!running}
      >
        {paused ? 'Reanudar' : 'Pausar'}
      </button>
      <button className="rounded bg-rose-700 px-3 py-2 text-sm font-medium" onClick={onReset}>
        Reiniciar
      </button>
      <button className="col-span-2 rounded bg-emerald-700 px-3 py-2 text-sm font-medium" onClick={onCompare}>
        Comparar Euler vs RK4
      </button>
    </div>
  </aside>
);

export default ControlPanel;
