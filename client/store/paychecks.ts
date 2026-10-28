import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Paycheck = {
  id: string;
  amount: number;
  date: string; // YYYY-MM-DD, local date
  source: string; // employer or note, may be empty
};

type PaycheckInput = Omit<Paycheck, "id">;

type PaycheckState = {
  paychecks: Paycheck[];
  addPaycheck: (p: PaycheckInput) => void;
  updatePaycheck: (id: string, p: PaycheckInput) => void;
  removePaycheck: (id: string) => void;
  clearPaychecks: () => void;
};

const makeId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const usePaychecks = create<PaycheckState>()(
  persist(
    (set, get) => ({
      paychecks: [],
      addPaycheck: (p) =>
        set({ paychecks: [...get().paychecks, { id: makeId(), ...p }] }),
      updatePaycheck: (id, p) =>
        set({
          paychecks: get().paychecks.map((x) =>
            x.id === id ? { ...x, ...p } : x,
          ),
        }),
      removePaycheck: (id) =>
        set({ paychecks: get().paychecks.filter((x) => x.id !== id) }),
      clearPaychecks: () => set({ paychecks: [] }),
    }),
    {
      name: "benny-paychecks",
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);