export const formatPrice = (amount: number, spaced = true) =>
  `₾${spaced ? " " : ""}${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
