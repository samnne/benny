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
  return +(itemsSum + tax - discounts).toFixed(2);
}

export const useAuth = create<{ token: string }>((set, get) => ({
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
  setServerReceipt: (receipt: Receipt) => void;
};
export const useReceipt = create<ReceiptState>((set, get) => {
  return {
    receipts: [],
    serverReceipt: {},
    isLoading: false,
    setIsLoading: (v) => set({ isLoading: v }),
    setServerReceipt: (receipt: Receipt) => set({ serverReceipt: receipt }),
    addReceipt: (receipt: Receipt) => {
      set({ receipts: [...get().receipts, receipt] });
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
    deleteReceipt: (id: string) => {
      set({ receipts: get().receipts.filter((r) => r.id !== id) });
    },
  };
});

type CameraState = {
  source: string;
  setSource: (source: string) => void;
};

export const useCamera = create<CameraState>((set, get) => {
  return {
    source: "#",
    setSource: (source: string) => set({ source }),
  };
});
