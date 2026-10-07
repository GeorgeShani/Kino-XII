export const digitsOnly = (value: string) => value.replace(/\D/g, "");

const groupDigits = (digits: string, sizes: number[]) => {
  const groups: string[] = [];
  let offset = 0;

  for (const size of sizes) {
    if (offset >= digits.length) break;
    groups.push(digits.slice(offset, offset + size));
    offset += size;
  }

  return groups.join(" ");
};

export const formatCardNumber = (value: string) =>
  groupDigits(digitsOnly(value).slice(0, 16), [4, 4, 4, 4]);

export const formatMobileNumber = (value: string) =>
  groupDigits(digitsOnly(value).slice(0, 9), [3, 3, 3]);

export function formatExpiry(value: string) {
  const digits = digitsOnly(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export const formatCvv = (value: string) => digitsOnly(value).slice(0, 3);

export function normalizeMobileNumber(value: string | null) {
  const digits = digitsOnly(value ?? "");
  return digits.length === 12 && digits.startsWith("995")
    ? digits.slice(3)
    : digits.slice(-9);
}
