export type EmployeeRole = "ADMIN" | "STAFF";
export type VehicleCategory = "SEDAN" | "SUV" | "VAN";
export type VehicleStatus = "AVAILABLE" | "RENTED" | "MAINTENANCE";
export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type PayMethod = "PROMPTPAY" | "CREDIT_CARD";
export type PaymentStatus = "PENDING" | "PAID" | "REFUNDED";

export interface Vehicle {
  id: string;
  plateNo: string;
  brand: string;
  model: string;
  category: VehicleCategory;
  dailyPrice: number;
  imageUrl: string | null;
  status: VehicleStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  drivingLicense: string;
  addressText: string | null;
  createdAt: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: EmployeeRole;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  reservationId: string;
  payMethod: PayMethod;
  downPayment: number;
  finalPayment: number;
  lateFeePenalty: number;
  damageFee: number;
  refundAmount: number;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  customerId: string;
  vehicleId: string;
  approvedById: string | null;
  reserveDate: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  status: ReservationStatus;
  totalCalculatedPrice: number;
  createdAt: string;
  updatedAt: string;
  customer?: Pick<Customer, "id" | "firstName" | "lastName" | "email" | "phone">;
  vehicle?: Vehicle;
  approvedBy?: Pick<Employee, "id" | "firstName" | "lastName"> | null;
  paymentRecord?: PaymentRecord | null;
}

export interface DashboardData {
  fleet: {
    total: number;
    available: number;
    rented: number;
    maintenance: number;
  };
  reservations: {
    total: number;
    pending: number;
  };
  todayRevenue: number;
  revenueHistory: { amount: number; date: string }[];
}

export interface UpcomingAction {
  id: string;
  customerName: string;
  vehiclePlate: string;
  vehicleName: string;
  actionType: "PICKUP" | "RETURN";
  scheduledTime: string;
  status: string;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
