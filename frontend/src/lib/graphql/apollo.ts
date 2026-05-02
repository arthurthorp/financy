import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
} from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { useAuthStore } from "../../stores/auth";
import { errorLink } from "./errorLink";

const uri = import.meta.env.VITE_BACKEND_URL;

const httpLink = new HttpLink({
  uri,
});

const authLink = new SetContextLink((prevContext) => {
  const token = useAuthStore.getState().token;
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export const refreshClient = new ApolloClient({
  link: new HttpLink({
    uri,
  }),
  cache: new InMemoryCache(),
});
