import { gql } from "@apollo/client";

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      refreshToken
      token
      user {
        id
        name
        email
        createdAt
        updatedAt
      }
    }
  }
`;
