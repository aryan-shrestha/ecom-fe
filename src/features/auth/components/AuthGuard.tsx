"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { authKeys } from "../queries/auth.keys";
import { useMeQuery, useRefreshMutation } from "../queries/auth.queries";
import { useAuthStore } from "../store/auth.store";
import { ROUTES } from "@/lib/routes/paths";
import { useQueryClient } from "@tanstack/react-query";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard - Ensures user is authenticated before rendering protected content
 *
 * Flow:
 * 1. Try to fetch /auth/me with current access token
 * 2. If 401: attempt refresh
 * 3. If refresh succeeds: retry /auth/me
 * 4. If refresh fails: redirect to login
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { accessToken, setAccessToken, setUser, setStatus, clear } =
    useAuthStore();
  const meQuery = useMeQuery();
  const refreshMutation = useRefreshMutation();

  useEffect(() => {
    async function verifyAuth() {
      // If we have access token and user data is loading or loaded, we're good
      if (accessToken && (meQuery.isLoading || meQuery.data)) {
        if (meQuery.data) {
          setUser(meQuery.data);
          setStatus("authenticated");
        }
        return;
      }

      // If no access token, try to refresh
      if (!accessToken) {
        try {
          setStatus("loading");
          const refreshData = await refreshMutation.mutateAsync();
          setAccessToken(refreshData.access_token);

          // After refresh, refetch me
          const userData = await queryClient.fetchQuery({
            queryKey: authKeys.me(),
            queryFn: async () => {
              const { fetchMe } = await import("../api/auth.api");
              return fetchMe();
            },
          });

          setUser(userData);
          setStatus("authenticated");
        } catch (error) {
          // Refresh failed, clear state and redirect
          clear();
          router.push(ROUTES.LOGIN);
        }
        return;
      }

      // If me query failed with error
      if (meQuery.isError) {
        try {
          setStatus("loading");
          const refreshData = await refreshMutation.mutateAsync();
          setAccessToken(refreshData.access_token);

          // Refetch me
          await meQuery.refetch();
        } catch (error) {
          clear();
          router.push(ROUTES.LOGIN);
        }
      }
    }

    verifyAuth();
  }, [accessToken, meQuery.data, meQuery.isError, meQuery.isLoading]);

  // Show loading state while verifying
  if (meQuery.isLoading || refreshMutation.isPending || !meQuery.data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
