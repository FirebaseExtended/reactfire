import type { Metadata } from 'next';
import Link from 'next/link';
import '@picocss/pico/css/pico.min.css';
import { Providers } from '@/lib/providers';
import { SessionNav } from '@/components/SessionNav';

export const metadata: Metadata = {
  title: 'Recipe demo',
  description: 'Firebase JS SDK recipe app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <header className="container">
            <nav>
              <ul>
                <li>
                  <strong>
                    <Link href="/">Recipes</Link>
                  </strong>
                </li>
              </ul>
              <ul>
                <li>
                  <Link href="/create-recipe">Create a recipe</Link>
                </li>
                <SessionNav />
              </ul>
            </nav>
          </header>
          <main className="container">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
