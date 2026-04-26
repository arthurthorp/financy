import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apolloClient } from "@/lib/graphql/apollo";
import type { User, RegisterInput, LoginInput } from "@/types";
import { REGISTER } from "@/lib/graphql/mutations/Register";
import { LOGIN } from "@/lib/graphql/mutations/Login";

type RegisterMutationData = {
  register: {
    token: string;
    refreshToken: string;
    user: User;
  };
};

type LoginMutationData = {
  login: {
    token: string;
    refreshToken: string;
    user: User;
  };
};

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  signup: (data: RegisterInput) => Promise<boolean>;
  login: (data: LoginInput) => Promise<boolean>;
  logout: () => void;

  setAuth: (data: { user: User; token: string; refreshToken: string }) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: ({ user, token, refreshToken }) => {
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
        });
      },

      login: async (loginData: LoginInput) => {
        try {
          const { data } = await apolloClient.mutate<
            LoginMutationData,
            { data: LoginInput }
          >({
            mutation: LOGIN,
            variables: {
              data: loginData,
            },
          });

          if (data?.login) {
            const { user, token, refreshToken } = data.login;

            set({
              user,
              token,
              refreshToken,
              isAuthenticated: true,
            });

            return true;
          }

          return false;
        } catch (error) {
          console.error("Erro ao fazer login:", error);
          throw error;
        }
      },

      signup: async (registerData: RegisterInput) => {
        try {
          const { data } = await apolloClient.mutate<
            RegisterMutationData,
            { data: RegisterInput }
          >({
            mutation: REGISTER,
            variables: {
              data: registerData,
            },
          });

          if (data?.register) {
            const { user, token, refreshToken } = data.register;

            set({
              user,
              token,
              refreshToken,
              isAuthenticated: true,
            });

            return true;
          }

          return false;
        } catch (error) {
          console.error("Erro ao fazer cadastro:", error);
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });

        apolloClient.clearStore();
      },
    }),
    {
      name: "auth-storage",

      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
