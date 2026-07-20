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

// @ts-expect-error startWithValue must be T, not a different type
const _wrongStartWithValue: ReactFireOptions<string> = { startWithValue: 123 };
