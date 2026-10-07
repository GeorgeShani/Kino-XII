export const formatPrice = (amount: number) =>
  `₾ ${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
