export function centsToReais(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function reaisToCents(value: string): number {
  if (!value) return 0;

  const normalized = value
    .replace(/\s/g, "")
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".");

  const numberValue = Number(normalized);

  if (Number.isNaN(numberValue)) return 0;

  return Math.round(numberValue * 100);
}

export function formatCurrencyInput(value: string): string {
  const onlyNumbers = value.replace(/\D/g, "");

  const number = Number(onlyNumbers) / 100;

  return number.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  });
}
