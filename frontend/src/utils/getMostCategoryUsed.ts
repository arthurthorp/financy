import { Category } from "@/hooks/useCategories";

export function getMostUsedCategory(categories: Category[]) {
  if (!categories?.length) return null;

  return categories.reduce((prev, current) => {
    const prevCount = prev?.countTransactions ?? 0;
    const currentCount = current?.countTransactions ?? 0;

    return currentCount > prevCount ? current : prev;
  }, categories[0]);
}
