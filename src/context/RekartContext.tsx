import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  UserRole,
  Product,
  Subscription,
  DeliveryStop,
  DeliveryBoy,
  CustomerProfile,
  WalletTransaction,
  OrderStatus,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMER,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_DRIVER,
  INITIAL_STOPS,
  INITIAL_TRANSACTIONS,
} from '../data/mockData';

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: string;
}

interface RekartContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  products: Product[];
  customer: CustomerProfile;
  subscriptions: Subscription[];
  driver: DeliveryBoy;
  stops: DeliveryStop[];
  transactions: WalletTransaction[];
  notifications: ToastNotification[];
  dismissNotification: (id: string) => void;
  addToast: (title: string, message: string, type?: 'info' | 'success' | 'warning') => void;

  // Subscription management
  addSubscription: (sub: Omit<Subscription, 'id'>) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  toggleSubscriptionPause: (id: string, vacationRange?: { startDate: string; endDate: string }) => void;
  deleteSubscription: (id: string) => void;
  adjustTomorrowQuantity: (id: string, qty: number, note?: string) => void;

  // Driver actions & real-time simulation
  updateStopStatus: (
    stopId: string,
    status: OrderStatus,
    proofPhoto?: string,
    emptyBottles?: number
  ) => void;
  isSimulating: boolean;
  simSpeed: number;
  setSimSpeed: (speed: number) => void;
  toggleSimulation: () => void;
  advanceDriverToNextStep: () => void;
  resetSimulation: () => void;

  // Wallet
  rechargeWallet: (amount: number, bonus?: number) => void;
  updateCustomerDeliveryPrefs: (prefs: Partial<CustomerProfile['address']>) => void;

  // Helpers
  currentCustomerStop: DeliveryStop | undefined;
  stopsRemainingForCustomer: number;
  estimatedEtaMinutes: number;
  activeCustomerTab: string;
  setActiveCustomerTab: (tab: string) => void;
  activeDriverTab: string;
  setActiveDriverTab: (tab: string) => void;
}

const RekartContext = createContext<RekartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'rekart_app_state_v1';

