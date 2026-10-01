# Spike: a Data Connect subscription hook

**Not for merge.** This branch exists so the code can be read and run. It ships
nothing: the root `tsconfig.json` includes only `src` and `types`, `package.json`
publishes only `dist` and `src`, and `lint`/`format` are scoped to `src test
vite.config.ts`, so nothing here is typechecked, linted, bundled or published by
the repo.

## The question I actually want answered

**Can `subscribe()` be exercised against the Data Connect emulator?**

Everything below is compile-time. If the emulator does not support `subscribe`,
there is no local development path and CI cannot exercise this, which changes the
answer to "should ReactFire support Data Connect" a lot more than the line count
does. `search()` is the precedent: no emulator path meant CI could not cover it,
so it got held to a later minor.

Second question, smaller: **do you know of any React binding that wires up Data
Connect subscriptions, or AI Logic live sessions?** I have `npm search` on that
and it is keyword matching rather than enumeration, so my "nobody does" is really
"none found".

## Why the hook exists

Walking `@firebase/data-connect` 0.7.4 (`public.d.ts`, 524 lines), the SDK
already supplies the things a wrapper classically adds: cache-source choice
(`fetchPolicy`), a cache with a TTL (`CacheProvider`, `maxAgeSeconds`),
provenance (`OpResult.source`, `fetchTime`) and a serialized server-to-client
handoff (`toJSON()` / `toQueryRef()`). Firestore supplies all four too, including
`onSnapshotResume()`.

So the gap is not data access. It is the subscription lifecycle, which no data
SDK can supply from outside React. `subscribe()` exists and nothing binds it:
`@tanstack-query-firebase/react` 2.1.1 ships `useDataConnectQuery` and
`useDataConnectMutation`, both one-shot, and `subscribe` appears **0** times in
that package (positive control: `executeQuery` appears 4 times in the same
module, so the search can return non-empty).

## Running it

```
cd spikes/data-connect-subscription
npm ci
npx tsc -p tsconfig.json     # expect exit 0
```

Pinned: `firebase` 12.19.0, which resolves `@firebase/data-connect` 0.7.4 and
`@firebase/firestore` 4.17.2. TypeScript 5.6.3, `@types/react` 19.0.0.

## What the typecheck does and does not prove

Mutation controls, with `tsc`'s exit captured directly rather than after a pipe:

| Mutation | Result |
| --- | --- |
| Baseline | exit 0 |
| `onNext: (res: number)` | exit 2, `TS2769` |
| `notAny: IsAny<D> = true` | exit 2, `TS2322` |
| `src: DataSource = 'BOGUS'` | exit 2, `TS2322` |
| **Remove `unsubscribe()` from the cleanup** | **exit 0** |

**The last row is the one worth knowing.** Deleting the teardown typechecks
clean, so "compiles under `strict`" says nothing about whether the lifecycle is
right, and the lifecycle is the entire point of the hook. The teardown, the
liveness guard and the re-subscribe key are backed by review only. That is the
other reason this is a branch rather than a number in a doc.

## Known limits

- Compile-time only. Nothing ran against a live backend.
- `subscribe()`'s semantics are uncharacterized: how it invalidates, whether it
  polls or pushes, and what it does on reconnect are unknown.
- No tests. ~60 lines is one competent implementation, not a floor.
- The `initialData` seam is a convenience over an SDK feature, not a capability
  nobody has.
