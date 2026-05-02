import { gql } from "@apollo/client";

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory(
    $updateCategoryId: String!
    $data: CreateCategoryInput!
  ) {
    updateCategory(id: $updateCategoryId, data: $data) {
      id
    }
  }
`;
