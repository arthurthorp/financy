import { useQuery } from "@tanstack/react-query";
import { apolloClient } from "@/lib/graphql/apollo";

import type { HomeDashboardOutput } from "@/types";
import { GET_DASHBOARD } from "@/lib/graphql/queries/getDashboard";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async (): Promise<HomeDashboardOutput["homeDashboard"]> => {
      const { data } = await apolloClient.query<HomeDashboardOutput>({
        query: GET_DASHBOARD,

        fetchPolicy: "no-cache",
      });

      return data.homeDashboard;
    },
  });
}
