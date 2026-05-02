import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query listCategories {
    listCategories {
      id
      title
      description
      icon
      color
      countTransactions
    }
  }
`;
