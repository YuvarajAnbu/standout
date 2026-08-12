export const mergeOrdersById = (...collections) => {
  const ordersById = new Map();

  collections.flat().forEach((order) => {
    if (!order?._id) return;
    ordersById.set(String(order._id), order);
  });

  return [...ordersById.values()].sort(
    (first, second) => new Date(second.date) - new Date(first.date),
  );
};

export const upsertOrder = (orders, order) =>
  mergeOrdersById(orders, [order]);
