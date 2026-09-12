import React, { useState } from 'react';
import { useRekart } from '../../context/RekartContext';
import { Subscription, DeliveryFrequency, DeliverySlot, Product } from '../../types';
import {
  Calendar as CalendarIcon,
  Plus,
  Pause,
  Play,
  Trash2,
  Edit2,
  Clock,
  Bell,
  BellOff,
  CheckCircle2,
  ShieldCheck,
  Milk,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const SubscriptionManager: React.FC = () => {
  const {
    subscriptions,
    products,
    addSubscription,
    updateSubscription,
    toggleSubscriptionPause,
    deleteSubscription,
    addToast,
  } = useRekart();

  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);

  // Form states for new/edit
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [frequency, setFrequency] = useState<DeliveryFrequency>('daily');
  const [customDays, setCustomDays] = useState<number[]>([1, 3, 5]); // Mon, Wed, Fri default
  const [slot, setSlot] = useState<DeliverySlot>('early_morning');
  const [ringBell, setRingBell] = useState<boolean>(false);
  const [bottleDropInBag, setBottleDropInBag] = useState<boolean>(true);

  const daysOfWeek = [
    { label: 'Sun', value: 0 },
    { label: 'Mon', value: 1 },
    { label: 'Tue', value: 2 },
    { label: 'Wed', value: 3 },
    { label: 'Thu', value: 4 },
    { label: 'Fri', value: 5 },
    { label: 'Sat', value: 6 },
  ];

  const handleOpenAdd = () => {
    setEditingSub(null);
    setSelectedProductId(products[0]?.id || '');
    setQuantity(1);
    setFrequency('daily');
    setCustomDays([1, 3, 5]);
    setSlot('early_morning');
    setRingBell(false);
    setBottleDropInBag(true);
    setAddModalOpen(true);
  };

  const handleOpenEdit = (sub: Subscription) => {
    setEditingSub(sub);
    setSelectedProductId(sub.productId);
    setQuantity(sub.quantity);
    setFrequency(sub.frequency);
    setCustomDays(sub.customDays || [1, 3, 5]);
    setSlot(sub.slot);
    setRingBell(sub.ringBell);
    setBottleDropInBag(sub.bottleDropInBag);
    setAddModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSub) {
      updateSubscription(editingSub.id, {
        productId: selectedProductId,
        quantity,
        frequency,
        customDays: frequency === 'custom' ? customDays : undefined,
        slot,
        ringBell,
        bottleDropInBag,
      });
      addToast('Subscription Updated', 'Delivery schedule changes saved.', 'success');
    } else {
      addSubscription({
        productId: selectedProductId,
        quantity,
        frequency,
        customDays: frequency === 'custom' ? customDays : undefined,
        startDate: new Date().toISOString().split('T')[0],
        status: 'active',
        slot,
        ringBell,
        bottleDropInBag,
      });
    }
    setAddModalOpen(false);
  };

  const toggleCustomDay = (day: number) => {
    setCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  // Generate 14-day upcoming schedule preview
  const upcomingDays = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dayOfWeek = d.getDay();
    const isToday = i === 0;
    const isTomorrow = i === 1;

    // Check which items are scheduled for this day
    const scheduledItems = subscriptions.filter((sub) => {
      if (sub.status === 'paused') return false;
      if (sub.frequency === 'daily') return true;
      if (sub.frequency === 'alternate') return i % 2 === 0;
      if (sub.frequency === 'weekdays') return dayOfWeek >= 1 && dayOfWeek <= 5;
      if (sub.frequency === 'weekends') return dayOfWeek === 0 || dayOfWeek === 6;
      if (sub.frequency === 'custom') return sub.customDays?.includes(dayOfWeek);
      return false;
    });

    return {
      date: d,
      dayNum: d.getDate(),
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      isToday,
      isTomorrow,
      scheduledItems,
    };
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
              Doorstep Morning Deliveries
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 font-serif">
            Subscription Schedule Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Set custom repeating frequencies, pause delivery during holidays, and choose doorstep delivery slots.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subscription</span>
        </button>
      </div>

      {/* 14-Day Delivery Calendar Strip */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              14-Day Morning Delivery Schedule
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Green dots indicate scheduled doorstep milk drops
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-7 lg:grid-cols-14 gap-2 overflow-x-auto pb-2">
          {upcomingDays.map((day, idx) => {
            const hasDelivery = day.scheduledItems.length > 0;
            return (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-between min-h-[90px] transition-all ${
                  day.isToday
                    ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm'
                    : day.isTomorrow
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 ring-1 ring-emerald-400/40'
                    : hasDelivery
                    ? 'bg-white border-slate-200 text-slate-800 hover:border-emerald-300'
                    : 'bg-slate-50/50 border-slate-100 text-slate-400'
                }`}
              >
                <div className="text-[11px] font-semibold uppercase tracking-wider">
                  {day.isToday ? 'Today' : day.isTomorrow ? 'Tomorrow' : day.dayName}
                </div>

                <div className="text-base font-extrabold my-1">{day.dayNum}</div>

                <div className="flex items-center justify-center gap-1">
                  {hasDelivery ? (
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        day.isToday ? 'bg-emerald-400' : 'bg-emerald-600'
                      }`}
                      title={`${day.scheduledItems.length} deliveries scheduled`}
                    ></span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium">—</span>
                  )}
                </div>

                <div className="text-[9px] truncate max-w-full font-medium mt-1">
                  {hasDelivery ? `${day.scheduledItems.length} items` : 'No run'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Subscriptions List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">Configured Subscriptions</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subscriptions.map((sub) => {
            const prod = products.find((p) => p.id === sub.productId);
            if (!prod) return null;
            const isPaused = sub.status === 'paused';

            return (
              <div
                key={sub.id}
                className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between shadow-xs ${
                  isPaused
                    ? 'border-slate-200 opacity-70 bg-slate-50/40'
                    : 'border-slate-200 hover:border-emerald-400'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{prod.name}</h4>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              isPaused
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-emerald-100 text-emerald-900'
                            }`}
                          >
                            {isPaused ? 'Paused' : 'Active'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Quantity: <span className="font-bold text-slate-800">{sub.quantity} x {prod.unit}</span> (₹{prod.price * sub.quantity} per morning)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Schedule badges */}
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Frequency
                      </span>
                      <span className="font-semibold text-slate-800 capitalize">
                        {sub.frequency === 'custom' && sub.customDays
                          ? `Custom (${sub.customDays.map((d) => daysOfWeek[d].label).join(', ')})`
                          : sub.frequency}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Morning Slot
                      </span>
                      <span className="font-semibold text-slate-800">
                        {sub.slot === 'early_morning' ? '05:00 - 06:30 AM' : '06:30 - 07:30 AM'}
                      </span>
                    </div>
                  </div>

                  {/* Doorstep preference line */}
                  <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
                    {sub.ringBell ? (
                      <Bell className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <BellOff className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    <span>
                      {sub.ringBell ? 'Ring doorbell' : 'Silent doorstep drop in insulated bag'}
                    </span>
                  </div>

                  {/* Tomorrow Adjustment Alert (if any) */}
                  {sub.tomorrowAdjustment && (
                    <div className="mt-3 p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                      <span>Tomorrow quantity set to: {sub.tomorrowAdjustment.adjustedQuantity}</span>
                      <span className="text-[10px] font-bold uppercase">Temporary Override</span>
                    </div>
                  )}
                </div>

                {/* Actions footer */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleSubscriptionPause(sub.id)}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      isPaused
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isPaused ? (
                      <>
                        <Play className="w-3 h-3" /> Resume Delivery
                      </>
                    ) : (
                      <>
                        <Pause className="w-3 h-3" /> Pause
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(sub)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                    title="Edit Schedule & Quantity"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteSubscription(sub.id)}
                    className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600"
                    title="Cancel Subscription"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Subscription Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingSub ? 'Edit Subscription Schedule' : 'Create Recurring Milk Delivery'}
              </h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              {/* Product selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Select Milk / Dairy Product
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.unit}) — ₹{p.price}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity Stepper */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Daily Quantity (Packets / Bottles)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-100 font-bold flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold font-mono px-3 py-1 bg-slate-100 rounded-lg">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-100 font-bold flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Frequency Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Delivery Frequency
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'daily', label: 'Everyday' },
                      { id: 'alternate', label: 'Alternate Days' },
                      { id: 'weekdays', label: 'Mon – Fri' },
                      { id: 'weekends', label: 'Sat & Sun' },
                      { id: 'custom', label: 'Custom Days' },
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFrequency(f.id)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                        frequency === f.id
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-400 ring-2 ring-emerald-500/20'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom days picker if selected */}
              {frequency === 'custom' && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                    Select Delivery Days:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {daysOfWeek.map((day) => {
                      const isSelected = customDays.includes(day.value);
                      return (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => toggleCustomDay(day.value)}
                          className={`w-9 h-9 rounded-lg text-xs font-bold transition-colors ${
                            isSelected
                              ? 'bg-emerald-700 text-white'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Delivery Slot */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Morning Delivery Window
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSlot('early_morning')}
                    className={`p-2.5 rounded-xl text-xs font-semibold border text-left ${
                      slot === 'early_morning'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="font-bold">Early Bird</div>
                    <div className="text-[10px] text-slate-500">05:00 AM – 06:30 AM</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSlot('morning')}
                    className={`p-2.5 rounded-xl text-xs font-semibold border text-left ${
                      slot === 'morning'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="font-bold">Standard Morning</div>
                    <div className="text-[10px] text-slate-500">06:30 AM – 07:30 AM</div>
                  </button>
                </div>
              </div>

              {/* Doorstep preference checkboxes */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={ringBell}
                    onChange={(e) => setRingBell(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Ring doorbell upon delivery (Leave unchecked for quiet drop)</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={bottleDropInBag}
                    onChange={(e) => setBottleDropInBag(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Drop inside hanging Rekart insulated door bag</span>
                </label>
              </div>

              <div className="mt-6 flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs"
                >
                  {editingSub ? 'Save Changes' : 'Activate Subscription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
