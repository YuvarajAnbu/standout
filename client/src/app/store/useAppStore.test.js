import { beforeEach, describe, expect, it } from "vitest";
import { useAppStore } from "@/app/store/useAppStore";

describe("useAppStore", () => {
  beforeEach(() => {
    useAppStore.setState({ cart: [], user: {}, orders: [] });
  });

  it("supports immutable functional updates without a provider", () => {
    const { setCart } = useAppStore.getState();

    setCart((cart) => [...cart, { _id: "product-1", quantity: 1 }]);

    expect(useAppStore.getState().cart).toEqual([
      { _id: "product-1", quantity: 1 },
    ]);
  });

  it("keeps session state separate from persisted shopping state", () => {
    const { setUser, setOrders, resetSession } = useAppStore.getState();
    setUser({ name: "Customer" });
    setOrders([{ _id: "order-1" }]);
    resetSession();

    expect(useAppStore.getState().user).toEqual({});
    expect(useAppStore.getState().orders).toEqual([]);
  });
});
