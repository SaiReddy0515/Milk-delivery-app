import React from 'react';
import { useRekart } from '../../context/RekartContext';
import { DriverRouteManifest } from './DriverRouteManifest';
import { DriverLiveSimController } from './DriverLiveSimController';
import { DriverCratesInventory } from './DriverCratesInventory';
import { DriverEarnings } from './DriverEarnings';
import {
  Bike,
  Navigation,
  Package,
  TrendingUp,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';

export const DriverPortal: React.FC = () => {
  const { activeDriverTab, setActiveDriverTab, driver, stops } = useRekart();

  return (
    <div className="space-y-6">
      {/* Subnav Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveDriverTab('manifest')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeDriverTab === 'manifest'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>Doorstep Manifest (6 Stops)</span>
        </button>

        <button
          onClick={() => setActiveDriverTab('map')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeDriverTab === 'map'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>Live GPS Navigation Map</span>
        </button>

        <button
          onClick={() => setActiveDriverTab('crates')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeDriverTab === 'crates'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Cargo &amp; Return Bottles</span>
        </button>

        <button
          onClick={() => setActiveDriverTab('earnings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeDriverTab === 'earnings'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Shift Earnings &amp; Ratings</span>
        </button>
      </div>

      {/* Render Active Tab */}
      {activeDriverTab === 'manifest' && <DriverRouteManifest />}
      {activeDriverTab === 'map' && <DriverLiveSimController />}
      {activeDriverTab === 'crates' && <DriverCratesInventory />}
      {activeDriverTab === 'earnings' && <DriverEarnings />}
    </div>
  );
};
