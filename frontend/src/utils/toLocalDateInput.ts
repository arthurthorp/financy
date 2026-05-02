export function toLocalDateInput(date: string | Date) {
  const d = new Date(date);

  const offset = d.getTimezoneOffset();

  const local = new Date(d.getTime() - offset * 60 * 1000);

  return local.toISOString().split("T")[0];
}
