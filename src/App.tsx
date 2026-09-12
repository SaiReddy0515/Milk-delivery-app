/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RekartProvider, useRekart } from './context/RekartContext';
import { Header } from './components/common/Header';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { LiveTrackingView } from './components/customer/LiveTrackingView';
import { SubscriptionManager } from './components/customer/SubscriptionManager';
import { ProductCatalog } from './components/customer/ProductCatalog';
import { WalletBilling } from './components/customer/WalletBilling';
import { DriverPortal } from './components/driver/DriverPortal';
import { NotificationsToast } from './components/common/NotificationsToast';
import { Milk, ShieldCheck, ThermometerSnowflake, Recycle, HeartHandshake } from 'lucide-react';

const AppContent: React.FC = () => {
  const { role, activeCustomerTab } = useRekart();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {role === 'customer' ? (
          <div>
            {activeCustomerTab === 'overview' && <CustomerDashboard />}
            {activeCustomerTab === 'tracking' && <LiveTrackingView />}
            {activeCustomerTab === 'subscriptions' && <SubscriptionManager />}
            {activeCustomerTab === 'catalog' && <ProductCatalog />}
            {activeCustomerTab === 'wallet' && <WalletBilling />}
          </div>
        ) : (
          <div>
            <DriverPortal />
          </div>
        )}
      </main>

      {/* Subtle Footer */}
      <footer className="bg-white border-t border-slate-200/80 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
              <Milk className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800 font-serif">Rekart Daily</span> • Local Neighborhood Morning Milk Run
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Raw Milk Purity Tested
            </span>
            <span className="flex items-center gap-1">
              <ThermometerSnowflake className="w-3.5 h-3.5 text-cyan-600" />
              Chilled to 4°C
            </span>
            <span className="flex items-center gap-1">
              <Recycle className="w-3.5 h-3.5 text-emerald-600" />
              Zero-Waste Glass Bottle Cycle
            </span>
            <span className="flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
              Fair Price to Local Dairy Farmers
            </span>
          </div>
        </div>
      </footer>

      <NotificationsToast />
    </div>
  );
};

export default function App() {
  return (
    <RekartProvider>
      <AppContent />
    </RekartProvider>
  );
}
