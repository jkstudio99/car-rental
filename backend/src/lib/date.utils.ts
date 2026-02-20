/**
 * Calculate the number of days between two dates.
 * Returns a positive integer representing full rental days.
 */
export function diffInDays(endDate: Date, startDate: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / msPerDay
  );
  return Math.max(diff, 1);
}

/**
 * Check if two date ranges overlap.
 * Range A: [startA, endA], Range B: [startB, endB]
 */
export function dateRangesOverlap(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date
): boolean {
  return startA < endB && endA > startB;
}