export const RekartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('customer');
  const [activeCustomerTab, setActiveCustomerTab] = useState<string>('overview');
  const [activeDriverTab, setActiveDriverTab] = useState<string>('manifest');

  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [customer, setCustomer] = useState<CustomerProfile>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_cust`);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMER;
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_subs`);
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
  });

  const [driver, setDriver] = useState<DeliveryBoy>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_driver`);
    return saved ? JSON.parse(saved) : INITIAL_DRIVER;
  });

  const [stops, setStops] = useState<DeliveryStop[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_stops`);
    return saved ? JSON.parse(saved) : INITIAL_STOPS;
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_tx`);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(1);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_cust`, JSON.stringify(customer));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_subs`, JSON.stringify(subscriptions));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_driver`, JSON.stringify(driver));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_stops`, JSON.stringify(stops));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_tx`, JSON.stringify(transactions));
  }, [customer, subscriptions, driver, stops, transactions]);

  const addToast = useCallback(
    (title: string, message: string, type: 'info' | 'success' | 'warning' = 'info') => {
      const newToast: ToastNotification = {
        id: 'toast-' + Date.now() + Math.random().toString(36).substr(2, 4),
        title,
        message,
        type,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setNotifications((prev) => [newToast, ...prev.slice(0, 4)]);
    },
    []
  );

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Subscriptions management
  const addSubscription = useCallback(
    (sub: Omit<Subscription, 'id'>) => {
      const newSub: Subscription = {
        ...sub,
        id: 'sub-' + Date.now(),
      };
      setSubscriptions((prev) => [...prev, newSub]);
      addToast('Subscription Activated', `Scheduled daily morning delivery!`, 'success');
    },
    [addToast]
  );

  const updateSubscription = useCallback((id: string, updates: Partial<Subscription>) => {
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, ...updates } : sub))
    );
  }, []);

  const toggleSubscriptionPause = useCallback(
    (id: string, vacationRange?: { startDate: string; endDate: string }) => {
      setSubscriptions((prev) =>
        prev.map((sub) => {
          if (sub.id !== id) return sub;
          const willBePaused = sub.status === 'active';
          return {
            ...sub,
            status: willBePaused ? 'paused' : 'active',
            vacationPause: willBePaused ? vacationRange : undefined,
          };
        })
      );
      addToast('Subscription Updated', 'Vacation schedule saved successfully.', 'info');
    },
    [addToast]
  );

  const deleteSubscription = useCallback(
    (id: string) => {
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
      addToast('Subscription Cancelled', 'Item removed from daily morning delivery.', 'warning');
    },
    [addToast]
  );

  const adjustTomorrowQuantity = useCallback(
    (id: string, qty: number, note?: string) => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      setSubscriptions((prev) =>
        prev.map((sub) => {
          if (sub.id !== id) return sub;
          return {
            ...sub,
            tomorrowAdjustment: {
              date: tomorrowStr,
              adjustedQuantity: qty,
              note: note || '',
            },
          };
        })
      );
      addToast(
        "Tomorrow's Delivery Updated",
        `Next morning quantity set to ${qty} ${qty === 0 ? '(Skipped)' : 'units'}.`,
        'success'
      );
    },
    [addToast]
  );

  // Driver actions
  const updateStopStatus = useCallback(
    (stopId: string, status: OrderStatus, proofPhoto?: string, emptyBottles?: number) => {
      setStops((prev) =>
        prev.map((s) => {
          if (s.id !== stopId) return s;
          const updated: DeliveryStop = {
            ...s,
            status,
            deliveredAt:
              status === 'delivered'
                ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : s.deliveredAt,
            proofPhoto: proofPhoto || s.proofPhoto,
            emptyBottlesCollected:
              emptyBottles !== undefined ? emptyBottles : s.emptyBottlesCollected,
          };
          return updated;
        })
      );

      const targetStop = stops.find((s) => s.id === stopId);
      if (targetStop) {
        if (targetStop.isCurrentCustomer && status === 'delivered') {
          addToast(
            '🥛 Morning Milk Delivered!',
            `Ramesh Kumar dropped off your milk bag at ${targetStop.apartmentName} ${targetStop.flatNumber}. Enjoy farm fresh breakfast!`,
            'success'
          );

          // Deduct order cost from customer wallet
          const totalCost = targetStop.items.reduce((acc, item) => {
            const prod = products.find((p) => p.id === item.productId);
            return acc + (prod ? prod.price * item.quantity : 80 * item.quantity);
          }, 0);

          setCustomer((prev) => ({
            ...prev,
            walletBalance: Math.max(0, prev.walletBalance - totalCost),
            emptyBottlesWithCustomer: Math.max(
              0,
              prev.emptyBottlesWithCustomer - (emptyBottles || 0)
            ),
          }));

          setTransactions((prev) => [
            {
              id: 'tx-' + Date.now(),
              date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              amount: totalCost,
              type: 'debit',
              description: `Morning Delivery ORD-${targetStop.orderId.replace('ORD-', '')}: ${targetStop.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}`,
              balanceAfter: Math.max(0, customer.walletBalance - totalCost),
              orderRef: targetStop.orderId,
            },
            ...prev,
          ]);
        } else if (targetStop.isCurrentCustomer && status === 'arriving_soon') {
          addToast(
            '🛵 Delivery Partner Arriving',
            `Ramesh is entering ${targetStop.apartmentName}. Estimated arrival in 2 minutes!`,
            'info'
          );
        }
      }
    },
    [stops, products, customer.walletBalance, addToast]
  );

  // Simulation step calculation
  const advanceDriverToNextStep = useCallback(() => {
    // Find first non-delivered stop
    const pendingIndex = stops.findIndex((s) => s.status !== 'delivered');
    if (pendingIndex === -1) {
      addToast('Morning Shift Complete', 'All 6 doorstep stops completed successfully!', 'success');
      setIsSimulating(false);
      return;
    }

    const currentPending = stops[pendingIndex];
    if (currentPending.status === 'placed') {
      updateStopStatus(currentPending.id, 'out_for_delivery');
      setDriver((d) => ({
        ...d,
        currentLat: currentPending.latitude - 0.0008,
        currentLng: currentPending.longitude - 0.0008,
      }));
    } else if (currentPending.status === 'out_for_delivery') {
      updateStopStatus(currentPending.id, 'arriving_soon');
      setDriver((d) => ({
        ...d,
        currentLat: currentPending.latitude - 0.0002,
        currentLng: currentPending.longitude - 0.0002,
      }));
    } else if (currentPending.status === 'arriving_soon') {
      updateStopStatus(
        currentPending.id,
        'delivered',
        'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=600&q=80',
        currentPending.items.some((i) => i.productId.includes('glass') || i.productId.includes('1l'))
          ? 1
          : 0
      );
      setDriver((d) => ({
        ...d,
        currentLat: currentPending.latitude,
        currentLng: currentPending.longitude,
        totalDeliveriesCompleted: d.totalDeliveriesCompleted + 1,
      }));
    }
  }, [stops, updateStopStatus, addToast]);

  // Simulation timer loop
  useEffect(() => {
    if (!isSimulating) return;
    const intervalMs = Math.max(1200, Math.floor(4000 / simSpeed));
    const timer = setInterval(() => {
      advanceDriverToNextStep();
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isSimulating, simSpeed, advanceDriverToNextStep]);

  const toggleSimulation = useCallback(() => {
    setIsSimulating((prev) => !prev);
  }, []);

  const resetSimulation = useCallback(() => {
    setIsSimulating(false);
    setStops(INITIAL_STOPS);
    setDriver(INITIAL_DRIVER);
    setCustomer(INITIAL_CUSTOMER);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setTransactions(INITIAL_TRANSACTIONS);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_cust`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_subs`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_driver`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_stops`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_tx`);
    addToast('Demo State Reset', 'Restored original early morning delivery run.', 'info');
  }, [addToast]);

  const rechargeWallet = useCallback(
    (amount: number, bonus: number = 0) => {
      const totalCredit = amount + bonus;
      setCustomer((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance + totalCredit,
      }));
      setTransactions((prev) => [
        {
          id: 'tx-' + Date.now(),
          date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          amount: totalCredit,
          type: 'credit',
          description: `Instant Wallet Top-Up${bonus > 0 ? ` (+₹${bonus} Bonus Added)` : ''}`,
          balanceAfter: customer.walletBalance + totalCredit,
        },
        ...prev,
      ]);
      addToast(
        'Wallet Recharged',
        `₹${totalCredit} added to Rekart Prepaid Milk Pass!`,
        'success'
      );
    },
    [customer.walletBalance, addToast]
  );

  const updateCustomerDeliveryPrefs = useCallback(
    (prefs: Partial<CustomerProfile['address']>) => {
      setCustomer((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          ...prefs,
        },
      }));
      // Also update stop 4 if present
      setStops((prev) =>
        prev.map((s) => {
          if (!s.isCurrentCustomer) return s;
          return {
            ...s,
            ringBell: prefs.ringBell !== undefined ? prefs.ringBell : s.ringBell,
            specialInstructions:
              prefs.bagLocation !== undefined
                ? `Bag at ${prefs.bagLocation}`
                : s.specialInstructions,
          };
        })
      );
      addToast('Preferences Saved', 'Doorstep instructions updated for tomorrow.', 'success');
    },
    [addToast]
  );

  const currentCustomerStop = useMemo(
    () => stops.find((s) => s.isCurrentCustomer),
    [stops]
  );

  // Calculate stops remaining and ETA
  const { stopsRemainingForCustomer, estimatedEtaMinutes } = useMemo(() => {
    if (!currentCustomerStop) return { stopsRemainingForCustomer: 0, estimatedEtaMinutes: 0 };
    if (currentCustomerStop.status === 'delivered')
      return { stopsRemainingForCustomer: 0, estimatedEtaMinutes: 0 };

    const customerIndex = stops.findIndex((s) => s.id === currentCustomerStop.id);
    let pendingBefore = 0;
    for (let i = 0; i < customerIndex; i++) {
      if (stops[i].status !== 'delivered') pendingBefore++;
    }

    if (currentCustomerStop.status === 'arriving_soon') {
      return { stopsRemainingForCustomer: 0, estimatedEtaMinutes: 2 };
    }
    if (currentCustomerStop.status === 'out_for_delivery') {
      return {
        stopsRemainingForCustomer: pendingBefore,
        estimatedEtaMinutes: Math.max(3, pendingBefore * 4 + 3),
      };
    }
    return {
      stopsRemainingForCustomer: pendingBefore + 1,
      estimatedEtaMinutes: Math.max(10, (pendingBefore + 1) * 5),
    };
  }, [stops, currentCustomerStop]);

  return (
    <RekartContext.Provider
      value={{
        role,
        setRole,
        products,
        customer,
        subscriptions,
        driver,
        stops,
        transactions,
        notifications,
        dismissNotification,
        addToast,
        addSubscription,
        updateSubscription,
        toggleSubscriptionPause,
        deleteSubscription,
        adjustTomorrowQuantity,
        updateStopStatus,
        isSimulating,
        simSpeed,
        setSimSpeed,
        toggleSimulation,
        advanceDriverToNextStep,
        resetSimulation,
        rechargeWallet,
        updateCustomerDeliveryPrefs,
        currentCustomerStop,
        stopsRemainingForCustomer,
        estimatedEtaMinutes,
        activeCustomerTab,
        setActiveCustomerTab,
        activeDriverTab,
        setActiveDriverTab,
      }}
    >
      {children}
    </RekartContext.Provider>
  );
};

export const useRekart = () => {
  const context = useContext(RekartContext);
  if (!context) {
    throw new Error('useRekart must be used within a RekartProvider');
  }
  return context;
};
