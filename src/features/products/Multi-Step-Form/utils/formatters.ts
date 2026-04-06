export function formatPrice(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-NP', { style: 'currency', currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}
