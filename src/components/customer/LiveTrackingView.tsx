import React, { useState } from 'react';
import { useRekart } from '../../context/RekartContext';
import { RealTimeMap } from '../common/RealTimeMap';
import {
  Bike,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  ShieldCheck,
  ThermometerSnowflake,
  Camera,
  MapPin,
  Bell,
  BellOff,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'motion/react';

export const LiveTrackingView: React.FC = () => {
  const {
    currentCustomerStop,
    driver,
    estimatedEtaMinutes,
    stopsRemainingForCustomer,
    advanceDriverToNextStep,
    isSimulating,
    toggleSimulation,
    addToast,
  } = useRekart();

  const [callModal, setCallModal] = useState<boolean>(false);
  const [quickNote, setQuickNote] = useState<string>('');
  const [sentNotes, setSentNotes] = useState<string[]>([]);
  const [showProofFullscreen, setShowProofFullscreen] = useState<boolean>(false);

  if (!currentCustomerStop) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-600">No active delivery stop found for today.</p>
      </div>
    );
  }

  const isDelivered = currentCustomerStop.status === 'delivered';
  const isArriving = currentCustomerStop.status === 'arriving_soon';
  const isOut = currentCustomerStop.status === 'out_for_delivery';

  const handleSendQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNote.trim()) return;
    setSentNotes((prev) => [...prev, quickNote.trim()]);
    addToast('Note Sent to Ramesh', `"${quickNote.trim()}" forwarded to delivery device.`, 'success');
    setQuickNote('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Status Heading */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                isDelivered
                  ? 'bg-emerald-100 text-emerald-700'
                  : isArriving
                  ? 'bg-amber-100 text-amber-700 animate-pulse'
                  : 'bg-cyan-100 text-cyan-700'
              }`}
            >
              {isDelivered ? (
                <CheckCircle2 className="w-7 h-7" />
              ) : (
                <Bike className="w-7 h-7" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                  Order {currentCustomerStop.orderId}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {currentCustomerStop.slot === 'early_morning'
                    ? 'Early Bird Run (05:00 - 06:30 AM)'
                    : 'Morning Run (06:30 - 07:30 AM)'}
                </span>
              </div>

              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1 font-serif">
                {isDelivered
                  ? 'Morning Milk Delivered at Your Doorstep!'
                  : isArriving
                  ? 'Ramesh is at Oakwood Residency Gate!'
                  : isOut
                  ? `On the Way • Arriving in ~${estimatedEtaMinutes} mins`
                  : 'Order Placed & Packed at Chilled Hub'}
              </h1>

              <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {currentCustomerStop.apartmentName}, {currentCustomerStop.wing} -{' '}
                  {currentCustomerStop.flatNumber}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Simulation trigger & ETA bubble */}
          <div className="flex items-center gap-3">
            {!isDelivered ? (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 px-4 py-2.5 rounded-xl text-right">
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                  Live Estimated Arrival
                </span>
                <div className="text-xl font-extrabold text-emerald-950 font-mono flex items-center justify-end gap-1">
                  <Clock className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span>{estimatedEtaMinutes} MINS</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-medium">
                  {stopsRemainingForCustomer === 0
                    ? 'Current stop next!'
                    : `${stopsRemainingForCustomer} stop${
                        stopsRemainingForCustomer > 1 ? 's' : ''
                      } ahead of you`}
                </span>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl text-right">
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                  Delivered At
                </span>
                <div className="text-lg font-bold text-emerald-950 font-mono">
                  {currentCustomerStop.deliveredAt}
                </div>
                <span className="text-[11px] text-emerald-700 font-medium">
                  Left at thermal door bag hook
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Live Milestone Stepper */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div
            className={`p-3 rounded-xl border transition-all ${
              true
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-100 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">1. Chilled Hub Dispatch</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-[11px] text-emerald-700 mt-1">05:00 AM • Tested 4°C</p>
          </div>

          <div
            className={`p-3 rounded-xl border transition-all ${
              isOut || isArriving || isDelivered
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-100 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">2. Sector 4 Morning Run</span>
              {isOut || isArriving || isDelivered ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Clock className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <p className="text-[11px] text-emerald-700 mt-1">EV Scooter Dispatched</p>
          </div>

          <div
            className={`p-3 rounded-xl border transition-all ${
              isArriving || isDelivered
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : isOut
                ? 'bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-amber-400/30'
                : 'bg-slate-50 border-slate-100 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">3. At Oakwood Gate</span>
              {isArriving || isDelivered ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Clock className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <p className="text-[11px] text-amber-800 mt-1">
              {isArriving ? 'Entering Lift Lobby' : 'Next in sequence'}
            </p>
          </div>

          <div
            className={`p-3 rounded-xl border transition-all ${
              isDelivered
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                : 'bg-slate-50 border-slate-100 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">4. Doorstep Drop</span>
              {isDelivered ? (
                <CheckCircle2 className="w-4 h-4 text-white" />
              ) : (
                <Clock className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <p className="text-[11px] mt-1 text-emerald-100">
              {isDelivered ? `Verified at ${currentCustomerStop.deliveredAt}` : 'Quiet Door Drop'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Delivery Boy & Bag Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Real-Time Map */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bike className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Live Neighborhood Route &amp; Scooter Telemetry
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={advanceDriverToNextStep}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 transition-colors"
                  title="Manually advance driver to next stop / status"
                >
                  Step Driver Forward ⏭️
                </button>
              </div>
            </div>

            <RealTimeMap height="h-[430px]" />
          </div>

          {/* Delivery Proof Card (if delivered) */}
          {isDelivered && currentCustomerStop.proofPhoto && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-950 text-white rounded-2xl p-5 shadow-xl border border-emerald-800"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                    <Camera className="w-4 h-4" />
                    <span>Doorstep Verification Proof Photo</span>
                  </div>
                  <h3 className="text-lg font-bold mt-1">
                    Delivered &amp; Secured at Flat 402
                  </h3>
                  <p className="text-xs text-emerald-200/90 mt-0.5">
                    Timestamped: Today at {currentCustomerStop.deliveredAt} • Captured by Ramesh Kumar
                  </p>
                </div>

                <button
                  onClick={() => setShowProofFullscreen(true)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Full Photo
                </button>
              </div>

              <div className="mt-4 flex items-center gap-4 bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/50">
                <img
                  src={currentCustomerStop.proofPhoto}
                  alt="Doorstep delivery proof"
                  className="w-20 h-20 rounded-lg object-cover border border-emerald-500/50"
                  referrerPolicy="no-referrer"
                />
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-emerald-100">
                    Location: Hanging on green Rekart bag knob hook
                  </div>
                  <div className="text-emerald-300">
                    Empty glass bottles collected:{' '}
                    <span className="font-bold text-white">
                      {currentCustomerStop.emptyBottlesCollected || 1} returned for recycling
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-300/80">
                    Doorbell status: Silent drop observed (no disturbances).
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right 1 Col: Driver Details & Bag Contents */}
        <div className="space-y-4">
          {/* Driver Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Delivery Partner
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified &amp; Vaccinated
              </span>
            </div>

            <div className="mt-3.5 flex items-center gap-3.5">
              <img
                src={driver.avatar}
                alt={driver.name}
                className="w-13 h-13 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="text-base font-bold text-slate-900">{driver.name}</h4>
                <p className="text-xs text-slate-500">{driver.vehicleType}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded">
                    ★ {driver.rating}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {driver.vehicleNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Driver Quick Communication */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => setCallModal(true)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Ramesh</span>
              </button>

              <button
                onClick={() => {
                  setQuickNote('Please place on door handle bag.');
                  addToast('Instruction Pinned', 'Fast note selected.', 'info');
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                <span>Quick Note</span>
              </button>
            </div>

            {/* Sent notes stream */}
            {sentNotes.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Notes sent to driver:
                </span>
                {sentNotes.map((note, idx) => (
                  <div
                    key={idx}
                    className="text-xs bg-emerald-50 text-emerald-900 px-2.5 py-1.5 rounded-lg border border-emerald-100 flex items-center justify-between"
                  >
                    <span>"{note}"</span>
                    <span className="text-[10px] text-emerald-600">Delivered to app</span>
                  </div>
                ))}
              </div>
            )}

            {/* Send Quick Note Form */}
            <form onSubmit={handleSendQuickNote} className="mt-3 flex items-center gap-2">
              <input
                type="text"
                placeholder="E.g. Hang on latch, dog is inside..."
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors"
              >
                Send
              </button>
            </form>
          </div>

          {/* Today's Milk Bag Contents */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                Today's Morning Bag
              </span>
              <span className="text-[11px] font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                <ThermometerSnowflake className="w-3.5 h-3.5 text-cyan-600" />
                Chilled 4°C
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {currentCustomerStop.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-emerald-800 font-bold flex items-center justify-center text-xs">
                      {item.quantity}x
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{item.productName}</h5>
                      <span className="text-[11px] text-slate-500">{item.unit} package</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-800">Ready</span>
                </div>
              ))}
            </div>

            {/* Doorstep Delivery Instructions */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                Doorstep Preference:
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                {currentCustomerStop.ringBell ? (
                  <Bell className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <BellOff className="w-4 h-4 text-amber-600 shrink-0" />
                )}
                <div>
                  <span className="font-semibold block">
                    {currentCustomerStop.ringBell
                      ? 'Ring doorbell once'
                      : 'Silent Doorstep Drop (Do Not Ring Bell)'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {currentCustomerStop.specialInstructions ||
                      'Drop inside hanging insulated thermal bag.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Call Modal */}
      {callModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Calling Delivery Partner</h3>
            <p className="text-sm font-semibold text-emerald-800 mt-1">{driver.name}</p>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{driver.phone}</p>
            <div className="my-4 p-3 rounded-xl bg-amber-50 text-amber-900 text-xs text-left border border-amber-200">
              <span className="font-bold block">Notice:</span>
              Ramesh is currently on his electric scooter navigating the sector. Use phone only for urgent gate access or address clarification.
            </div>
            <button
              onClick={() => setCallModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
            >
              Close Call Screen
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Proof Modal */}
      {showProofFullscreen && currentCustomerStop.proofPhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowProofFullscreen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">
                Doorstep Drop Photo Verification (Watermarked)
              </h4>
              <button
                onClick={() => setShowProofFullscreen(false)}
                className="text-slate-500 hover:text-slate-800 font-bold"
              >
                ✕
              </button>
            </div>
            <div className="mt-3 relative">
              <img
                src={currentCustomerStop.proofPhoto}
                alt="Delivery proof verification"
                className="w-full h-80 object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-mono">
                Oakwood Tower B - Flat 402 • Today {currentCustomerStop.deliveredAt} • GPS: 12.9290, 77.6748
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
