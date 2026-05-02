import { useQuery } from "@tanstack/react-query";
import { apolloClient } from "@/lib/graphql/apollo";

import type { ListRecentTransactionsOutput } from "@/types";
import { GET_RECENT_TRANSACTIONS } from "@/lib/graphql/queries/getRecentTransactions";

export function useRecentTransactions() {
  return useQuery({
    queryKey: ["recent_transactions"],
    queryFn: async (): Promise<
      ListRecentTransactionsOutput["listRecentsTransactions"]
    > => {
      const { data } = await apolloClient.query<ListRecentTransactionsOutput>({
        query: GET_RECENT_TRANSACTIONS,
        fetchPolicy: "no-cache",
      });

      return data.listRecentsTransactions;
    },
  });
}
