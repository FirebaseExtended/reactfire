'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useSigninCheck } from 'reactfire';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { status, data: signinResult } = useSigninCheck();
  const signedIn = signinResult?.signedIn ?? false;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Waiting for 'success' is what stops a signed-in user being bounced to
    // /signin on every hard reload, before the auth state has resolved.
    if (status === 'success' && !signedIn) {
      router.replace(`/signin?next=${encodeURIComponent(pathname)}`);
    }
  }, [status, signedIn, router, pathname]);

  if (status === 'loading') {
    return <article aria-busy="true">Checking your session</article>;
  }

  if (!signedIn) {
    return null;
  }

  return <>{children}</>;
}
