export function formatCurrency(value: number | null): string {
  if (value === null) {
    return "Not detected";
  }

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}

export function formatNullable(value: string | null): string {
  return value?.trim() ? value : "Not detected";
}
