const DATABASE_NAME = "standout-client";
const STORE_NAME = "zustand";

const requestToPromise = (request) =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const openDatabase = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const runTransaction = async (mode, operation) => {
  const database = await openDatabase();
  try {
    const transaction = database.transaction(STORE_NAME, mode);
    const result = await operation(transaction.objectStore(STORE_NAME));
    await new Promise((resolve, reject) => {
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
    return result;
  } finally {
    database.close();
  }
};

export function createIndexedDbStorage({ legacyValue, onMigrated } = {}) {
  if (typeof indexedDB === "undefined") return localStorage;

  return {
    async getItem(name) {
      try {
        const stored = await runTransaction("readonly", (store) =>
          requestToPromise(store.get(name)),
        );
        if (stored != null) return stored;

        const fallback = localStorage.getItem(name) || legacyValue?.();
        if (fallback != null) {
          await runTransaction("readwrite", (store) =>
            requestToPromise(store.put(fallback, name)),
          );
          localStorage.removeItem(name);
          onMigrated?.();
        }
        return fallback;
      } catch {
        return localStorage.getItem(name) || legacyValue?.() || null;
      }
    },

    async setItem(name, value) {
      try {
        await runTransaction("readwrite", (store) =>
          requestToPromise(store.put(value, name)),
        );
        localStorage.removeItem(name);
      } catch {
        localStorage.setItem(name, value);
      }
    },

    async removeItem(name) {
      localStorage.removeItem(name);
      try {
        await runTransaction("readwrite", (store) =>
          requestToPromise(store.delete(name)),
        );
      } catch {
        // The local fallback has already been cleared.
      }
    },
  };
}
