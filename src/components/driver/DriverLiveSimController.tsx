import React from 'react';
import { useRekart } from '../../context/RekartContext';
import { RealTimeMap } from '../common/RealTimeMap';
import {
  Bike,
  Navigation,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  Phone,
} from 'lucide-react';

export const DriverLiveSimController: React.FC = () => {
  const {
    stops,
    driver,
    isSimulating,
    toggleSimulation,
    resetSimulation,
    simSpeed,
    setSimSpeed,
    advanceDriverToNextStep,
    updateStopStatus,
  } = useRekart();

  const nextStop = stops.find((s) => s.status !== 'delivered');
  const deliveredCount = stops.filter((s) => s.status === 'delivered').length;

  return (
    <div className="space-y-6">
      {/* Header and Telemetry */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                Live GPS Telemetry &amp; Route Guidance
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 font-serif">
              Sector 4 Navigation Map
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live bike coordinates updating at 12.9288° N, 77.6745° E • Speed ~22 km/h
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={toggleSimulation}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-colors ${
                isSimulating
                  ? 'bg-amber-500 text-amber-950 hover:bg-amber-400'
                  : 'bg-emerald-700 text-white hover:bg-emerald-800'
              }`}
            >
              {isSimulating ? (
                <>
                  <Pause className="w-4 h-4" /> Pause Auto Navigation
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Start Auto Navigation
                </>
              )}
            </button>

            <button
              onClick={advanceDriverToNextStep}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
              title="Advance one stage"
            >
              Next Milestone ⏭️
            </button>

            <button
              onClick={() => setSimSpeed(simSpeed === 1 ? 2 : simSpeed === 2 ? 4 : 1)}
              className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold"
              title="Speed multiplier"
            >
              {simSpeed}x Speed
            </button>

            <button
              onClick={resetSimulation}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500"
              title="Reset route"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Next Turn Instruction Card */}
        {nextStop && (
          <div className="mt-4 p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-extrabold text-base shrink-0">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
                  Upcoming Target Stop ({stops.findIndex((s) => s.id === nextStop.id) + 1} of {stops.length})
                </span>
                <h3 className="text-sm font-bold text-white">
                  {nextStop.apartmentName} — {nextStop.wing}, {nextStop.flatNumber}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Customer: {nextStop.customerName} • {nextStop.specialInstructions || 'Leave in door pouch'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateStopStatus(nextStop.id, 'delivered')}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors"
              >
                1-Tap Mark Delivered
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Full Size Real Time Map */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <RealTimeMap height="h-[520px]" showDriverFocusNotice={true} />
      </div>
    </div>
  );
};
