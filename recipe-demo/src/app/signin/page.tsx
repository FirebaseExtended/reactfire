'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { signIn } from '@/lib/session';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(undefined);
    try {
      await signIn(email, password);
      router.replace(searchParams.get('next') ?? '/');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign in</h1>

      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error ? true : undefined}
          required
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={error ? true : undefined}
          required
        />
      </label>

      {error && <small role="alert">{error}</small>}

      <button type="submit" aria-busy={pending} disabled={pending}>
        Sign in
      </button>
    </form>
  );
}

// Next 16 requires a Suspense boundary around useSearchParams.
export default function SignInPage() {
  return (
    <Suspense fallback={<article aria-busy="true">Loading</article>}>
      <SignInForm />
    </Suspense>
  );
}
