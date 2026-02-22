import type { AuthStatus, User } from "../types/auth.types";
import { HttpClient } from "@/lib/http/client";
import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  status: AuthStatus;
}

interface AuthActions {
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setStatus: (status: AuthStatus) => void;
  clear: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  accessToken: null,
  user: null,
  status: "idle",
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,
  setAccessToken: (accessToken) => set({ accessToken }),
  setUser: (user) => set({ user }),
  setStatus: (status) => set({ status }),
  clear: () => set(initialState),
}));

// Create HTTP client instance with auth store integration
export const httpClient = new HttpClient({
  getAccessToken: () => useAuthStore.getState().accessToken,
  onTokenExpired: async () => {
    try {
      // Import here to avoid circular dependency
      const { refreshAccessToken } = await import("../api/auth.api");
      const response = await refreshAccessToken();
      useAuthStore.getState().setAccessToken(response.access_token);
      return response.access_token;
    } catch (error) {
      // Refresh failed, clear auth state
      useAuthStore.getState().clear();
      return null;
    }
  },
});
