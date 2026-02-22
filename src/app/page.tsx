import { redirect } from 'next/navigation';

import { ROUTES } from '@/lib/routes/paths';

import { ROUTES } from '@/lib/routes/paths';

export default function HomePage() {
  redirect(ROUTES.DASHBOARD);
}
