import React from 'react';
import { useRekart } from '../../context/RekartContext';
import {
  Wallet,
  TrendingUp,
  Star,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  ShieldCheck,
} from 'lucide-react';

export const DriverEarnings: React.FC = () => {
  const { driver, stops } = useRekart();

  const completed = stops.filter((s) => s.status === 'delivered').length;
  const baseEarnings = completed * 40;
  const punctualityBonus = completed >= 3 ? 50 : 0;
  let bottlesCount = 0;
  stops.forEach((s) => {
    if (s.emptyBottlesCollected) bottlesCount += s.emptyBottlesCollected;
  });
  const bottleIncentive = bottlesCount * 5;
  const customerTips = 40;
  const totalToday = baseEarnings + punctualityBonus + bottleIncentive + customerTips;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              Delivery Partner Earnings
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 font-serif">
            Shift Earnings &amp; Performance Score
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Partner: {driver.name} • {driver.vehicleType} • Direct weekly bank deposit
          </p>
        </div>

        {/* Total Today Big Card */}
        <div className="bg-gradient-to-br from-emerald-800 to-teal-950 text-white px-5 py-3.5 rounded-2xl shadow-md min-w-[200px]">
          <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
            Today's Shift Earned
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono mt-0.5">
            ₹{totalToday}
          </div>
          <span className="text-[11px] text-emerald-200">
            For {completed} of {stops.length} completed drops
          </span>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Earnings Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Today's Payout Breakdown</h3>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Doorstep Deliveries</span>
                <span className="text-slate-400">{completed} stops completed @ ₹40/door</span>
              </div>
              <span className="font-mono font-bold text-slate-900 text-sm">₹{baseEarnings}</span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">
                  Early Bird Punctuality Bonus
                </span>
                <span className="text-slate-400">Delivered before 06:30 AM</span>
              </div>
              <span className="font-mono font-bold text-emerald-700 text-sm">
                +₹{punctualityBonus}
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">
                  Glass Bottle Collection Incentive
                </span>
                <span className="text-slate-400">{bottlesCount} return bottles @ ₹5/bottle</span>
              </div>
              <span className="font-mono font-bold text-emerald-700 text-sm">
                +₹{bottleIncentive}
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Customer Tips &amp; Goodies</span>
                <span className="text-slate-400">Oakwood Flat 402 &amp; 304</span>
              </div>
              <span className="font-mono font-bold text-emerald-700 text-sm">
                +₹{customerTips}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm font-extrabold text-slate-900">
            <span>Net Shift Total</span>
            <span className="font-mono text-emerald-800 text-base">₹{totalToday}</span>
          </div>
        </div>

        {/* Driver Ratings & Quality Badges */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Driver Quality Score</h3>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              {driver.rating} / 5.0
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                On-Time Rate
              </span>
              <div className="text-xl font-black text-slate-900 font-mono mt-0.5">99.4%</div>
              <span className="text-[10px] text-emerald-700 font-medium">Top 5% in Sector</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Total Runs Done
              </span>
              <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
                {driver.totalDeliveriesCompleted}
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Over 18 months</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-700 block">
              Customer Badges &amp; Compliments:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Quiet Delivery Master
              </span>
              <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" /> Never Misses 6 AM
              </span>
              <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Clean Bottle Handling
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
