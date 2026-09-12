import React from 'react';
import { useRekart } from '../../context/RekartContext';
import {
  Milk,
  Bike,
  User,
  Wallet,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Bell,
  Sparkles,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    customer,
    driver,
    currentCustomerStop,
    estimatedEtaMinutes,
    isSimulating,
    toggleSimulation,
    resetSimulation,
    simSpeed,
    setSimSpeed,
    activeCustomerTab,
    setActiveCustomerTab,
    activeDriverTab,
    setActiveDriverTab,
  } = useRekart();

  const isDelivered = currentCustomerStop?.status === 'delivered';
  const isArriving = currentCustomerStop?.status === 'arriving_soon';
  const isOut = currentCustomerStop?.status === 'out_for_delivery';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top Banner with Delivery Shift Notice & Live Simulation Control */}
      <div className="bg-emerald-950 text-emerald-100 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium tracking-wide">
            Early Morning Milk Run Live (05:00 AM – 07:30 AM)
          </span>
          <span className="hidden md:inline text-emerald-400">•</span>
          <span className="hidden md:inline text-emerald-300">
            Sector 4 &amp; 5 Hub • 100% Chilled Farm Purity
          </span>
        </div>

        {/* Quick Simulation Bar */}
        <div className="flex items-center gap-2 bg-emerald-900/80 px-2.5 py-0.5 rounded-full border border-emerald-700/60">
          <span className="text-[11px] text-emerald-200 flex items-center gap-1 font-mono">
            <Zap className="w-3 h-3 text-amber-400" />
            Live Run Sim:
          </span>
          <button
            onClick={toggleSimulation}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
              isSimulating
                ? 'bg-amber-500 text-amber-950 hover:bg-amber-400'
                : 'bg-emerald-600 text-white hover:bg-emerald-500'
            }`}
            title={isSimulating ? 'Pause Driver GPS' : 'Start Driver GPS Simulation'}
          >
            {isSimulating ? (
              <>
                <Pause className="w-3 h-3" /> Moving
              </>
            ) : (
              <>
                <Play className="w-3 h-3" /> Simulate Run
              </>
            )}
          </button>

          <button
            onClick={() => setSimSpeed(simSpeed === 1 ? 2 : simSpeed === 2 ? 4 : 1)}
            className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-800 hover:bg-emerald-700 text-emerald-200 font-mono"
            title="Toggle simulation speed"
          >
            {simSpeed}x
          </button>

          <button
            onClick={resetSimulation}
            className="p-1 rounded text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors"
            title="Reset delivery run"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Header Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Milk className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-serif">
                  rekart
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Daily
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Farm-to-Doorstep Milk &amp; Dairy
              </p>
            </div>
          </div>

          {/* Center Status: Real-time order pill */}
          <div className="hidden lg:flex items-center gap-2">
            {isDelivered ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Today's Morning Milk Delivered at {currentCustomerStop.deliveredAt}</span>
              </div>
            ) : isArriving || isOut ? (
              <button
                onClick={() => {
                  setRole('customer');
                  setActiveCustomerTab('tracking');
                }}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold hover:bg-amber-100 transition-colors animate-pulse"
              >
                <Bike className="w-4 h-4 text-amber-600" />
                <span>
                  {isArriving
                    ? 'Ramesh is at your apartment gate! (Arriving in ~2 min)'
                    : `Ramesh Kumar is on route • ETA ~${estimatedEtaMinutes} mins`}
                </span>
                <span className="text-[11px] underline ml-1 text-amber-700">Track Live</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Next Delivery: Tomorrow by 06:30 AM</span>
              </div>
            )}
          </div>

          {/* Right Section: Role Switcher & Customer Wallet */}
          <div className="flex items-center gap-3">
            {/* Wallet pill (Customer view only) */}
            {role === 'customer' && (
              <button
                onClick={() => setActiveCustomerTab('wallet')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-semibold transition-colors"
                title="View Rekart Milk Pass Wallet"
              >
                <Wallet className="w-3.5 h-3.5 text-emerald-700" />
                <span>₹{customer.walletBalance}</span>
                <span className="text-[10px] text-emerald-600 font-normal hidden sm:inline">Pass</span>
              </button>
            )}

            {/* Portal Switcher (Customer vs Driver) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                onClick={() => setRole('customer')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  role === 'customer'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Customer</span>
              </button>

              <button
                onClick={() => setRole('driver')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  role === 'driver'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bike className="w-3.5 h-3.5 text-amber-300" />
                <span>Delivery Partner</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Subnav based on Role */}
        <div className="flex items-center justify-between border-t border-slate-100 py-2 overflow-x-auto scrollbar-none">
          {role === 'customer' ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setActiveCustomerTab('overview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCustomerTab === 'overview'
                    ? 'bg-emerald-100/70 text-emerald-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Morning Overview
              </button>

              <button
                onClick={() => setActiveCustomerTab('tracking')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCustomerTab === 'tracking'
                    ? 'bg-emerald-100/70 text-emerald-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Live Order Tracking
                {!isDelivered && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                )}
              </button>

              <button
                onClick={() => setActiveCustomerTab('subscriptions')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCustomerTab === 'subscriptions'
                    ? 'bg-emerald-100/70 text-emerald-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Subscription Management
              </button>

              <button
                onClick={() => setActiveCustomerTab('catalog')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCustomerTab === 'catalog'
                    ? 'bg-emerald-100/70 text-emerald-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Dairy Catalog &amp; Milk Top-up
              </button>

              <button
                onClick={() => setActiveCustomerTab('wallet')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCustomerTab === 'wallet'
                    ? 'bg-emerald-100/70 text-emerald-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Wallet &amp; Pass
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setActiveDriverTab('manifest')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    activeDriverTab === 'manifest'
                      ? 'bg-emerald-900 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Doorstep Run Manifest (6 Stops)
                </button>

                <button
                  onClick={() => setActiveDriverTab('map')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    activeDriverTab === 'map'
                      ? 'bg-emerald-900 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Live Route GPS Navigation
                </button>

                <button
                  onClick={() => setActiveDriverTab('crates')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    activeDriverTab === 'crates'
                      ? 'bg-emerald-900 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Crates &amp; Bottle Return Inventory
                </button>

                <button
                  onClick={() => setActiveDriverTab('earnings')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    activeDriverTab === 'earnings'
                      ? 'bg-emerald-900 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Driver Shift Earnings &amp; Ratings
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 font-medium">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Driver: {driver.name} ({driver.vehicleNumber})</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
