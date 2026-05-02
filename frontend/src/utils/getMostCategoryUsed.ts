import { Category } from "@/types";

export function getMostUsedCategory(categories: Category[]) {
  if (!categories?.length) return null;

  return categories.reduce((prev, current) => {
    const prevCount = prev?.transactionsSummary?.count ?? 0;
    const currentCount = current?.transactionsSummary?.count ?? 0;

    return currentCount > prevCount ? current : prev;
  }, categories[0]);
}
