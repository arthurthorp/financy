export function generateMonthYearOptions(quantity = 12) {
  const now = new Date();

  return Array.from({ length: quantity }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);

    const year = date.getFullYear();

    const monthName = date.toLocaleDateString("pt-BR", {
      month: "long",
    });

    const formattedMonth =
      monthName.charAt(0).toUpperCase() + monthName.slice(1);

    return {
      value: `${year}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      label: `${formattedMonth} / ${year}`,
    };
  });
}
