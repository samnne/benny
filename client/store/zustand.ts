import { BASE_URL, requestHeader } from "@/constants/constants";
import { create } from "zustand";

type TripState = {
  total: number;
  items: ReceiptItem[];
  updateTotal: (items: ReceiptItem[]) => void;
  addItem: (item: ReceiptItem) => void;
  setItems: (item: ReceiptItem[]) => void;
  setTotal: (total: number) => void;
  removeItem: (item: ReceiptItem) => void;
  updateItem: (updatedItem: ReceiptItem) => void;
  reset: () => void;
};

function calcTotal(items: ReceiptItem[]): number {
  const receipt = useReceipt.getState().serverReceipt;
  const itemsSum = items.reduce((acc, cur) => acc + (cur.total_price || 0), 0);
  const tax = receipt?.tax ?? 0;
  const discounts = receipt?.discounts ?? 0; // discounts are positive numbers that reduce total
  return +(itemsSum + tax - discounts)?.toFixed(2);
}

export const useAuth = create<{
  token: string;
  setToken: (token: string) => void;
}>((set, get) => ({
  token: "",
  setToken: (token: string) => set({ token: token }),
}));
export const useTrip = create<TripState>((set, get) => ({
  total: 0,
  items: [],

  updateTotal: (items) => {
    set({ total: calcTotal(items) });
  },

  addItem: (item) => {
    const newItems = [...get().items, item];
    set({ items: newItems, total: calcTotal(newItems) });
  },

  updateItem: (updatedItem) => {
    const newItems = get().items.map((it) =>
      it.id === updatedItem.id ? updatedItem : it,
    );
    set({ items: newItems, total: calcTotal(newItems) });
  },

  removeItem: (item) => {
    const newItems = get().items.filter((it) => it.id !== item.id);
    set({ items: newItems, total: calcTotal(newItems) });
  },

  setItems: (items) => set({ items }),
  setTotal: (total) => set({ total }),
  reset: () => set({ items: [], total: 0 }),
}));

type BudgetState = {
  budget: number;
  setBudget: (budget: number) => void;
};

export const useBudget = create<BudgetState>((set, get) => {
  return {
    budget: 120,
    setBudget: (budget) => set({ budget }),
  };
});

type ReceiptState = {
  receipts: Receipt[];
  addReceipt: (receipt: Receipt) => void;
  updateReceipt: (prev: Receipt) => void;
  deleteReceipt: (id: string) => void;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
  serverReceipt: Receipt;
  updateMerchantName: (name: string) => void;
  getReceipts: () => void;
  setServerReceipt: (receipt: Receipt) => void;
};
export const useReceipt = create<ReceiptState>((set, get) => {
  return {
    receipts: [],
    serverReceipt: {},
    isLoading: false,
    setIsLoading: (v) => set({ isLoading: v }),
    setServerReceipt: (receipt: Receipt) => set({ serverReceipt: receipt }),
    getReceipts: async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/receipt/`, {
          ...requestHeader(useAuth.getState().token),
        });

        const data = await res.json();

        // 1. Defend against non-array responses (like 401 Unauthorized HTML/JSON errors)
        if (!Array.isArray(data)) {
          console.error("Expected an array of receipts, but got:", data);
          return get().receipts;
        }

        // 2. Format all the receipts in memory FIRST
        const formattedReceipts = data.map((obj) => {
          // Safely default to an empty array if obj.items is null/undefined
          const serverItems = (obj.items || []).map((item: any) => ({
            ...item,
            unit_price: item.unitPrice,
            total_price: item.totalPrice,
          }));

          return {
            ...obj,
            payment_method: obj.paymentMethod,
            benny_message: obj.bennyMessage,
            items: serverItems,
          };
        });

        // 3. Filter out duplicates compared to what is already in state
        const currentReceipts = get().receipts;
        const newReceipts = formattedReceipts.filter(
          (incoming) =>
            !currentReceipts.some((existing) => existing.id === incoming.id),
        );

        // 4. Update the Zustand state EXACTLY ONCE
        if (newReceipts.length > 0) {
          set({ receipts: [...currentReceipts, ...newReceipts] });
        }
      } catch (error) {
        console.error("Error fetching receipts:", error);
        return get().receipts;
      }
    },
    addReceipt: (receipt: Receipt) => {
      const prev = get().receipts;
      const dup = prev.find((r) => r.id === receipt.id);
      if (!dup) {
        set({ receipts: [...get().receipts, receipt] });
      }
    },
    updateReceipt: (prev: Receipt) => {
      // Actually apply the incoming receipt data
      set({
        receipts: get().receipts.map((receipt) => {
          if (receipt.id === prev.id) {
            return { ...receipt, ...prev };
          }
          return receipt;
        }),
      });
    },
    updateMerchantName: (name: string) => {
      set({
        serverReceipt: {
          ...get().serverReceipt,
          merchant: {
            ...get().serverReceipt.merchant,
            name,
          },
        },
      });
    },
    deleteReceipt: async (id: string) => {
      try {
        const res = await fetch(`${BASE_URL}/api/receipt/?receiptId=${id}`, {
          ...requestHeader(useAuth.getState().token),
          method: "delete"
        });
        const data = await res.json();

        set({ receipts: get().receipts.filter((r) => r.id !== data.id) });
      } catch (error) {
        return;
      }
    },
  };
});

type CameraState = {
  source: string;
  setSource: (source: string) => void;
  blob: Blob | null;
  setBlob: (blob: Blob) => void;
};

export const useCamera = create<CameraState>((set, get) => {
  return {
    source: "#",
    setSource: (source: string) => set({ source }),
    blob: null,
    setBlob: (blob: Blob) => set({ blob }),
  };
});

type PayFrequency = "weekly" | "biweekly" | "semimonthly" | "monthly";

type NotificationPrefs = {
  weeklySummary: boolean;
  budgetAlert: boolean;
  paydayReminder: boolean;
};

type PreferencesState = {
  // Pay period
  payFrequency: PayFrequency;
  nextPayday: string | null; // ISO 8601 date string

  // Spending goal
  budgetPerPeriod: number;

  // Benny personality
  chattiness: ChattinessLevel;

  // Notifications
  notifications: NotificationPrefs;

  // Setters
  setPayFrequency: (freq: PayFrequency) => void;
  setNextPayday: (date: string) => void;
  setBudgetPerPeriod: (amount: number) => void;
  setChattiness: (level: ChattinessLevel) => void;
  setNotifications: (prefs: Partial<NotificationPrefs>) => void;

  // Onboarding completed flag
  onboardingComplete: boolean;
  setOnboardingComplete: (v: boolean) => void;

  reset: () => void;
};

const defaultPreferences = {
  payFrequency: "biweekly" as PayFrequency,
  nextPayday: null,
  budgetPerPeriod: 1200,
  chattiness: 1 as ChattinessLevel,
  notifications: {
    weeklySummary: true,
    budgetAlert: true,
    paydayReminder: false,
  },
  onboardingComplete: false,
};

export const usePreferences = create<PreferencesState>((set, get) => ({
  ...defaultPreferences,

  setPayFrequency: (freq) => set({ payFrequency: freq }),
  setNextPayday: (date) => set({ nextPayday: date }),
  setBudgetPerPeriod: (amount) => set({ budgetPerPeriod: amount }),
  setChattiness: (level) => set({ chattiness: level }),
  setNotifications: (prefs) =>
    set({ notifications: { ...get().notifications, ...prefs } }),
  setOnboardingComplete: (v) => set({ onboardingComplete: v }),
  reset: () => set(defaultPreferences),
}));