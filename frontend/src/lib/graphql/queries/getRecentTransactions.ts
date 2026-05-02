import { gql } from "@apollo/client";

export const GET_RECENT_TRANSACTIONS = gql`
  query ListRecentsTransactions {
    listRecentsTransactions {
      id
      description
      amountInCents
      type
      category {
        id
        title
        color
        icon
      }
    }
  }
`;
