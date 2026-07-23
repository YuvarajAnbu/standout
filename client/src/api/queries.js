import { queryOptions } from "@tanstack/react-query";
import { apiRequest } from "./client";
import { queryClient } from "./queryClient";

export const queryKeys = {
  auth: ["auth"],
  products: (params = {}) => ["products", params],
  product: (id) => ["products", "detail", id],
  reviews: (productId) => ["reviews", productId],
  orders: ["orders"],
  guestOrder: (id) => ["orders", "guest", id],
};

export const authQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.auth,
    queryFn: ({ signal }) => apiRequest("/user/authenticate", { signal }),
    staleTime: 5 * 60_000,
    retry: false,
  });

export const cachedGet = async (path, options = {}) => {
  const scopeKey = options.scope ? ["http-scope", options.scope] : null;
  if (scopeKey && options.cancelPrevious) {
    await queryClient.cancelQueries({ queryKey: scopeKey });
  }

  return queryClient
    .fetchQuery({
      queryKey: scopeKey ? [...scopeKey, path] : ["http", path],
      queryFn: ({ signal }) => apiRequest(path, { signal }),
      staleTime: options.staleTime ?? 30_000,
      gcTime: options.gcTime ?? 5 * 60_000,
    })
    .then((data) => ({ data, status: 200 }));
};
