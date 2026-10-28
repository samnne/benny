import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Navbar from "@/components/Navigation/Navbar";
import { styled } from "nativewind";
import { SafeAreaView as RNSAV } from "react-native-safe-area-context";

import { Period, useReceiptAnalytics } from "@/hooks/useReceiptAnalytics";
import { useReceipt } from "@/store/zustand";

const SafeAreaView = styled(RNSAV);
const SView = styled(View);
const SText = styled(Text);

const money = (n: number) => `$${n.toFixed(2)}`;

const PERIODS: { key: Period; label: string }[] = [
  { key: "pay", label: "Pay period" },
  { key: "30d", label: "30 days" },
  { key: "all", label: "All time" },
];

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <SView className="bg-white  rounded-2xl p-4 mb-4">
      <SText className="text-base font-fredoka-semibold text-text  mb-3">
        {title}
      </SText>
      {children}
    </SView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <SView className="flex-1 bg-white  rounded-2xl p-4">
      <SText className="text-xs font-nunito text-text/60 ">
        {label}
      </SText>
      <SText className="text-xl font-fredoka-bold text-primary mt-1">
        {value}
      </SText>
    </SView>
  );
}

const analytics = () => {
  const [period, setPeriod] = useState<Period>("pay");
  const getReceipts = useReceipt((s) => s.getReceipts);
  const a = useReceiptAnalytics(period);

  useEffect(() => {
    getReceipts();
  }, []);

  const maxDaily = Math.max(...a.daily.map((d) => d.total), 1);
  const maxMerchant = Math.max(...a.topMerchants.map((m) => m.total), 1);
  const over = a.budgetUsed > 1;

  return (
    <SafeAreaView
      className="flex-1 bg-white "
      style={{ paddingTop: 16 }}
    >
      <Navbar />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Period selector */}
        <SView className="flex-row bg-pill  rounded-full p-1 mb-4">
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p.key}
              onPress={() => setPeriod(p.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: period === p.key }}
              className={`flex-1 py-2 rounded-full items-center ${
                period === p.key ? "bg-primary " : ""
              }`}
            >
              <SText
                className={`text-sm ${
                  period === p.key
                    ? "font-fredoka-semibold text-white "
                    : "font-nunito-semibold text-text/60 /60"
                }`}
              >
                {p.label}
              </SText>
            </TouchableOpacity>
          ))}
        </SView>

        {/* Headline numbers */}
        <SView className="flex-row gap-3 mb-3">
          <Stat label="Total spent" value={money(a.spent)} />
          <Stat label="Receipts" value={String(a.count)} />
        </SView>
        <SView className="flex-row gap-3 mb-4">
          <Stat label="Avg per receipt" value={money(a.average)} />
          <Stat label="Saved via discounts" value={money(a.saved)} />
        </SView>

        {/* Budget progress (only meaningful for the pay period) */}
        {period === "pay" && (
          <Card title="Budget">
            <SView className="h-3 bg-pill  rounded-full overflow-hidden">
              <SView
                className={`h-3 rounded-full ${
                  over
                    ? "bg-primary "
                    : "bg-accent "
                }`}
                style={{ width: `${Math.min(a.budgetUsed, 1) * 100}%` }}
              />
            </SView>
            <SText className="text-sm font-nunito text-text/70  mt-2">
              {money(a.spent)} of {money(a.budget)}
              {over
                ? ` (${money(a.spent - a.budget)} over)`
                : ` (${money(a.budget - a.spent)} left)`}
            </SText>
          </Card>
        )}

        {/* Last 7 days */}
        <Card title="Last 7 days">
          <SView className="flex-row items-end justify-between h-32">
            {a.daily.map((d, i) => (
              <SView key={i} className="items-center flex-1">
                <SView
                  className="w-5 bg-primary  rounded-t-md"
                  style={{ height: Math.max((d.total / maxDaily) * 100, 2) }}
                />
                <SText className="text-xs font-nunito text-text/60 /60 mt-1">
                  {d.label}
                </SText>
              </SView>
            ))}
          </SView>
        </Card>

        {/* Top merchants */}
        <Card title="Top merchants">
          {a.topMerchants.length === 0 && (
            <SText className="text-sm font-nunito text-text/60 /60">
              No receipts yet.
            </SText>
          )}
          {a.topMerchants.map((m) => (
            <SView key={m.name} className="mb-3">
              <SView className="flex-row justify-between mb-1">
                <SText className="text-sm font-nunito-semibold text-text ">
                  {m.name}
                </SText>
                <SText className="text-sm font-nunito text-text/70 /70">
                  {money(m.total)} · {m.visits} visit{m.visits === 1 ? "" : "s"}
                </SText>
              </SView>
              <SView className="h-2 bg-pill  rounded-full overflow-hidden">
                <SView
                  className="h-2 bg-secondary  rounded-full"
                  style={{ width: `${(m.total / maxMerchant) * 100}%` }}
                />
              </SView>
            </SView>
          ))}
        </Card>

        {/* Top items */}
        <Card title="Biggest spends by item">
          {a.topItems.length === 0 && (
            <SText className="text-sm font-nunito text-text/60 /60">
              No items yet.
            </SText>
          )}
          {a.topItems.map((it) => (
            <SView key={it.name} className="flex-row justify-between py-1.5">
              <SText className="text-sm font-nunito text-text  capitalize flex-1 pr-2">
                {it.name}
              </SText>
              <SText className="text-sm font-nunito-semibold text-text/70 /70">
                {money(it.total)} · x{it.count}
              </SText>
            </SView>
          ))}
        </Card>

        <SText className="text-xs font-nunito text-text/40 /40 text-center">
          Tax paid in this range: {money(a.tax)}
        </SText>
      </ScrollView>
    </SafeAreaView>
  );
};

export default analytics;