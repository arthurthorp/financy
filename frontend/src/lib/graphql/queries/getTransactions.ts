import { gql } from "@apollo/client";

export const LIST_TRANSACTIONS = gql`
  query ListTransactions($input: ListTransactionsInput!) {
    listTransactions(input: $input) {
      data {
        id
        description
        amountInCents
        type
        date
        category {
          id
          title
          icon
          color
        }
      }
      total
      totalPages
      currentPage
    }
  }
`;
