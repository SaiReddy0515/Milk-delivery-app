import React, { useState } from 'react';
import { useRekart } from '../../context/RekartContext';
import {
  Milk,
  Bike,
  CheckCircle2,
  Calendar,
  Clock,
  Plus,
  Minus,
  Pause,
  Play,
  ArrowRight,
  ShieldCheck,
  ThermometerSnowflake,
  Sparkles,
  Wallet,
  MapPin,
  RefreshCw,
  Award,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { motion } from 'motion/react';

export const CustomerDashboard: React.FC = () => {
  const {
    customer,
    subscriptions,
    products,
    currentCustomerStop,
    estimatedEtaMinutes,
    adjustTomorrowQuantity,
    toggleSubscriptionPause,
    setActiveCustomerTab,
    rechargeWallet,
    addToast,
  } = useRekart();

  const [vacationModal, setVacationModal] = useState<boolean>(false);
  const [vacationStartDate, setVacationStartDate] = useState<string>('2026-09-15');
  const [vacationEndDate, setVacationEndDate] = useState<string>('2026-09-20');
  const [selectedSubForVacation, setSelectedSubForVacation] = useState<string>('all');

  const isDelivered = currentCustomerStop?.status === 'delivered';
  const isArriving = currentCustomerStop?.status === 'arriving_soon';
  const isOut = currentCustomerStop?.status === 'out_for_delivery';

  // Find milk subscription
  const primaryMilkSub = subscriptions.find((s) => s.productId.includes('milk')) || subscriptions[0];
  const primaryProduct = primaryMilkSub
    ? products.find((p) => p.id === primaryMilkSub.productId)
    : products[0];

  const handleApplyVacation = () => {
    if (selectedSubForVacation === 'all') {
      subscriptions.forEach((sub) => {
        toggleSubscriptionPause(sub.id, {
          startDate: vacationStartDate,
          endDate: vacationEndDate,
        });
      });
      addToast(
        'Vacation Mode Active',
        `All milk deliveries paused from ${vacationStartDate} to ${vacationEndDate}.`,
        'info'
      );
    } else {
      toggleSubscriptionPause(selectedSubForVacation, {
        startDate: vacationStartDate,
        endDate: vacationEndDate,
      });
    }
    setVacationModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Morning Delivery Status Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Morning Shift (05:00 AM – 07:30 AM)</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
              Good Morning, {customer.name.split(' ')[0]}!
            </h1>

            <p className="text-sm text-emerald-100/90 leading-relaxed">
              {isDelivered
                ? `Your morning dairy delivery was safely placed at your doorstep at ${currentCustomerStop.deliveredAt}. Ready for a wholesome breakfast!`
                : isArriving
                ? `Ramesh Kumar is pulling up to ${customer.address.society}. Please ensure door bag is ready!`
                : isOut
                ? `Ramesh is currently completing nearby deliveries in Sector 4. Estimated arrival in ~${estimatedEtaMinutes} minutes.`
                : `Your daily fresh milk is being chilled at the local hub for tomorrow's early morning doorstep delivery.`}
            </p>

            {/* Quick Doorstep Location & Preference Pill */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-emerald-200">
              <span className="flex items-center gap-1 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {customer.address.tower}, {customer.address.flat}
              </span>
              <span className="flex items-center gap-1 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800">
                <ThermometerSnowflake className="w-3.5 h-3.5 text-cyan-400" />
                Freshly Chilled 4°C
              </span>
              <span className="flex items-center gap-1 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800">
                {customer.address.ringBell ? '🔔 Ring Once' : '🔕 Quiet Drop in Bag'}
              </span>
            </div>
          </div>

          {/* Right Action CTA card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 sm:min-w-[280px] space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-200 uppercase tracking-wider font-bold">
                Order Status
              </span>
              <span
                className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                  isDelivered
                    ? 'bg-emerald-400 text-emerald-950'
                    : 'bg-amber-400 text-amber-950 animate-pulse'
                }`}
              >
                {isDelivered ? 'Delivered' : isArriving ? 'Arriving' : 'On Route'}
              </span>
            </div>

            <div>
              <div className="text-2xl font-black font-mono">
                {isDelivered
                  ? `Delivered ${currentCustomerStop.deliveredAt}`
                  : `~${estimatedEtaMinutes} MINS`}
              </div>
              <p className="text-xs text-emerald-200/80">
                {isDelivered
                  ? 'Left inside green thermal pouch hook'
                  : 'Ramesh Kumar on EV Scooter'}
              </p>
            </div>

            <button
              onClick={() => setActiveCustomerTab('tracking')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs shadow-lg transition-colors"
            >
              <Bike className="w-4 h-4" />
              <span>{isDelivered ? 'View Delivery Proof Photo' : 'Track Driver on Live Map'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tomorrow Morning Milk Bag Adjustment Widget */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Tomorrow Morning's Bag
              </span>
              <span className="text-xs text-slate-500">
                Delivery cutoff: 11:00 PM tonight
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Need extra milk for tea or guests tomorrow?
            </h3>
            <p className="text-xs text-slate-500">
              Easily increase, decrease, or skip tomorrow's doorstep delivery with one tap.
            </p>
          </div>

          <button
            onClick={() => setVacationModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors self-start sm:self-auto"
          >
            <Pause className="w-3.5 h-3.5 text-amber-600" />
            <span>Pause for Vacation</span>
          </button>
        </div>

        {/* Adjustments row */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {subscriptions.map((sub) => {
            const prod = products.find((p) => p.id === sub.productId);
            if (!prod) return null;

            const effectiveQty =
              sub.tomorrowAdjustment?.adjustedQuantity !== undefined
                ? sub.tomorrowAdjustment.adjustedQuantity
                : sub.quantity;

            return (
              <div
                key={sub.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 flex flex-col justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{prod.name}</h4>
                    <span className="text-[11px] text-slate-500">{prod.unit} • ₹{prod.price}</span>
                    <div className="text-[10px] text-emerald-700 font-semibold uppercase mt-0.5">
                      Schedule: {sub.frequency}
                    </div>
                  </div>
                </div>

                {/* Stepper for tomorrow */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <span className="text-xs font-semibold text-slate-600">Tomorrow:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        adjustTomorrowQuantity(sub.id, Math.max(0, effectiveQty - 1))
                      }
                      className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 font-bold transition-colors"
                      title="Decrease for tomorrow"
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    <span
                      className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                        effectiveQty === 0
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      {effectiveQty === 0 ? 'Skip (0)' : `${effectiveQty} ${prod.unit}`}
                    </span>

                    <button
                      onClick={() => adjustTomorrowQuantity(sub.id, effectiveQty + 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 font-bold transition-colors"
                      title="Add more for tomorrow"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Active Subscriptions & Wallet/Pass summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Subscriptions (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Your Active Subscriptions</h3>
              <p className="text-xs text-slate-500">
                Delivered every morning before 07:00 AM at your door
              </p>
            </div>

            <button
              onClick={() => setActiveCustomerTab('subscriptions')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Manage All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {subscriptions.map((sub) => {
              const prod = products.find((p) => p.id === sub.productId);
              if (!prod) return null;
              const isPaused = sub.status === 'paused';

              return (
                <div
                  key={sub.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isPaused
                      ? 'bg-slate-50/60 border-slate-200 opacity-75'
                      : 'bg-white border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{prod.name}</h4>
                        {isPaused && (
                          <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.2 rounded-full">
                            Paused
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {sub.quantity} x {prod.unit} • ₹{prod.price * sub.quantity} per delivery
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-emerald-800 font-medium">
                        <span className="capitalize bg-emerald-50 px-2 py-0.5 rounded">
                          {sub.frequency} schedule
                        </span>
                        <span>•</span>
                        <span>
                          {sub.slot === 'early_morning' ? '5:00 - 6:30 AM' : '6:30 - 7:30 AM'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => toggleSubscriptionPause(sub.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        isPaused
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isPaused ? (
                        <>
                          <Play className="w-3 h-3" /> Resume
                        </>
                      ) : (
                        <>
                          <Pause className="w-3 h-3" /> Pause
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setActiveCustomerTab('subscriptions')}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                      title="Edit schedule details"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setActiveCustomerTab('catalog')}
              className="flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              <Plus className="w-4 h-4" />
              <span>Subscribe to more farm products (Curd, Paneer, Ghee, Eggs)</span>
            </button>
          </div>
        </div>

        {/* Right 1 Col: Wallet & Glass Bottle Cycle */}
        <div className="space-y-4">
          {/* Prepaid Wallet Card */}
          <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-2xl p-5 text-white shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-emerald-200 tracking-wider flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-emerald-300" />
                Prepaid Milk Pass
              </span>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                Auto-Deduct
              </span>
            </div>

            <div className="mt-4">
              <span className="text-xs text-emerald-200/80">Available Balance</span>
              <div className="text-3xl font-extrabold font-mono mt-0.5">
                ₹{customer.walletBalance}
              </div>
              <p className="text-[11px] text-emerald-200/70 mt-1">
                Sufficient for approximately {Math.floor(customer.walletBalance / 85)} days of fresh milk
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-700/60 flex items-center gap-2">
              <button
                onClick={() => rechargeWallet(1000, 50)}
                className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 text-xs font-bold text-center transition-colors shadow-xs"
              >
                +₹1,000 Top-Up (+₹50)
              </button>
              <button
                onClick={() => setActiveCustomerTab('wallet')}
                className="py-2 px-3 rounded-xl bg-emerald-700/60 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
              >
                Details
              </button>
            </div>
          </div>

          {/* Eco Glass Bottle Circular Hygiene Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Eco Bottle Exchange
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Zero Plastic
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Milk className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {customer.emptyBottlesWithCustomer} Glass Bottles at Doorstep
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Leave rinsed empty bottles in your Rekart bag tonight. Ramesh will collect and sanitize them.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Sterilized at 85°C steam wash at local dairy hub before bottling.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vacation Modal */}
      {vacationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Schedule Vacation Pause</h3>
              <button
                onClick={() => setVacationModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-3">
              Going out of town? Pause your daily milk run with no charges. Your prepaid balance remains 100% safe.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Which subscriptions to pause?
                </label>
                <select
                  value={selectedSubForVacation}
                  onChange={(e) => setSelectedSubForVacation(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                >
                  <option value="all">All Subscriptions (Milk, Curd, Paneer)</option>
                  {subscriptions.map((s) => {
                    const p = products.find((pr) => pr.id === s.productId);
                    return (
                      <option key={s.id} value={s.id}>
                        {p?.name || s.productId}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Pause From
                  </label>
                  <input
                    type="date"
                    value={vacationStartDate}
                    onChange={(e) => setVacationStartDate(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Resume On
                  </label>
                  <input
                    type="date"
                    value={vacationEndDate}
                    onChange={(e) => setVacationEndDate(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setVacationModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyVacation}
                className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs"
              >
                Save Vacation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
