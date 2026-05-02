export function toLocalDateInput(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;

  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
