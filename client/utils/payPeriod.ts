export type PayFrequency = "weekly" | "biweekly" | "semimonthly" | "monthly";

export const DAY_MS = 86_400_000;

export const PAY_PERIOD_DAYS: Record<PayFrequency, number> = {
  weekly: 7,
  biweekly: 14,
  semimonthly: 15,
  monthly: 30,
};

/**
 * Parses a receipt/paycheck date. Date-only strings are treated as local
 * midnight so they compare correctly with the local pay period window.
 */
export const parseLocalDate = (
  value: string | null | undefined,
): Date | null => {
  if (!value) return null;

  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

export const getPayPeriodStart = (
  nextPayday: string | null,
  payFrequency: PayFrequency,
  now = new Date(),
): Date => {
  const periodDays = PAY_PERIOD_DAYS[payFrequency] ?? PAY_PERIOD_DAYS.biweekly;
  const next = parseLocalDate(nextPayday);

  return next
    ? new Date(next.getTime() - periodDays * DAY_MS)
    : new Date(now.getTime() - periodDays * DAY_MS);
};

export const isInPayPeriod = (
  date: string | null | undefined,
  start: Date,
): boolean => {
  const parsed = parseLocalDate(date);
  return parsed ? parsed >= start : false;
};

export const filterReceiptsForPayPeriod = <
  T extends { date: string | null },
>(
  receipts: T[],
  nextPayday: string | null,
  payFrequency: PayFrequency,
  now = new Date(),
): T[] => {
  const start = getPayPeriodStart(nextPayday, payFrequency, now);
  return receipts.filter((receipt) => isInPayPeriod(receipt.date, start));
};
