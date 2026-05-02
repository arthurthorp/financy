import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apolloClient } from "@/lib/graphql/apollo";
import type { User, RegisterInput, LoginInput, UpdateUserInput } from "@/types";
import { REGISTER } from "@/lib/graphql/mutations/Register";
import { LOGIN } from "@/lib/graphql/mutations/Login";
import { UPDATE_USER } from "@/lib/graphql/mutations/UpdateUser";

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

type UpdateUserMutationData = {
  updateUser: {
    name: string;
  };
};

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  _hasHydrated: boolean;

  updateUser: ({ name }: { name: string }) => Promise<boolean>;
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

      _hasHydrated: false,

      setAuth: ({ user, token, refreshToken }) => {
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
        });
      },
      updateUser: async ({ name }: { name: string }) => {
        const { data } = await apolloClient.mutate<
          UpdateUserMutationData,
          { data: UpdateUserInput }
        >({
          mutation: UPDATE_USER,
          variables: {
            data: { name },
          },
        });

        if (data?.updateUser?.name) {
          set((state) => ({
            user: state.user
              ? { ...state.user, name: data?.updateUser?.name }
              : null,
          }));

          return true;
        }

        return false;
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

      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
          state.isAuthenticated = !!state.token;
        }
      },
    }
  )
);
