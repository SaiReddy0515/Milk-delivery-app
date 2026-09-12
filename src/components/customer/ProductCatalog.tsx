import React, { useState } from 'react';
import { useRekart } from '../../context/RekartContext';
import { Product } from '../../types';
import {
  Milk,
  Sparkles,
  ShieldCheck,
  Plus,
  ShoppingBag,
  Calendar,
  Check,
  Filter,
  ThermometerSnowflake,
  Recycle,
} from 'lucide-react';

export const ProductCatalog: React.FC = () => {
  const { products, addSubscription, addToast, setActiveCustomerTab } = useRekart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Farm Products' },
    { id: 'milk', label: 'Fresh Milk & Bottles' },
    { id: 'curd_paneer', label: 'Curd & Paneer' },
    { id: 'ghee_butter', label: 'Desi Ghee & Chaas' },
    { id: 'bakery_staples', label: 'Bakery & Farm Eggs' },
  ];

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleInstantAddToTomorrow = (product: Product) => {
    setQuickAddedId(product.id);
    addToast(
      "Added to Tomorrow's Bag!",
      `1x ${product.name} scheduled for tomorrow morning delivery.`,
      'success'
    );
    setTimeout(() => setQuickAddedId(null), 2500);
  };

  const handleStartSubscription = (product: Product) => {
    addSubscription({
      productId: product.id,
      quantity: 1,
      frequency: 'daily',
      startDate: new Date().toISOString().split('T')[0],
      status: 'active',
      slot: 'early_morning',
      ringBell: false,
      bottleDropInBag: true,
    });
    setActiveCustomerTab('subscriptions');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
              100% Pure &amp; Lab-Tested Dairy
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 font-serif">
            Farm-Fresh Dairy Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Milked at 4:00 AM, pasteurized &amp; chilled to 4°C, delivered to your door before sunrise.
          </p>
        </div>

        {/* Quality Badges */}
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200/60 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            No Adulteration
          </span>
          <span className="flex items-center gap-1 bg-cyan-50 text-cyan-800 px-3 py-1.5 rounded-xl border border-cyan-200/60 font-semibold">
            <Recycle className="w-4 h-4 text-cyan-600" />
            Glass Bottle Hygiene
          </span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === c.id
                ? 'bg-emerald-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Product Image & Badges */}
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {product.isPopular && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      Best Seller
                    </span>
                  )}
                  {product.glassBottleAvailable && (
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-900/90 text-cyan-200 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs flex items-center gap-1 shadow-sm">
                      <Milk className="w-3 h-3" /> Glass Bottle
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-mono font-bold">
                  ₹{product.price} / {product.unit}
                </div>
              </div>

              {/* Product Details */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {product.name}
                  </h3>
                </div>

                {product.fatContent && (
                  <div className="mt-1 inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {product.fatContent}
                  </div>
                )}

                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Source: {product.source}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-5 pt-0 border-t border-slate-100 mt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => handleInstantAddToTomorrow(product)}
                className="py-2.5 px-3 rounded-xl border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                {quickAddedId === product.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Add Tomorrow</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleStartSubscription(product)}
                className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Subscribe Daily</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
