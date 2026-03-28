'use client';

import { AppShell } from '@/components/common/AppShell';
import { AuthGuard } from '@/features/auth';


export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
