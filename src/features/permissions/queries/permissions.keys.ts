export const permissionKeys = {
  all: ['permissions'] as const,
  lists: () => [...permissionKeys.all, 'list'] as const,
  list: () => [...permissionKeys.lists(), 'list'] as const,
  details: () => [...permissionKeys.all, 'detail'] as const,
  detail: (permissionCode: string) => [...permissionKeys.details(), permissionCode] as const,
} as const;
