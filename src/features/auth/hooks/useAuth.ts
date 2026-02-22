import { useMeQuery, useRefreshMutation } from "../queries/auth.queries";
import { useAuthStore } from "../store/auth.store";

export function useAuth() {
  const { accessToken, user, status } = useAuthStore();
  const meQuery = useMeQuery();
  const refreshMutation = useRefreshMutation();

  return {
    user,
    accessToken,
    status,
    isAuthenticated: !!accessToken && !!user,
    isLoading: meQuery.isLoading || refreshMutation.isPending,
    meQuery,
    refreshMutation,
  };
}
