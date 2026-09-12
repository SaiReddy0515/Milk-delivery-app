import React, { useState } from 'react';
import { useRekart } from '../../context/RekartContext';
import { DeliveryStop, OrderStatus } from '../../types';
import {
  Bike,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Camera,
  Navigation,
  AlertCircle,
  Bell,
  BellOff,
  ShoppingBag,
  Milk,
  RotateCcw,
  Sparkles,
  Check,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DriverRouteManifest: React.FC = () => {
  const {
    stops,
    driver,
    updateStopStatus,
    advanceDriverToNextStep,
    addToast,
  } = useRekart();

  const [deliveryModalStop, setDeliveryModalStop] = useState<DeliveryStop | null>(null);
  const [emptyBottlesCount, setEmptyBottlesCount] = useState<number>(1);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=600&q=80'
  );
  const [callAlert, setCallAlert] = useState<string | null>(null);

  const completedCount = stops.filter((s) => s.status === 'delivered').length;
  const progressPercent = Math.round((completedCount / stops.length) * 100);

  const handleOpenDeliverModal = (stop: DeliveryStop) => {
    setDeliveryModalStop(stop);
    const hasGlass = stop.items.some((i) => i.productId.includes('glass') || i.productId.includes('1l'));
    setEmptyBottlesCount(hasGlass ? 1 : 0);
  };

  const handleConfirmDelivery = () => {
    if (!deliveryModalStop) return;
    updateStopStatus(
      deliveryModalStop.id,
      'delivered',
      capturedPhotoUrl,
      emptyBottlesCount
    );
    addToast(
      'Delivery Confirmed',
      `Delivered to ${deliveryModalStop.apartmentName} ${deliveryModalStop.flatNumber}. Empty bottles: ${emptyBottlesCount}`,
      'success'
    );
    setDeliveryModalStop(null);
  };

  return (
    <div className="space-y-6">
      {/* Route Progress Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Bike className="w-3.5 h-3.5" />
                Morning Route: {driver.routeSector}
              </span>
              <span className="text-xs text-slate-300 font-mono">
                Shift: 05:00 AM – 07:30 AM
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 font-serif">
              Doorstep Manifest ({completedCount}/{stops.length} Delivered)
            </h1>

            <p className="text-xs text-slate-300 mt-1 max-w-lg">
              Sorted in optimal door-to-door sequence across Oakwood Residency Towers and Green Glen Layout.
            </p>
          </div>

          {/* Quick Route KPI card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 min-w-[240px]">
            <div className="flex items-center justify-between text-xs text-emerald-200">
              <span className="font-bold">Shift Completion</span>
              <span className="font-mono font-black text-sm">{progressPercent}%</span>
            </div>

            <div className="w-full bg-slate-800 h-2.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-300">
              <span>{stops.length - completedCount} drops remaining</span>
              <span className="text-emerald-300 font-semibold">Punctuality 99.4%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sequential Manifest Checklist */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Morning Drop-Off Sequence</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-mono">
              6 Stops
            </span>
          </h2>

          <div className="text-xs text-slate-500">
            Click "Mark Delivered" to complete drop &amp; capture bag photo
          </div>
        </div>

        <div className="space-y-3.5">
          {stops.map((stop, index) => {
            const isDelivered = stop.status === 'delivered';
            const isArriving = stop.status === 'arriving_soon';
            const isOut = stop.status === 'out_for_delivery';
            const isTarget = stop.status !== 'delivered' && (stops.findIndex((s) => s.status !== 'delivered') === index);

            return (
              <div
                key={stop.id}
                className={`bg-white rounded-2xl border transition-all p-5 shadow-xs ${
                  isTarget
                    ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/10'
                    : isDelivered
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Stop Info */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        isDelivered
                          ? 'bg-emerald-600 text-white'
                          : isTarget
                          ? 'bg-amber-500 text-slate-950 animate-pulse'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isDelivered ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          {stop.apartmentName}
                        </span>
                        <span className="text-xs font-black text-slate-900 bg-slate-200/80 px-2.5 py-0.5 rounded-md">
                          {stop.wing} — {stop.flatNumber} (Floor {stop.floor})
                        </span>
                        {stop.isCurrentCustomer && (
                          <span className="text-xs font-bold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                            ★ Sneha Reddy (Current User)
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            isDelivered
                              ? 'bg-emerald-100 text-emerald-800'
                              : isArriving
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isDelivered
                            ? `Delivered ${stop.deliveredAt}`
                            : isArriving
                            ? 'At Gate / Lift'
                            : isOut
                            ? 'Out for Delivery'
                            : 'Scheduled'}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 mt-1">
                        {stop.customerName} •{' '}
                        <span className="text-slate-500 font-normal">{stop.phone}</span>
                      </h3>

                      {/* Items in crate */}
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {stop.items.map((item, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200/60"
                          >
                            <Milk className="w-3.5 h-3.5 text-emerald-700" />
                            <span>
                              {item.quantity}x {item.productName} ({item.unit})
                            </span>
                          </span>
                        ))}
                      </div>

                      {/* Delivery Instructions Bar */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                        <div
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold ${
                            stop.ringBell
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-900 border border-amber-200'
                          }`}
                        >
                          {stop.ringBell ? (
                            <>
                              <Bell className="w-3.5 h-3.5" />
                              <span>Ring Doorbell Once</span>
                            </>
                          ) : (
                            <>
                              <BellOff className="w-3.5 h-3.5" />
                              <span>Quiet Delivery (Baby/Pets sleeping)</span>
                            </>
                          )}
                        </div>

                        {stop.specialInstructions && (
                          <span className="text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                            Note: {stop.specialInstructions}
                          </span>
                        )}

                        {isDelivered && stop.emptyBottlesCollected !== undefined && (
                          <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 font-semibold">
                            Empty Bottles Collected: {stop.emptyBottlesCollected}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Action Buttons */}
                  <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                    <button
                      onClick={() => setCallAlert(`Calling ${stop.customerName} (${stop.phone})...`)}
                      className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                      title="Call customer"
                    >
                      <Phone className="w-4 h-4" />
                    </button>

                    {!isDelivered ? (
                      <div className="flex items-center gap-2">
                        {stop.status === 'placed' && (
                          <button
                            onClick={() => updateStopStatus(stop.id, 'out_for_delivery')}
                            className="px-3 py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-bold hover:bg-amber-100 transition-colors"
                          >
                            Mark On Route
                          </button>
                        )}

                        {stop.status === 'out_for_delivery' && (
                          <button
                            onClick={() => updateStopStatus(stop.id, 'arriving_soon')}
                            className="px-3 py-2 rounded-xl border border-amber-400 bg-amber-100 text-amber-950 text-xs font-bold hover:bg-amber-200 transition-colors animate-pulse"
                          >
                            Arrived at Gate
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenDeliverModal(stop)}
                          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Mark Delivered</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Completed</span>
                        </span>
                        {stop.proofPhoto && (
                          <a
                            href={stop.proofPhoto}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
                            title="View proof photo"
                          >
                            <Camera className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deliver Action Modal */}
      <AnimatePresence>
        {deliveryModalStop && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Doorstep Drop-off
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {deliveryModalStop.apartmentName} {deliveryModalStop.flatNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setDeliveryModalStop(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              {/* Items checklist */}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Place in thermal door bag:
                </span>
                <div className="space-y-1">
                  {deliveryModalStop.items.map((item, idx) => (
                    <div key={idx} className="text-xs font-bold text-slate-900 flex items-center justify-between">
                      <span>{item.quantity}x {item.productName}</span>
                      <span className="text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded text-[11px]">
                        {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Doorbell check */}
              <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                {deliveryModalStop.ringBell ? (
                  <>
                    <Bell className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Customer requested: <strong>Ring doorbell once softly.</strong></span>
                  </>
                ) : (
                  <>
                    <BellOff className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Customer requested: <strong>DO NOT ring doorbell (Quiet drop).</strong></span>
                  </>
                )}
              </div>

              {/* Empty Return Bottles Stepper */}
              <div className="mt-4">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Empty Glass Bottles Collected from Bag:
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEmptyBottlesCount(Math.max(0, emptyBottlesCount - 1))}
                    className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-100 font-bold flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold font-mono px-3 py-1 bg-slate-100 rounded-lg">
                    {emptyBottlesCount} bottles
                  </span>
                  <button
                    type="button"
                    onClick={() => setEmptyBottlesCount(emptyBottlesCount + 1)}
                    className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-100 font-bold flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Photo Proof Simulation Preview */}
              <div className="mt-4">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Proof Photo (Bag on door handle):
                </label>
                <div className="relative rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src={capturedPhotoUrl}
                    alt="Doorstep proof"
                    className="w-full h-36 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                    Watermark: {deliveryModalStop.flatNumber} • {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryModalStop(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelivery}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md"
                >
                  Confirm Drop-off
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Phone Call Toast/Modal */}
      {callAlert && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-3">
          <Phone className="w-4 h-4 text-emerald-400 animate-bounce" />
          <span className="text-xs font-medium">{callAlert}</span>
          <button
            onClick={() => setCallAlert(null)}
            className="text-slate-400 hover:text-white text-xs font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
