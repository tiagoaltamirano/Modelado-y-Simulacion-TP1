import { Sample } from '../simulation/types';

interface Props {
  samples: Sample[];
}

const MoonCanvas = ({ samples }: Props) => {
  const width = 720;
  const height = 520;
  const scale = 0.1;
  const centerX = width / 2;
  const centerY = height / 2;

  const toScreen = (x: number, y: number) => ({
    x: centerX + x * scale,
    y: centerY - y * scale
  });

  const orbitPoints = samples.filter((s) => s.phase === 'orbit').map((s) => toScreen(s.x, s.y));
  const descentPoints = samples.filter((s) => s.phase !== 'orbit').map((s) => toScreen(s.x, s.y));
  const ship = samples[samples.length - 1];
  const shipPoint = toScreen(ship.x, ship.y);

  const pathFrom = (pts: Array<{ x: number; y: number }>) =>
    pts.length > 1 ? `M ${pts.map((p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' L ')}` : '';

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 shadow-lg">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[520px] w-full rounded-lg bg-slate-950">
        <defs>
          <radialGradient id="moonGrad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#6b7280" />
          </radialGradient>
        </defs>

        <circle cx={centerX} cy={centerY} r={1737.4 * scale} fill="url(#moonGrad)" opacity="0.92" />
        <circle cx={centerX - 25} cy={centerY - 20} r={18} fill="#94a3b8" opacity="0.35" />
        <circle cx={centerX + 35} cy={centerY + 40} r={14} fill="#94a3b8" opacity="0.35" />
        <circle cx={centerX + 10} cy={centerY - 45} r={10} fill="#94a3b8" opacity="0.3" />

        {orbitPoints.length > 1 && <path d={pathFrom(orbitPoints)} fill="none" stroke="#60a5fa" strokeWidth="2" />}
        {descentPoints.length > 1 && <path d={pathFrom(descentPoints)} fill="none" stroke="#fb923c" strokeWidth="2.2" />}

        <circle cx={shipPoint.x} cy={shipPoint.y} r={5} fill="#22d3ee" stroke="#cffafe" strokeWidth={1.2} />
      </svg>
    </section>
  );
};

export default MoonCanvas;
