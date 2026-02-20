import { diffInDays } from "./date.utils";

/**
 * Calculate the base rental cost.
 * baseCost = numberOfDays × dailyPrice
 */
export function calculateBaseCost(
  pickupDate: Date,
  returnDate: Date,
  dailyPrice: number
): number {
  const days = diffInDays(returnDate, pickupDate);
  return Math.round(days * dailyPrice * 100) / 100;
}

/**
 * Calculate down payment (30% of total).
 */
export function calculateDownPayment(totalPrice: number): number {
  return Math.round(totalPrice * 0.3 * 100) / 100;
}

/**
 * Calculate final payment (70% of total).
 */
export function calculateFinalPayment(totalPrice: number): number {
  return Math.round(totalPrice * 0.7 * 100) / 100;
}

/**
 * Calculate late fee penalty.
 * lateFee = lateDays × (dailyPrice × 1.5)
 */
export function calculateLateFee(
  scheduledReturnDate: Date,
  actualReturnDate: Date,
  dailyPrice: number
): number {
  const lateDays = diffInDays(actualReturnDate, scheduledReturnDate);
  if (lateDays <= 0) return 0;
  return Math.round(lateDays * dailyPrice * 1.5 * 100) / 100;
}
