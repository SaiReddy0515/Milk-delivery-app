import React from 'react';
import { useRekart } from '../../context/RekartContext';
import {
  Milk,
  ThermometerSnowflake,
  ShieldCheck,
  Package,
  Recycle,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export const DriverCratesInventory: React.FC = () => {
  const { stops } = useRekart();

  // Aggregate items across all stops for morning run
  const totalItemsMap: { [name: string]: { qty: number; unit: string; delivered: number } } = {};
  let totalEmptyCollected = 0;

  stops.forEach((stop) => {
    if (stop.emptyBottlesCollected) {
      totalEmptyCollected += stop.emptyBottlesCollected;
    }
    stop.items.forEach((item) => {
      if (!totalItemsMap[item.productName]) {
        totalItemsMap[item.productName] = { qty: 0, unit: item.unit, delivered: 0 };
      }
      totalItemsMap[item.productName].qty += item.quantity;
      if (stop.status === 'delivered') {
        totalItemsMap[item.productName].delivered += item.quantity;
      }
    });
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-emerald-600" />
              Vehicle Cargo &amp; Cold-Chain Log
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 font-serif">
            Morning Milk Crates &amp; Return Bottles
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Loaded at Sector 4 Hub at 04:45 AM • Chilled insulated compartments
          </p>
        </div>

        {/* Cold-Chain Guarantee Badge */}
        <div className="flex items-center gap-3 bg-cyan-50 border border-cyan-200 px-4 py-2.5 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold">
            <ThermometerSnowflake className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-cyan-800">
              Chamber Sensor
            </div>
            <div className="text-base font-extrabold text-cyan-950 font-mono">
              4.1°C <span className="text-xs font-normal text-cyan-700">(Target &lt; 5°C)</span>
            </div>
            <div className="text-[10px] text-cyan-600">Freshness lock verified</div>
          </div>
        </div>
      </div>

      {/* Crates and Empty Bottles Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Crates Inventory (2 Cols) */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Morning Crate Loading Breakdown
          </h3>

          <div className="divide-y divide-slate-100">
            {Object.entries(totalItemsMap).map(([name, data], idx) => {
              const remaining = data.qty - data.delivered;
              const isAllDelivered = remaining === 0;

              return (
                <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isAllDelivered
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Milk className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{name}</h4>
                      <p className="text-[11px] text-slate-500">{data.unit} unit specification</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-xs font-bold font-mono text-slate-900">
                        {data.delivered} / {data.qty}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {isAllDelivered ? 'All Dropped' : `${remaining} in crate`}
                      </span>
                    </div>

                    <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: `${(data.delivered / data.qty) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Empty Bottle Return Crate */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Recycle className="w-4 h-4 text-emerald-600" />
              Empty Glass Bottle Return
            </h3>
            <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Recycling Crate
            </span>
          </div>

          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 text-center">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
              Collected This Morning
            </span>
            <div className="text-4xl font-black text-emerald-950 font-mono my-1">
              {totalEmptyCollected}
            </div>
            <span className="text-xs text-emerald-700">
              Sterilized glass bottles deposited in rear rack
            </span>
          </div>

          <div className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span>Rack capacity:</span>
              <span className="font-mono font-bold text-slate-800">12 Bottles</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Remaining expected:</span>
              <span className="font-mono font-bold text-slate-800">
                {Math.max(0, 5 - totalEmptyCollected)} Bottles
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Return incentive per bottle:</span>
              <span className="font-mono font-bold text-emerald-700">+₹5 Cash</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500">
            Ensure bottle caps are removed and bottles are right-side-up in the crate slots before returning to hub.
          </div>
        </div>
      </div>
    </div>
  );
};
