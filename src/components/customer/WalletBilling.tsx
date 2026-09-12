import React, { useState } from 'react';
import { useRekart } from '../../context/RekartContext';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  CreditCard,
  ShieldCheck,
  Bell,
  BellOff,
  MapPin,
  CheckCircle2,
  Receipt,
  Download,
} from 'lucide-react';

export const WalletBilling: React.FC = () => {
  const { customer, transactions, rechargeWallet, updateCustomerDeliveryPrefs, addToast } =
    useRekart();

  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(1000);

  // Doorstep preferences form
  const [ringBell, setRingBell] = useState<boolean>(customer.address.ringBell);
  const [dropAtBag, setDropAtBag] = useState<boolean>(customer.address.dropAtBag);
  const [bagLocation, setBagLocation] = useState<string>(customer.address.bagLocation);

  const rechargePacks = [
    { amount: 500, bonus: 0, label: 'Weekly Milk Trial' },
    { amount: 1000, bonus: 50, label: 'Most Popular (+₹50 Free)' },
    { amount: 2000, bonus: 150, label: 'Monthly Pass (+₹150 Free)' },
    { amount: 3000, bonus: 300, label: 'Family Pack (+₹300 Free)' },
  ];

  const handleRecharge = () => {
    if (selectedPreset) {
      const pack = rechargePacks.find((p) => p.amount === selectedPreset);
      rechargeWallet(selectedPreset, pack?.bonus || 0);
    } else if (customAmount && Number(customAmount) > 0) {
      rechargeWallet(Number(customAmount), 0);
      setCustomAmount('');
    }
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerDeliveryPrefs({
      ringBell,
      dropAtBag,
      bagLocation,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Balance & Quick Recharge */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Left Balance Display */}
          <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0 lg:pr-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                Prepaid Milk Pass
              </span>
            </div>

            <div className="mt-3">
              <span className="text-xs text-slate-500">Available Balance</span>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono mt-0.5">
                ₹{customer.walletBalance}
              </div>
              <p className="text-xs text-emerald-700 font-medium mt-1">
                Enough for ~{Math.floor(customer.walletBalance / 85)} days of fresh morning milk runs.
              </p>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
              <div className="flex items-center justify-between">
                <span>Auto-deduct per morning drop:</span>
                <span className="font-bold text-slate-800">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Low balance alert threshold:</span>
                <span className="font-bold text-slate-800">Below ₹200</span>
              </div>
            </div>
          </div>

          {/* Right Top-Up Packages */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Instant Wallet Top-Up (Zero Convenience Fees)
              </h3>
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Bonus Cash applied
              </span>
            </div>

            {/* Pack buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {rechargePacks.map((pack) => (
                <button
                  key={pack.amount}
                  type="button"
                  onClick={() => {
                    setSelectedPreset(pack.amount);
                    setCustomAmount('');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedPreset === pack.amount
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-base font-extrabold text-slate-900 font-mono">
                    ₹{pack.amount}
                  </div>
                  {pack.bonus > 0 ? (
                    <div className="text-[10px] font-bold text-emerald-700 mt-0.5">
                      +₹{pack.bonus} Bonus
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400 mt-0.5">No bonus</div>
                  )}
                  <div className="text-[9px] text-slate-500 truncate mt-1">{pack.label}</div>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleRecharge}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>
                  Recharge ₹{selectedPreset || customAmount || 1000} via UPI / NetBanking
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Delivery Preferences & Transaction Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doorstep Delivery Preferences */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Doorstep Instructions
            </h3>
            <span className="text-[10px] font-bold uppercase text-slate-400">Settings</span>
          </div>

          <form onSubmit={handleSavePreferences} className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Society &amp; Flat Address
              </label>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-0.5">
                <div className="font-bold text-slate-900">{customer.address.society}</div>
                <div>{customer.address.tower}, {customer.address.flat}</div>
                <div className="text-slate-500">{customer.address.area}, {customer.address.city}</div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Milk Bag Location &amp; Hook Notes
              </label>
              <input
                type="text"
                value={bagLocation}
                onChange={(e) => setBagLocation(e.target.value)}
                placeholder="E.g. Door knob hook, outside shoe cabinet..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={ringBell}
                  onChange={(e) => setRingBell(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Ring doorbell softly upon doorstep drop</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={dropAtBag}
                  onChange={(e) => setDropAtBag(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Hang securely inside Rekart insulated thermal pouch</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
            >
              Update Doorstep Instructions
            </button>
          </form>
        </div>

        {/* Transaction Ledger */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Wallet Statements &amp; Delivery Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Clear transparent records for every morning drop
              </p>
            </div>

            <button
              onClick={() => addToast('Monthly Statement', 'Statement downloaded as PDF.', 'info')}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {transactions.map((tx) => (
              <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.type === 'credit'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tx.type === 'credit' ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{tx.description}</h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{tx.date}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-sm font-bold font-mono ${
                      tx.type === 'credit' ? 'text-emerald-700' : 'text-slate-900'
                    }`}
                  >
                    {tx.type === 'credit' ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Bal: ₹{tx.balanceAfter}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
