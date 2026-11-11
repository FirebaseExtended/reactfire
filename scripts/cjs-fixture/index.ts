import { useUser } from 'reactfire';

// `true` only when `status` is the real union: an `any` from a failed resolution makes this `never`.
export const typed: 'not-a-status' extends ReturnType<typeof useUser>['status'] ? never : true = true;
