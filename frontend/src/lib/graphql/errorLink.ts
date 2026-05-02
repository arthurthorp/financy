import { ErrorLink } from "@apollo/client/link/error";
import { Observable } from "@apollo/client";
import { useAuthStore } from "@/stores/auth";
import { refreshClient } from "./apollo";
import { REFRESH_TOKEN } from "./mutations/RefreshToken";
import { RefreshTokenOutput } from "@/types";

let isRefreshing = false;
let pendingRequests: (() => void)[] = [];

function resolvePendingRequests() {
  pendingRequests.forEach((cb) => cb());
  pendingRequests = [];
}

export const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (!error || !("errors" in error)) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graphQLErrors = (error as any).errors;

  for (const err of graphQLErrors) {
    if (err.extensions?.code === "UNAUTHENTICATED") {
      return new Observable((observer) => {
        const { refreshToken, setAuth, logout } = useAuthStore.getState();

        if (!refreshToken) {
          logout();
          window.location.href = "/login";
          observer.complete();
          return;
        }

        const retry = () => {
          forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        };

        if (isRefreshing) {
          pendingRequests.push(retry);
          return;
        }

        isRefreshing = true;

        refreshClient
          .mutate<RefreshTokenOutput>({
            mutation: REFRESH_TOKEN,
            variables: { refreshToken },
          })
          .then(({ data }) => {
            const newAuth = data.refreshToken;

            setAuth({
              user: newAuth.user,
              token: newAuth.token,
              refreshToken: newAuth.refreshToken,
            });

            isRefreshing = false;

            resolvePendingRequests();

            retry();
          })
          .catch(() => {
            isRefreshing = false;
            logout();
            window.location.href = "/login";
            observer.error(new Error("Refresh failed"));
          });
      });
    }
  }
});
