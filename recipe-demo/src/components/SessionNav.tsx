'use client';

import Link from 'next/link';
import { logOut } from '@/lib/session';
import { useSession } from '@/lib/session-context';

export function SessionNav() {
  const { user, status } = useSession();

  if (status === 'loading') {
    return (
      <li aria-busy="true">
        <span>Loading</span>
      </li>
    );
  }

  if (!user) {
    return (
      <li>
        <Link href="/signin" role="button">
          Sign in
        </Link>
      </li>
    );
  }

  return (
    <>
      <li>{user.email}</li>
      <li>
        <button className="secondary" onClick={() => logOut()}>
          Sign out
        </button>
      </li>
    </>
  );
}
