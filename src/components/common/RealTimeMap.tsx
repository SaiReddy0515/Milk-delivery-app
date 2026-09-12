import React, { useState } from 'react';
import { useRekart } from '../../context/RekartContext';
import { DeliveryStop } from '../../types';
import {
  Bike,
  MapPin,
  CheckCircle2,
  Clock,
  Phone,
  Maximize2,
  Navigation,
  Compass,
  Sparkles,
  Camera,
  AlertCircle,
  Milk,
  Eye,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RealTimeMapProps {
  interactive?: boolean;
  height?: string;
  selectedStopId?: string;
  onSelectStop?: (stop: DeliveryStop) => void;
  showDriverFocusNotice?: boolean;
}

export const RealTimeMap: React.FC<RealTimeMapProps> = ({
  interactive = true,
  height = 'h-[460px]',
  selectedStopId,
  onSelectStop,
  showDriverFocusNotice = true,
}) => {
  const {
    stops,
    driver,
    currentCustomerStop,
    updateStopStatus,
    advanceDriverToNextStep,
    isSimulating,
    toggleSimulation,
  } = useRekart();

  const [activeStopModal, setActiveStopModal] = useState<DeliveryStop | null>(null);
  const [mapTheme, setMapTheme] = useState<'early_dawn' | 'clear_day'>('early_dawn');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Map coordinates projection for Sector 4
  // Lat range: 12.9260 to 12.9320 (0% to 100% Y, inverted)
  // Lng range: 77.6710 to 77.6790 (0% to 100% X)
  const minLat = 12.926;
  const maxLat = 12.9325;
  const minLng = 77.6705;
  const maxLng = 77.6795;

  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100;
    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(8, Math.min(92, y)),
    };
  };

  const driverPos = projectCoords(driver.currentLat, driver.currentLng);
  const customerPos = currentCustomerStop
    ? projectCoords(currentCustomerStop.latitude, currentCustomerStop.longitude)
    : { x: 55, y: 45 };

  // Generate SVG path through stops in sequential route order
  const routePoints = stops.map((s) => projectCoords(s.latitude, s.longitude));
  const svgPathData = routePoints
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x * 9} ${pt.y * 5.2}`)
    .join(' ');

  const currentStop = stops.find((s) => s.status !== 'delivered') || stops[stops.length - 1];

  return (
    <div
      className={`relative w-full ${height} rounded-2xl overflow-hidden border border-slate-200/80 shadow-inner select-none transition-all duration-300 ${
        mapTheme === 'early_dawn'
          ? 'bg-gradient-to-b from-[#172338] via-[#1a2d42] to-[#121c2b] text-slate-100'
          : 'bg-gradient-to-b from-[#f4f7f6] via-[#e9f0ec] to-[#dfebe4] text-slate-800'
      }`}
    >
      {/* Top Map HUD */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none gap-2">
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 shadow-lg text-white">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
          <div>
            <div className="text-[11px] font-bold tracking-wider uppercase text-emerald-300 flex items-center gap-1">
              <span>Sector 4 Early Morning Milk Corridor</span>
            </div>
            <div className="text-[10px] text-slate-300">
              Live Hub GPS Telemetry • Vehicle: {driver.vehicleNumber}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() =>
              setMapTheme(mapTheme === 'early_dawn' ? 'clear_day' : 'early_dawn')
            }
            className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-200 backdrop-blur-md border border-slate-700/60 transition-colors"
            title="Toggle Early Dawn / Day Light map theme"
          >
            {mapTheme === 'early_dawn' ? '🌙 5:30 AM Dawn' : '☀️ Day Light'}
          </button>
          <button
            onClick={toggleSimulation}
            className={`px-3 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 shadow-md transition-colors ${
              isSimulating
                ? 'bg-amber-500 text-amber-950 hover:bg-amber-400'
                : 'bg-emerald-600 text-white hover:bg-emerald-500'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>{isSimulating ? 'Pause Bike' : 'Auto Move'}</span>
          </button>
        </div>
      </div>

      {/* Styled Neighborhood Geometry (Vector Roads, Apartment Blocks & Parks) */}
      <svg
        viewBox="0 0 900 520"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="roadGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
          </linearGradient>

          <pattern
            id="gridPattern"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke={mapTheme === 'early_dawn' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'}
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect width="900" height="520" fill="url(#gridPattern)" />

        {/* Sector Green Parks & Gardens */}
        <path
          d="M 100,60 Q 220,50 260,140 Q 280,220 180,240 Q 90,230 70,140 Z"
          fill={mapTheme === 'early_dawn' ? '#0d281e' : '#c8e6c9'}
          opacity={mapTheme === 'early_dawn' ? '0.6' : '0.5'}
        />
        <text
          x="150"
          y="150"
          fill={mapTheme === 'early_dawn' ? '#34d399' : '#2e7d32'}
          fontSize="11"
          fontWeight="600"
          opacity="0.7"
          letterSpacing="1"
        >
          OAKWOOD COMMUNITY PARK
        </text>

        <path
          d="M 640,320 Q 820,300 850,440 Q 750,490 620,460 Z"
          fill={mapTheme === 'early_dawn' ? '#0d281e' : '#c8e6c9'}
          opacity={mapTheme === 'early_dawn' ? '0.5' : '0.5'}
        />
        <text
          x="690"
          y="400"
          fill={mapTheme === 'early_dawn' ? '#34d399' : '#2e7d32'}
          fontSize="10"
          fontWeight="600"
          opacity="0.7"
        >
          BELLANDUR GREEN BUFFER
        </text>

        {/* Apartment Blocks & Villa Layouts */}
        <g opacity={mapTheme === 'early_dawn' ? '0.4' : '0.6'}>
          {/* Tower A & B complexes */}
          <rect x="220" y="240" width="80" height="60" rx="6" fill={mapTheme === 'early_dawn' ? '#25354e' : '#cbd5e1'} />
          <text x="235" y="275" fill={mapTheme === 'early_dawn' ? '#94a3b8' : '#475569'} fontSize="10" fontWeight="bold">TOWER A</text>

          <rect x="420" y="200" width="110" height="75" rx="8" fill={mapTheme === 'early_dawn' ? '#2d4363' : '#b0bec5'} />
          <text x="435" y="240" fill={mapTheme === 'early_dawn' ? '#cbd5e1' : '#334155'} fontSize="10" fontWeight="bold">TOWER B (MAPLE)</text>
          <text x="445" y="255" fill={mapTheme === 'early_dawn' ? '#38bdf8' : '#0284c7'} fontSize="9">FLAT 402 (YOU)</text>

          <rect x="580" y="160" width="90" height="65" rx="6" fill={mapTheme === 'early_dawn' ? '#25354e' : '#cbd5e1'} />
          <text x="600" y="198" fill={mapTheme === 'early_dawn' ? '#94a3b8' : '#475569'} fontSize="10" fontWeight="bold">TOWER C</text>

          {/* Green Glen Villas */}
          <rect x="680" y="70" width="60" height="50" rx="4" fill={mapTheme === 'early_dawn' ? '#25354e' : '#cbd5e1'} />
          <text x="688" y="98" fill={mapTheme === 'early_dawn' ? '#94a3b8' : '#475569'} fontSize="9">VILLAS 1-8</text>

          <rect x="760" y="70" width="65" height="50" rx="4" fill={mapTheme === 'early_dawn' ? '#25354e' : '#cbd5e1'} />
          <text x="768" y="98" fill={mapTheme === 'early_dawn' ? '#94a3b8' : '#475569'} fontSize="9">VILLAS 9-16</text>

          {/* Rekart Distribution Hub */}
          <rect x="60" y="380" width="120" height="70" rx="8" fill={mapTheme === 'early_dawn' ? '#0f402e' : '#a7f3d0'} stroke="#10b981" strokeWidth="1" />
          <text x="72" y="415" fill={mapTheme === 'early_dawn' ? '#6ee7b7' : '#047857'} fontSize="10" fontWeight="bold">REKART CHILLED HUB</text>
          <text x="80" y="430" fill={mapTheme === 'early_dawn' ? '#a7f3d0' : '#065f46'} fontSize="9">Dispatched 05:00 AM</text>
        </g>

        {/* Neighborhood Road Network */}
        <g stroke={mapTheme === 'early_dawn' ? '#334766' : '#cbd5e1'} strokeWidth="18" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.65">
          <path d="M 40,415 L 180,415 L 260,270 L 480,240 L 630,195 L 720,95 L 860,95" />
          <path d="M 260,270 L 260,110 L 440,110 L 480,240" />
          <path d="M 480,240 L 530,390 L 720,390 L 820,240" />
        </g>

        {/* Road inner lane marking */}
        <g stroke={mapTheme === 'early_dawn' ? '#1e293b' : '#ffffff'} strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 40,415 L 180,415 L 260,270 L 480,240 L 630,195 L 720,95 L 860,95" />
          <path d="M 260,270 L 260,110 L 440,110 L 480,240" />
          <path d="M 480,240 L 530,390 L 720,390 L 820,240" />
        </g>

        {/* Dashed Center Route Line */}
        <path
          d={svgPathData}
          stroke="url(#roadGlow)"
          strokeWidth="4"
          fill="none"
          strokeDasharray="8,6"
          className="animate-pulse"
        />
      </svg>

      {/* Stop Waypoint Markers */}
      {stops.map((stop, index) => {
        const pos = projectCoords(stop.latitude, stop.longitude);
        const isCustomer = stop.isCurrentCustomer;
        const isDelivered = stop.status === 'delivered';
        const isTarget = stop.id === currentStop.id;

        return (
          <div
            key={stop.id}
            style={{
              position: 'absolute',
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="z-10 cursor-pointer group"
            onClick={() => {
              setActiveStopModal(stop);
              if (onSelectStop) onSelectStop(stop);
            }}
          >
            {/* Pulsing ring if current target */}
            {isTarget && !isDelivered && (
              <span className="absolute -inset-3 rounded-full bg-amber-400/40 animate-ping pointer-events-none"></span>
            )}
            {isCustomer && (
              <span className="absolute -inset-4 rounded-full bg-cyan-400/30 animate-pulse pointer-events-none"></span>
            )}

            {/* Marker Pin */}
            <div
              className={`relative flex items-center justify-center rounded-xl shadow-lg border-2 transition-all duration-300 transform group-hover:scale-115 ${
                isCustomer
                  ? isDelivered
                    ? 'w-9 h-9 bg-emerald-600 border-emerald-300 text-white ring-4 ring-emerald-500/30'
                    : 'w-10 h-10 bg-cyan-600 border-cyan-200 text-white ring-4 ring-cyan-500/40 animate-bounce'
                  : isDelivered
                  ? 'w-7 h-7 bg-emerald-700/90 border-emerald-400 text-white'
                  : isTarget
                  ? 'w-8 h-8 bg-amber-500 border-white text-slate-950 font-bold'
                  : 'w-6 h-6 bg-slate-800/90 border-slate-500 text-slate-300'
              }`}
            >
              {isDelivered ? (
                <CheckCircle2 className="w-4 h-4 text-white" />
              ) : isCustomer ? (
                <Milk className="w-5 h-5 text-white stroke-[2.5]" />
              ) : (
                <span className="text-xs font-bold">{index + 1}</span>
              )}
            </div>

            {/* Label Tooltip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2 py-0.5 rounded-md bg-slate-950/90 text-white text-[10px] font-semibold whitespace-nowrap shadow-md pointer-events-none flex items-center gap-1 border border-slate-700">
              {isCustomer && <span className="text-cyan-400 font-bold">★ YOU:</span>}
              <span>{stop.flatNumber}</span>
              {isDelivered && <span className="text-emerald-400">✓</span>}
            </div>
          </div>
        );
      })}

      {/* Driver Ramesh Live Moving Marker */}
      <motion.div
        animate={{
          left: `${driverPos.x}%`,
          top: `${driverPos.y}%`,
        }}
        transition={{ type: 'spring', stiffness: 45, damping: 15 }}
        style={{ position: 'absolute', transform: 'translate(-50%, -50%)' }}
        className="z-30 pointer-events-none"
      >
        {/* Radar wave */}
        <span className="absolute -inset-4 rounded-full bg-emerald-500/40 animate-ping"></span>
        <span className="absolute -inset-8 rounded-full bg-emerald-400/15 animate-pulse"></span>

        {/* Scooter Icon Badge */}
        <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-2xl border-2 border-white flex items-center justify-center text-white">
          <Bike className="w-6 h-6 stroke-[2.2] animate-pulse" />
          <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border border-white">
            EV
          </span>
        </div>

        {/* Driver floating tag */}
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-emerald-950/95 text-emerald-200 text-[10px] font-bold whitespace-nowrap border border-emerald-500/50 shadow-lg flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Ramesh Kumar ({driver.vehicleNumber.slice(-4)})</span>
        </div>
      </motion.div>

      {/* Bottom Map Controls & Info Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Customer Stop Status Card */}
        {showDriverFocusNotice && currentCustomerStop && (
          <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 shadow-xl text-white max-w-sm flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                currentCustomerStop.status === 'delivered'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
              }`}
            >
              {currentCustomerStop.status === 'delivered' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <Milk className="w-5 h-5" />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{currentCustomerStop.apartmentName} {currentCustomerStop.flatNumber}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                    currentCustomerStop.status === 'delivered'
                      ? 'bg-emerald-400/20 text-emerald-300'
                      : 'bg-amber-400/20 text-amber-300'
                  }`}
                >
                  {currentCustomerStop.status === 'delivered'
                    ? 'Delivered'
                    : currentCustomerStop.status === 'arriving_soon'
                    ? 'At Gate'
                    : 'On the way'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate">
                {currentCustomerStop.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="pointer-events-auto hidden md:flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-[11px] text-slate-300">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Delivered ({stops.filter((s) => s.status === 'delivered').length})</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>Your Doorstep</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>Active Target</span>
          </div>
        </div>
      </div>

      {/* Stop Detail Modal Popup */}
      <AnimatePresence>
        {activeStopModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-40 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setActiveStopModal(null)}
          >
            <div
              className="bg-white text-slate-900 rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Stop {stops.findIndex((s) => s.id === activeStopModal.id) + 1} of {stops.length}
                    </span>
                    {activeStopModal.isCurrentCustomer && (
                      <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md">
                        Your Order
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {activeStopModal.customerName}
                  </h3>
                  <p className="text-xs text-slate-500">{activeStopModal.address}</p>
                </div>
                <button
                  onClick={() => setActiveStopModal(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
                >
                  ✕
                </button>
              </div>

              {/* Items List */}
              <div className="mt-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Morning Milk &amp; Dairy Items:
                </span>
                <div className="mt-1 space-y-1.5">
                  {activeStopModal.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-100"
                    >
                      <span className="font-medium text-slate-800">{item.productName}</span>
                      <span className="font-bold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded">
                        {item.quantity} x {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Doorstep Instructions */}
              <div className="mt-3 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900">
                <span className="font-bold block">Customer Instruction:</span>
                <p className="text-[11px] mt-0.5">
                  {activeStopModal.specialInstructions || 'Leave safely at doorstep hook.'}
                </p>
                <div className="mt-1 text-[11px] font-semibold text-amber-800 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {activeStopModal.ringBell ? 'Ring Doorbell Once' : 'Quiet Delivery (Do NOT Ring Bell)'}
                </div>
              </div>

              {/* Delivery Status & Proof Photo */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Status
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      activeStopModal.status === 'delivered'
                        ? 'text-emerald-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {activeStopModal.status === 'delivered'
                      ? `Delivered at ${activeStopModal.deliveredAt}`
                      : 'Pending Delivery'}
                  </span>
                </div>

                {activeStopModal.proofPhoto && (
                  <a
                    href={activeStopModal.proofPhoto}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    View Doorstep Proof
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
