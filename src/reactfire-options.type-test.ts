/**
 * Type-level regression tests for ReactFireOptions<T> generic constraints.
 * Checked by `tsc --noEmit` in CI. No runtime behavior — not bundled.
 */
import type { ReactFireOptions } from './index';

// ---- initialData must match T ----

void ((): ReactFireOptions<string> => ({ initialData: 'hello' }))();
void ((): ReactFireOptions<number> => ({ initialData: 42 }))();

// @ts-expect-error initialData must be T, not a different type
const _wrongInitialData: ReactFireOptions<string> = { initialData: 123 };
void _wrongInitialData;

// @ts-expect-error startWithValue must be T, not a different type
const _wrongStartWithValue: ReactFireOptions<string> = { startWithValue: 123 };
void _wrongStartWithValue;

// ---- snapshot hooks take the snapshot, data hooks take the data (#741) ----
//
// Removing `T | any` also removed what was masking a mismatch: the raw snapshot
// hooks resolve to a DocumentSnapshot/QuerySnapshot, so that is what a correct
// initialData is. Without the hook-level fix, seeding them with a snapshot (the
// only value you can actually have) stops compiling.

import type { DocumentReference, DocumentSnapshot, Query, QuerySnapshot } from 'firebase/firestore';
import type { useFirestoreCollection, useFirestoreDoc, useFirestoreDocData } from './firestore';

declare const ref: DocumentReference<{ a: string }>;
declare const query: Query<{ a: string }>;
declare const snap: DocumentSnapshot<{ a: string }>;
declare const querySnap: QuerySnapshot<{ a: string }>;
declare const docHook: typeof useFirestoreDoc;
declare const collectionHook: typeof useFirestoreCollection;
declare const dataHook: typeof useFirestoreDocData;

void (() => docHook(ref, { initialData: snap }));
void (() => collectionHook(query, { initialData: querySnap }));
void (() => dataHook(ref, { initialData: { a: 'x' } }));

// @ts-expect-error a snapshot hook must not accept the unwrapped data type
void (() => docHook(ref, { initialData: { a: 'x' } }));

// @ts-expect-error a data hook must not accept a snapshot
void (() => dataHook(ref, { initialData: snap }));
