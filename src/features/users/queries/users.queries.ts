import { useQuery } from '@tanstack/react-query';
import { usersKeys } from './users.keys';
import * as userApi from '../api/users.api';

export const useUsersListQuery = () => {
  return useQuery({
    queryKey: usersKeys.list(),
    queryFn: () => userApi.getUsers(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useUserDetailQuery = (userId: string) => {
  return useQuery({
    queryKey: usersKeys.detail(userId),
    queryFn: () => userApi.getUserById(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
