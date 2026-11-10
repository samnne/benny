import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { auth } from "@/config/firebase";
import { BASE_URL, requestHeader } from "@/constants/constants";
import { useAuth } from "@/store/zustand";

export type Paycheck = {
  id: string;
  amount: number;
  date: string; // YYYY-MM-DD, local date
  category: string; // user-defined category, may be empty
};

type PaycheckInput = Omit<Paycheck, "id">;

type PaycheckState = {
  paychecks: Paycheck[];
  categories: string[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  getPaychecks: () => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  addPaycheck: (p: PaycheckInput) => Promise<Paycheck | null>;
  updatePaycheck: (id: string, p: PaycheckInput) => Promise<Paycheck | null>;
  removePaycheck: (id: string) => Promise<boolean>;
  clearPaychecks: () => void;
};

export const DEFAULT_CATEGORIES = ["Paycheck", "Tips", "Refund"];

type ServerPaycheck = {
  id: string;
  amount: number;
  date: string;
  category?: string | null;
};

const makeId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const normalizeCategory = (name: string) => name.trim().replace(/\s+/g, " ");

const normalizeCategories = (categories: unknown): string[] => {
  if (!Array.isArray(categories)) return [];
  return categories.filter(
    (category): category is string => typeof category === "string",
  );
};

const mergeCategories = (...groups: string[][]) => {
  const seen = new Set<string>();

  return groups
    .flat()
    .map(normalizeCategory)
    .filter((category) => {
      if (!category) return false;

      const key = category.toLowerCase();
      if (seen.has(key)) return false;

      seen.add(key);
      return true;
    });
};

const mergeById = (paychecks: Paycheck[]) => {
  const seen = new Set<string>();

  return paychecks.filter((paycheck) => {
    if (seen.has(paycheck.id)) return false;
    seen.add(paycheck.id);
    return true;
  });
};

const toPaycheck = (dto: ServerPaycheck): Paycheck => ({
  id: dto.id,
  amount: Number(dto.amount) || 0,
  date: dto.date,
  category: dto.category ?? "",
});

const toPayload = (p: PaycheckInput) => ({
  amount: p.amount,
  date: p.date,
  category: p.category,
});

const fingerprint = (p: Pick<Paycheck, "amount" | "date" | "category">) =>
  `${p.amount}|${p.date}|${p.category.trim().toLowerCase()}`;

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong";

const getToken = async () => {
  const existing = useAuth.getState().token;
  if (existing) return existing;

  const user = auth.currentUser;
  if (!user) {
    throw new Error("You need to be signed in to sync paychecks.");
  }

  const token = await user.getIdToken();
  useAuth.getState().setToken(token);
  return token;
};

const api = async (path: string, init?: RequestInit) => {
  const token = await getToken();
  const headers = requestHeader(token).headers as Record<string, string>;

  const response = await fetch(`${BASE_URL}/api/paychecks${path}`, {
    ...requestHeader(token),
    ...init,
    headers: {
      ...headers,
      "Content-Type": "application/json",
      ...((init?.headers as Record<string, string>) ?? {}),
    },
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `Request failed (${response.status})`);
  }

  return response;
};

type PersistedPaycheckState = {
  paychecks?: (Partial<Paycheck> & { source?: string })[];
  categories?: string[];
};

export const usePaychecks = create<PaycheckState>()(
  persist(
    (set, get) => ({
      paychecks: [],
      categories: DEFAULT_CATEGORIES,
      isLoading: false,
      isSaving: false,
      error: null,

      getPaychecks: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await api("/");
          const data = await response.json();
          const serverPaychecks: Paycheck[] = Array.isArray(data)
            ? data.map((dto) => toPaycheck(dto as ServerPaycheck))
            : [];

          // Push paychecks that only exist locally (created before the
          // backend existed, or from a save that failed) up to Firestore.
          // Count matching entries so legitimate duplicates are preserved.
          const serverCounts = new Map<string, number>();
          for (const paycheck of serverPaychecks) {
            const key = fingerprint(paycheck);
            serverCounts.set(key, (serverCounts.get(key) ?? 0) + 1);
          }

          const localOnly: Paycheck[] = [];
          for (const paycheck of get().paychecks) {
            const key = fingerprint(paycheck);
            const remaining = serverCounts.get(key) ?? 0;

            if (remaining > 0) {
              serverCounts.set(key, remaining - 1);
            } else {
              localOnly.push(paycheck);
            }
          }

          const uploaded: Paycheck[] = [];
          for (const paycheck of localOnly) {
            try {
              const createResponse = await api("/", {
                method: "POST",
                body: JSON.stringify(toPayload(paycheck)),
              });
              uploaded.push(toPaycheck(await createResponse.json()));
            } catch {
              // Keep the local copy so the next fetch can retry it.
              uploaded.push(paycheck);
            }
          }

          let serverCategories: string[] = get().categories;
          try {
            const categoriesResponse = await api("/categories");
            serverCategories = normalizeCategories(
              await categoriesResponse.json(),
            );
          } catch {
            // Categories are non-critical; keep the local cache.
          }

          const mergedPaychecks = mergeById([
            ...serverPaychecks,
            ...uploaded,
          ]);

          set({
            paychecks: mergedPaychecks,
            categories: mergeCategories(
              DEFAULT_CATEGORIES,
              serverCategories,
              get().categories,
              mergedPaychecks.map((paycheck) => paycheck.category),
            ),
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false, error: getErrorMessage(error) });
        }
      },

      addCategory: async (name) => {
        const clean = normalizeCategory(name);
        if (!clean) return;

        const exists = get().categories.some(
          (category) => category.toLowerCase() === clean.toLowerCase(),
        );
        if (!exists) set({ categories: [...get().categories, clean] });

        try {
          const response = await api("/categories", {
            method: "POST",
            body: JSON.stringify({ name: clean }),
          });
          const serverCategories = normalizeCategories(await response.json());

          set({
            categories: mergeCategories(
              DEFAULT_CATEGORIES,
              serverCategories,
              get().categories,
            ),
          });
        } catch (error) {
          // Keep the optimistic category locally so the user can still use it.
          set({ error: getErrorMessage(error) });
        }
      },

      addPaycheck: async (p) => {
        set({ isSaving: true, error: null });

        try {
          const response = await api("/", {
            method: "POST",
            body: JSON.stringify(toPayload(p)),
          });
          const saved = toPaycheck(await response.json());

          set({
            paychecks: mergeById([...get().paychecks, saved]),
            isSaving: false,
          });

          return saved;
        } catch (error) {
          set({ isSaving: false, error: getErrorMessage(error) });
          return null;
        }
      },

      updatePaycheck: async (id, p) => {
        set({ isSaving: true, error: null });

        try {
          const response = await api(`/${encodeURIComponent(id)}`, {
            method: "PUT",
            body: JSON.stringify(toPayload(p)),
          });
          const saved = toPaycheck(await response.json());

          set({
            paychecks: get().paychecks.map((paycheck) =>
              paycheck.id === id ? saved : paycheck,
            ),
            isSaving: false,
          });

          return saved;
        } catch (error) {
          set({ isSaving: false, error: getErrorMessage(error) });
          return null;
        }
      },

      removePaycheck: async (id) => {
        set({ isSaving: true, error: null });

        try {
          await api(`/${encodeURIComponent(id)}`, { method: "DELETE" });

          set({
            paychecks: get().paychecks.filter((paycheck) => paycheck.id !== id),
            isSaving: false,
          });

          return true;
        } catch (error) {
          set({ isSaving: false, error: getErrorMessage(error) });
          return false;
        }
      },

      clearPaychecks: () => set({ paychecks: [] }),
    }),
    {
      name: "benny-paychecks",
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        paychecks: state.paychecks,
        categories: state.categories,
      }),
      // v1 stored a free-text `source`; carry it over as the category and
      // keep every category the user had already used.
      migrate: (persisted) => {
        const state = (persisted ?? {}) as PersistedPaycheckState;

        const paychecks: Paycheck[] = (state.paychecks ?? []).map((p) => ({
          id: p.id ?? makeId(),
          amount: p.amount ?? 0,
          date: p.date ?? "",
          category: normalizeCategory(p.category ?? p.source ?? ""),
        }));

        const categories = mergeCategories(
          DEFAULT_CATEGORIES,
          state.categories ?? [],
          paychecks.map((p) => p.category),
        );

        return { paychecks, categories };
      },
    },
  ),
);
