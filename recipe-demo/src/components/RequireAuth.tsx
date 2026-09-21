'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useSession } from '@/lib/session-context';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Waiting for 'ready' is what stops a signed-in user being bounced to
    // /signin on every hard reload, before onAuthStateChanged has fired.
    if (status === 'ready' && !user) {
      router.replace(`/signin?next=${encodeURIComponent(pathname)}`);
    }
  }, [status, user, router, pathname]);

  if (status === 'loading') {
    return <article aria-busy="true">Checking your session</article>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
