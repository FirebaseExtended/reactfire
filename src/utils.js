/**
 * Returns whether or not the provided input is a JavaScript function.
 *
 * @param {any} input The input being tested.
 *
 * @return {boolean} Whether or not the provided input is a JavaScript function.
 */
export function isFunction(input) {
  return typeof input === 'function';
}

/**
 * Returns whether or not the provided input is a non-null JavaScript object.
 *
 * @param {any} input The input being tested.
 *
 * @return {boolean} Whether or not the provided input is a non-null JavaScript object.
 */
export function isNonNullObject(input) {
  return Object.prototype.toString.call(input) === '[object Object]';
}

/**
 * Returns whether or not the provided input is a Firebase Database Reference.
 *
 * @param {any} input The input being tested.
 *
 * @return {boolean} Whether or not the provided input is a Firebase Database Reference.
 */
export function isDatabaseReference(input) {
  return isNonNullObject(input) &&
    typeof input.ref === 'object' &&
    typeof input.on === 'function' &&
    typeof input.set === 'function' &&
    typeof input.once === 'function' &&
    typeof input.transaction === 'function';
}

/**
 * Returns whether or not the provided input is a Firebase Database Query.
 *
 * @param {any} input The input being tested.
 *
 * @return {boolean} Whether or not the provided input is a Firebase Database Query.
 */
export function isDatabaseQuery(input) {
  return isNonNullObject(input) &&
    typeof input.ref === 'object' &&
    typeof input.on === 'function' &&
    typeof input.once === 'function' &&
    typeof input.endAt === 'function' &&
    typeof input.orderByChild === 'function';
}

/**
 * Returns whether or not the provided input is either a Firebase Database Reference or a Firebase
 * Database Query.
 *
 * @param {any} input The input being tested.
 *
 * @return {boolean} Whether or not the provided input is either a Firebase Database Reference or
 * a Firebase Database Query.
 */
export function isDatabaseReferenceOrQuery(input) {
  return isDatabaseReference(input) || isDatabaseQuery(input);
}

/**
 * Returns whether or not the provided input is a Firebase App.
 *
 * @param {any} input The input being tested.
 *
 * @return {boolean} Whether or not the provided input is a Firebase App.
 */
export function isFirebaseApp(input) {
  return isNonNullObject(input) &&
    typeof input.name === 'string' &&
    typeof input.options === 'object' &&
    typeof input.delete === 'function';
}

/**
 * Returns whether or not the provided input is a React component.
 *
 * @param {any} input The input being tested.
 *
 * @return {boolean} Whether or not the provided input is a React component.
 */
export function isReactComponent(input) {
  return isNonNullObject(input) || isFunction(input);
}
