import ChartsPanel from './components/ChartsPanel';
import ControlPanel from './components/ControlPanel';
import Header from './components/Header';
import MetricsPanel from './components/MetricsPanel';
import MoonCanvas from './components/MoonCanvas';
import { useSimulation } from './hooks/useSimulation';

const App = () => {
  const {
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
    samples,
    currentSample,
    statusLabel,
    statusMessage,
    comparisonData
  } = useSimulation();

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-100 md:p-6">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-4">
        <Header />

        <main className="grid gap-4 xl:grid-cols-[320px_1fr_320px]">
          <ControlPanel
            config={config}
            running={running}
            paused={paused}
            onChange={updateConfigValue}
            onSetMethod={setMethod}
            onStartOrbit={startOrbit}
            onStartDescent={startDescent}
            onTogglePause={togglePause}
            onReset={reset}
            onCompare={compareEulerVsRk4}
          />

          <MoonCanvas samples={samples} />

          <MetricsPanel
            sample={currentSample}
            method={config.method}
            statusLabel={statusLabel}
            statusMessage={statusMessage}
          />
        </main>

        <ChartsPanel samples={samples} comparisonData={comparisonData} />
      </div>
    </div>
  );
};

export default App;
