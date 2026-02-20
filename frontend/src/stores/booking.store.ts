import { create } from "zustand";
import type { Vehicle, PayMethod } from "@/types";

interface BookingState {
  step: number;
  selectedVehicle: Vehicle | null;
  pickupDate: Date | null;
  returnDate: Date | null;
  pickupLocation: string;
  payMethod: PayMethod;
  totalPrice: number;
  downPayment: number;
  finalPayment: number;

  setStep: (step: number) => void;
  selectVehicle: (vehicle: Vehicle) => void;
  setDates: (pickup: Date, returnDate: Date) => void;
  setPickupLocation: (location: string) => void;
  setPayMethod: (method: PayMethod) => void;
  calculatePricing: () => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  step: 1,
  selectedVehicle: null,
  pickupDate: null,
  returnDate: null,
  pickupLocation: "",
  payMethod: "CREDIT_CARD",
  totalPrice: 0,
  downPayment: 0,
  finalPayment: 0,

  setStep: (step) => set({ step }),

  selectVehicle: (vehicle) => {
    set({ selectedVehicle: vehicle, step: 2 });
  },

  setDates: (pickupDate, returnDate) => {
    set({ pickupDate, returnDate });
    get().calculatePricing();
  },

  setPickupLocation: (location) => set({ pickupLocation: location }),

  setPayMethod: (method) => set({ payMethod: method }),

  calculatePricing: () => {
    const { selectedVehicle, pickupDate, returnDate } = get();
    if (!selectedVehicle || !pickupDate || !returnDate) return;

    const msPerDay = 1000 * 60 * 60 * 24;
    const days = Math.max(
      Math.ceil((returnDate.getTime() - pickupDate.getTime()) / msPerDay),
      1
    );
    const total = days * selectedVehicle.dailyPrice;
    const down = Math.round(total * 0.3);
    const final_ = total - down;

    set({ totalPrice: total, downPayment: down, finalPayment: final_ });
  },

  reset: () =>
    set({
      step: 1,
      selectedVehicle: null,
      pickupDate: null,
      returnDate: null,
      pickupLocation: "",
      payMethod: "CREDIT_CARD",
      totalPrice: 0,
      downPayment: 0,
      finalPayment: 0,
    }),
}));
