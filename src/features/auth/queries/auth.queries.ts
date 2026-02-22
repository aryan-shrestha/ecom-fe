import { useRouter } from "next/navigation";

import * as authApi from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";

import { authKeys } from "./auth.keys";
import { ROUTES } from "@/lib/routes/paths";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Query hook for fetching current user
 */
export function useMeQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: authApi.fetchMe,
    enabled: !!accessToken, // Only fetch if we have an access token
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Mutation hook for login
 */
export function useLoginMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setAccessToken, setUser, setStatus } = useAuthStore();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      // Store access token
      setAccessToken(data.access_token);
      setStatus("authenticated");

      // Fetch user data and cache it
      try {
        const user = await authApi.fetchMe();
        setUser(user);
        queryClient.setQueryData(authKeys.me(), user);
      } catch (error) {
        // If user is in response, use it
        if (data.user) {
          setUser(data.user);
          queryClient.setQueryData(authKeys.me(), data.user);
        }
      }

      // Redirect to dashboard
      router.push(ROUTES.DASHBOARD);
    },
    onError: () => {
      setStatus("unauthenticated");
    },
  });
}

/**
 * Mutation hook for register
 */
export function useRegisterMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      // Redirect to login after successful registration
      router.push(ROUTES.LOGIN);
    },
  });
}

/**
 * Mutation hook for refresh token
 */
export function useRefreshMutation() {
  const { setAccessToken } = useAuthStore();

  return useMutation({
    mutationFn: authApi.refreshAccessToken,
    onSuccess: (data) => {
      setAccessToken(data.access_token);
    },
    onError: () => {
      // Refresh failed, clear state
      useAuthStore.getState().clear();
    },
  });
}

/**
 * Mutation hook for logout
 */
export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { clear } = useAuthStore();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear auth state
      clear();

      // Clear all cached queries
      queryClient.clear();

      // Redirect to login
      router.push(ROUTES.LOGIN);
    },
    onError: () => {
      // Even if logout fails, clear local state and redirect
      clear();
      queryClient.clear();
      router.push(ROUTES.LOGIN);
    },
  });
}

/**
 * Mutation hook for logout all sessions
 */
export function useLogoutAllMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { clear } = useAuthStore();

  return useMutation({
    mutationFn: authApi.logoutAll,
    onSuccess: () => {
      clear();
      queryClient.clear();
      router.push(ROUTES.LOGIN);
    },
  });
}

/**
 * Mutation hook for changing password
 */
export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: authApi.changePassword,
  });
}
