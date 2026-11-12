// `next` comes from the query string, and the App Router will happily follow an
// absolute URL off-site, so the origin check has to live here. Resolving against
// our own origin and keeping only the path rejects absolute, protocol-relative,
// backslash and `javascript:` forms while leaving ordinary paths intact.
export function safeNext(next: string | null | undefined, origin: string): string {
  let url: URL;
  try {
    url = new URL(next ?? '/', origin);
  } catch {
    return '/';
  }
  return url.origin === origin ? `${url.pathname}${url.search}${url.hash}` : '/';
}
