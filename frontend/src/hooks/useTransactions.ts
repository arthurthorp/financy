import { useQuery } from "@tanstack/react-query";
import { apolloClient } from "@/lib/graphql/apollo";
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/getTransactions";

import type { ListTransactionsInput, ListTransactionsOutput } from "@/types";

export function useTransactions(input: ListTransactionsInput) {
  return useQuery({
    queryKey: ["transactions", input],
    queryFn: async (): Promise<ListTransactionsOutput["listTransactions"]> => {
      const { data } = await apolloClient.query<ListTransactionsOutput>({
        query: LIST_TRANSACTIONS,
        variables: {
          input,
        },
        fetchPolicy: "no-cache",
      });

      return data.listTransactions;
    },
  });
}
