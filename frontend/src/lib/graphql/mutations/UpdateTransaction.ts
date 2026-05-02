import { gql } from "@apollo/client";

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction(
    $updateTransactionId: String!
    $data: CreateTransactionInput!
  ) {
    updateTransaction(id: $updateTransactionId, data: $data) {
      id
    }
  }
`;
