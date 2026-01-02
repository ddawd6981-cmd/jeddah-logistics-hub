
export enum ShipmentStatus {
  PENDING = 'قيد الانتظار',
  RECEIVED = 'تم الاستلام في المستودع',
  ASSIGNED = 'تم التعيين للسائق',
  PICKED_UP = 'استلمها المندوب',
  OUT_FOR_DELIVERY = 'في الطريق للتوصيل',
  DELIVERED = 'تم التسليم بنجاح',
  FAILED = 'تعذر التسليم',
  POSTPONED = 'تم تأجيل التسليم',
  CANCELLED = 'ملغي',
  RETURNED = 'مرتجع للتاجر'
}

export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'ACCOUNTANT' | 'DRIVER';

export interface AppPermissions {
  canManageFleet: boolean;
  canManageShipments: boolean;
  canViewFinancials: boolean;
  canEditSettings: boolean;
  canManageUsers: boolean;
  canDeleteData: boolean;
  canExportReports: boolean;
}

export interface ContactAttempt {
  time: string;
  note: string;
}

export interface DeliveryDetails {
  podImage?: string;
  signature?: string;
  contactAttempts: ContactAttempt[];
  failedReason?: string;
  completedAt?: string;
  cashCollected?: number;
}

export interface Shipment {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  district: string;
  city: string;
  storeSource: 'Salla' | 'Zid' | 'Manual';
  status: ShipmentStatus;
  createdAt: string;
  assignedTruckId?: string;
  weight: number;
  codAmount: number;
  paymentMethod: 'COD' | 'Prepaid';
  sku?: string;
  priority: 'High' | 'Medium' | 'Low';
  notes?: string;
  deliveryDetails?: DeliveryDetails;
}

export interface Truck {
  id: string;
  plateNumber: string;
  driverName: string;
  driverPhone: string;
  username: string;
  password?: string;
  assignedDistrict: string;
  capacity: number;
  currentLoad: number;
  totalCodCollected: number;
  status: 'Active' | 'Maintenance' | 'Offline' | 'Full' | 'Suspended';
  role: UserRole;
  permissions: AppPermissions;
  location: {
    lat: number;
    lng: number;
  };
  efficiencyScore: number;
}

export interface Stats {
  totalShipments: number;
  deliveredToday: number;
  pendingAssignment: number;
  activeTrucks: number;
  avgDeliveryTime: string;
  totalCodToCollect: number;
}
