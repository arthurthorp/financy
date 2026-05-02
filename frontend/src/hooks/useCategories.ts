import { useQuery } from "@tanstack/react-query";
import { apolloClient } from "@/lib/graphql/apollo";
import { GET_CATEGORIES } from "@/lib/graphql/queries/getCategories";

export type Category = {
  id: string;
  title: string;
  description?: string;
  icon: string;
  color: string;
  countTransactions?: number;
};

type GetCategoriesOutput = {
  listCategories: Category[];
};

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const { data } = await apolloClient.query<GetCategoriesOutput>({
        query: GET_CATEGORIES,
        fetchPolicy: "no-cache",
      });

      return data.listCategories;
    },
  });
}
