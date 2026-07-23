import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createIndexedDbStorage } from "../utils/indexedDbStorage";

const resolveUpdate = (update, current) =>
  typeof update === "function" ? update(current) : update;

const persistedKeys = [
  "cart",
  "orders",
  "hideOrders",
  "userProducts",
  "hideProducts",
  "reviews",
  "hideReviews",
  "userCount",
];

const readLegacyState = () => {
  if (typeof localStorage === "undefined") return {};

  return persistedKeys.reduce((state, key) => {
    const value = localStorage.getItem(key);
    if (value === null) return state;

    try {
      state[key] = JSON.parse(value);
    } catch {
      // Ignore malformed values from the legacy per-key persistence format.
    }
    return state;
  }, {});
};

const legacyState = readLegacyState();
const legacyPersistedValue = () =>
  Object.keys(legacyState).length > 0
    ? JSON.stringify({ state: legacyState, version: 1 })
    : null;
const removeLegacyState = () =>
  persistedKeys.forEach((key) => localStorage.removeItem(key));

export const useAppStore = create(
  persist(
    (set) => ({
      user: {},
      cart: legacyState.cart || [],
      path: "/",
      orders: legacyState.orders || [],
      hideOrders: legacyState.hideOrders || [],
      userProducts: legacyState.userProducts || [],
      hideProducts: legacyState.hideProducts || [],
      reviews: legacyState.reviews || [],
      hideReviews: legacyState.hideReviews || [],
      userCount: legacyState.userCount || 0,

      setUser: (update) =>
        set((state) => ({ user: resolveUpdate(update, state.user) })),
      setCart: (update) =>
        set((state) => ({ cart: resolveUpdate(update, state.cart) })),
      setPath: (update) =>
        set((state) => ({ path: resolveUpdate(update, state.path) })),
      setOrders: (update) =>
        set((state) => ({ orders: resolveUpdate(update, state.orders) })),
      setHideOrders: (update) =>
        set((state) => ({
          hideOrders: resolveUpdate(update, state.hideOrders),
        })),
      setUserProducts: (update) =>
        set((state) => ({
          userProducts: resolveUpdate(update, state.userProducts),
        })),
      setHideProducts: (update) =>
        set((state) => ({
          hideProducts: resolveUpdate(update, state.hideProducts),
        })),
      setReviews: (update) =>
        set((state) => ({ reviews: resolveUpdate(update, state.reviews) })),
      setHideReviews: (update) =>
        set((state) => ({
          hideReviews: resolveUpdate(update, state.hideReviews),
        })),
      setUserCount: (update) =>
        set((state) => ({
          userCount: resolveUpdate(update, state.userCount),
        })),
      resetSession: () => set({ user: {} }),
    }),
    {
      name: "standout-client-state",
      storage: createJSONStorage(() =>
        createIndexedDbStorage({
          legacyValue: legacyPersistedValue,
          onMigrated: removeLegacyState,
        }),
      ),
      partialize: ({
        cart,
        orders,
        hideOrders,
        userProducts,
        hideProducts,
        reviews,
        hideReviews,
        userCount,
      }) => ({
        cart,
        orders,
        hideOrders,
        userProducts,
        hideProducts,
        reviews,
        hideReviews,
        userCount,
      }),
      version: 1,
    }
  )
);
