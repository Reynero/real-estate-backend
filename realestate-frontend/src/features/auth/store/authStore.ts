import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "../api/authApi";
import type { LoginRequest, RegisterRequest } from "../types";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUserName: (name: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.login(data);
          set({
            user: { id: res.userId, name: res.name, email: res.email, role: res.role },
            token: res.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: any) {
          set({
            isLoading: false,
            error: err.response?.data?.message ?? "Couldn't log in. Check your email and password.",
          });
          throw err;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.register(data);
          set({
            user: { id: res.userId, name: res.name, email: res.email, role: res.role },
            token: res.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: any) {
          set({
            isLoading: false,
            error: err.response?.data?.message ?? "Couldn't create your account. Try a different email.",
          });
          throw err;
        }
      },

      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUserName: (name: string) =>
        set((state) => (state.user ? { user: { ...state.user, name } } : {})),
      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage", // must match AUTH_STORAGE_KEY in client.ts, or the token won't be found
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);