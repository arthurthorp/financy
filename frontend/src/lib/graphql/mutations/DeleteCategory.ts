import { gql } from "@apollo/client";

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($deleteCategoryId: String!) {
    deleteCategory(id: $deleteCategoryId)
  }
`;
