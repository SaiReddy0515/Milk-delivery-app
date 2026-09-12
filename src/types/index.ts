export type UserRole = 'customer' | 'driver';

export type DeliveryFrequency = 'daily' | 'alternate' | 'weekdays' | 'weekends' | 'custom';

export type DeliverySlot = 'early_morning' | 'morning'; // early: 5:00 - 6:30 AM, morning: 6:30 - 7:30 AM

export interface Product {
  id: string;
  name: string;
  category: 'milk' | 'curd_paneer' | 'ghee_butter' | 'bakery_staples';
  unit: string; // e.g. '500 ml', '1 L', '200 g'
  price: number;
  originalPrice?: number;
  fatContent?: string;
  source: string; // e.g. 'Grass-Fed Gir Cow', 'Murrah Buffalo'
  image: string;
  description: string;
  glassBottleAvailable?: boolean;
  isPopular?: boolean;
  stockStatus: 'in_stock' | 'low_stock';
}

export interface Subscription {
  id: string;
  productId: string;
  quantity: number; // e.g. 2 packets / bottles
  frequency: DeliveryFrequency;
  customDays?: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  startDate: string;
  endDate?: string;
  status: 'active' | 'paused' | 'cancelled';
  slot: DeliverySlot;
  ringBell: boolean;
  bottleDropInBag: boolean;
  vacationPause?: {
    startDate: string;
    endDate: string;
    reason?: string;
  };
  tomorrowAdjustment?: {
    date: string; // YYYY-MM-DD
    adjustedQuantity: number; // 0 means skip tomorrow, >0 means override
    note?: string;
  };
}

export type OrderStatus = 'placed' | 'packed' | 'out_for_delivery' | 'arriving_soon' | 'delivered';

export interface DeliveryStop {
  id: string;
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  apartmentName: string;
  wing: string;
  flatNumber: string;
  floor: number;
  latitude: number;
  longitude: number;
  items: {
    productId: string;
    productName: string;
    unit: string;
    quantity: number;
  }[];
  slot: DeliverySlot;
  specialInstructions?: string;
  ringBell: boolean;
  status: OrderStatus;
  deliveredAt?: string;
  proofPhoto?: string;
  emptyBottlesCollected?: number;
  isCurrentCustomer?: boolean;
}

export interface DeliveryBoy {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  vehicleType: string;
  vehicleNumber: string;
  rating: number;
  totalDeliveriesCompleted: number;
  currentLat: number;
  currentLng: number;
  shiftStartTime: string;
  routeSector: string;
  isOnline: boolean;
}

export interface WalletTransaction {
  id: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  balanceAfter: number;
  orderRef?: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: {
    society: string;
    tower: string;
    flat: string;
    area: string;
    city: string;
    pincode: string;
    ringBell: boolean;
    dropAtBag: boolean;
    bagLocation: string;
  };
  walletBalance: number;
  emptyBottlesWithCustomer: number;
}
