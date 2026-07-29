export const getCartSubtotal = (cart) =>
  cart.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0
  );

export const getCartItemCount = (cart) =>
  cart.reduce((total, item) => total + Number(item.quantity), 0);

export const getCartTax = (subtotal, rate = 0.02) => subtotal * rate;

export const formatCents = (amount) => `$${(Number(amount) / 100).toFixed(2)}`;
