import { Sample } from '../simulation/types';

interface Props {
  sample: Sample;
  method: string;
  statusLabel: string;
  statusMessage: string;
}

const MetricCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
    <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
    <p className="mt-1 text-lg font-semibold text-slate-100">{value}</p>
  </div>
);

const MetricsPanel = ({ sample, method, statusLabel, statusMessage }: Props) => (
  <aside className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
    <h2 className="mb-4 text-lg font-medium text-blue-300">Métricas</h2>
    <div className="grid gap-3">
      <MetricCard label="Tiempo actual" value={`${sample.t.toFixed(1)} s`} />
      <MetricCard label="Velocidad" value={`${sample.speed.toFixed(4)} km/s`} />
      <MetricCard label="Distancia al centro" value={`${sample.r.toFixed(2)} km`} />
      <MetricCard label="Altura" value={`${sample.altitude.toFixed(2)} km`} />
      <MetricCard label="Combustible" value={`${sample.fuel.toFixed(2)}`} />
      <MetricCard label="Método activo" value={method.toUpperCase()} />
      <MetricCard label="Estado" value={statusLabel} />
      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-300">{statusMessage}</div>
    </div>
  </aside>
);

export default MetricsPanel;
