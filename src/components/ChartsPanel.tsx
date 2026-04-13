import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Sample } from '../simulation/types';

interface Props {
  samples: Sample[];
  comparisonData: Array<{ t: number; eulerAltitude: number; rk4Altitude: number }>;
}

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
    <h3 className="mb-2 text-sm font-medium text-slate-200">{title}</h3>
    <div className="h-60">{children}</div>
  </div>
);

const ChartsPanel = ({ samples, comparisonData }: Props) => {
  const slimData = samples.filter((_, idx) => idx % 3 === 0);

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <ChartCard title="Distancia al centro vs tiempo">
        <ResponsiveContainer>
          <LineChart data={slimData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="t" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip />
            <Line type="monotone" dataKey="r" stroke="#60a5fa" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Velocidad vs tiempo">
        <ResponsiveContainer>
          <LineChart data={slimData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="t" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip />
            <Line type="monotone" dataKey="speed" stroke="#34d399" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Altura sobre superficie vs tiempo">
        <ResponsiveContainer>
          <LineChart data={slimData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="t" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip />
            <Line type="monotone" dataKey="altitude" stroke="#f59e0b" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {comparisonData.length > 0 && (
        <div className="lg:col-span-3">
          <ChartCard title="Comparación Euler vs RK4 (altura)">
            <ResponsiveContainer>
              <LineChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="t" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="eulerAltitude" name="Euler" stroke="#f97316" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="rk4Altitude" name="RK4" stroke="#22c55e" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}
    </section>
  );
};

export default ChartsPanel;
