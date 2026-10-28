import { usePreferences, useReceipt } from "@/store/zustand";
import { useMemo } from "react";

export type Period = "pay" | "30d" | "all";

const PERIOD_DAYS = {
    weekly: 7,
    biweekly: 14,
    semimonthly: 15,
    monthly: 30,
} as const;

const DAY_MS = 86_400_000;

function receiptTotal(r: Receipt): number {
    if (typeof (r as any).total === "number") return (r as any).total;
    const items = (r.items ?? []).reduce(
        (acc: number, it: any) => acc + (it.total_price || 0),
        0,
    );
    return items + (r.tax ?? 0) - (r.discounts ?? 0);
}

function receiptDate(r: Receipt): Date | null {
    const raw = (r as any).date ?? (r as any).createdAt;
    const d = raw ? new Date(raw) : null;
    return d && !isNaN(d.getTime()) ? d : null;
}

export function useReceiptAnalytics(period: Period) {
    const receipts = useReceipt().receipts;
    const { payFrequency, nextPayday, budgetPerPeriod } = usePreferences();

    return useMemo(() => {
        const now = new Date();
        const periodDays = PERIOD_DAYS[payFrequency];

        // Work out the start of the window
        let start: Date | null = null;
        if (period === "30d") {
            start = new Date(now.getTime() - 30 * DAY_MS);
        } else if (period === "pay") {
            const next = nextPayday ? new Date(nextPayday) : null;
            start =
                next && !isNaN(next.getTime())
                    ? new Date(next.getTime() - periodDays * DAY_MS)
                    : new Date(now.getTime() - periodDays * DAY_MS);
        }

        const inRange = receipts.filter((r) => {
            if (!start) return true;
            const d = receiptDate(r);
            return d ? d >= start : false;
        });

        let spent = 0;
        let tax = 0;
        let saved = 0;
        const merchants = new Map<string, { total: number; visits: number }>();
        const items = new Map<string, { total: number; count: number }>();

        for (const r of inRange) {
            const total = receiptTotal(r);
            spent += total;
            tax += r.tax ?? 0;
            saved += r.discounts ?? 0;

            const name = r.merchant?.name?.trim() || "Unknown";
            const m = merchants.get(name) ?? { total: 0, visits: 0 };
            m.total += total;
            m.visits += 1;
            merchants.set(name, m);

            for (const it of (r.items ?? []) as any[]) {
                const key = (it.name ?? "Unknown").trim().toLowerCase();
                const agg = items.get(key) ?? { total: 0, count: 0 };
                agg.total += it.total_price || 0;
                agg.count += it.quantity ?? 1;
                items.set(key, agg);
            }
        }

        // Last 7 days, oldest to newest, for the bar chart
        const daily = Array.from({ length: 7 }, (_, i) => {
            const day = new Date(now.getTime() - (6 - i) * DAY_MS);
            const total = receipts.reduce((acc, r) => {
                const d = receiptDate(r);
                return d && d.toDateString() === day.toDateString()
                    ? acc + receiptTotal(r)
                    : acc;
            }, 0);
            return {
                label: day.toLocaleDateString(undefined, { weekday: "short" }),
                total,
            };
        });

        const topMerchants = [...merchants.entries()]
            .map(([name, v]) => ({ name, ...v }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);

        const topItems = [...items.entries()]
            .map(([name, v]) => ({ name, ...v }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);

        return {
            count: inRange.length,
            spent: +spent.toFixed(2),
            average: inRange.length ? +(spent / inRange.length).toFixed(2) : 0,
            tax: +tax.toFixed(2),
            saved: +saved.toFixed(2),
            budget: budgetPerPeriod,
            budgetUsed: budgetPerPeriod > 0 ? spent / budgetPerPeriod : 0,
            topMerchants,
            topItems,
            daily,
        };
    }, [receipts, period, payFrequency, nextPayday, budgetPerPeriod]);
}