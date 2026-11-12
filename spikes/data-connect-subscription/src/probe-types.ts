import type { SubscriptionState } from './useDataConnectSubscription';
import type { DataSource } from 'firebase/data-connect';

// Assert Data flows through rather than collapsing to never/any.
type Extract_<T> = T extends SubscriptionState<infer D> ? D : never;
type IsAny<T> = 0 extends 1 & T ? true : false;
type IsNever<T> = [T] extends [never] ? true : false;

type D = Extract_<SubscriptionState<{ id: string }>>;

const notAny: IsAny<D> = false;
const notNever: IsNever<D> = false;
const realShape: D = { id: 'x' };

// source must be the real two-member union, not never.
const src: DataSource = 'CACHE';
const srcNotNever: IsNever<DataSource> = false;

export { notAny, notNever, realShape, src, srcNotNever };
