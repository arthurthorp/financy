import { gql } from "@apollo/client";

export const GET_DASHBOARD = gql`
  query HomeDashboard {
    homeDashboard {
      monthExpensesInCents
      totalBalanceInCents
      monthRevenueInCents
    }
  }
`;
