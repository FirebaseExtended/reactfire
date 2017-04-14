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

/**
 * Returns the display name for the provided component, used by things like React Dev Tools.
 *
 * @param {React.Component} Component The component whose display name to return.
 *
 * @return {string} The provide component's display name.
 */
export function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

// /**
//  * Returns the index of the key in the list. If an item with the key is not in the list, -1 is
//  * returned.
//  *
//  * @param {Array<any>} list A list of items.
//  * @param {string} key The key for which to search.
//  *
//  * @return {number} The index of the item which has the provided key or -1 if no items have the
//  * provided key.
//  */
// export function indexForKey(list, key) {
//   for (let i = 0, length = list.length; i < length; i++) {  // eslint-disable-line no-plusplus
//     if (list[i]['.key'] === key) {
//       return i;
//     }
//   }

//   /* istanbul ignore next */
//   return -1;
// }

// /**
//  * Creates a new record given a key-value pair.
//  *
//  * @param {string} key The new record's key.
//  * @param {any} value The new record's value.
//  *
//  * @return {Object} The new record.
//  */
// export function createRecord(key, value) {
//   let record = {};
//   if (typeof value === 'object' && value !== null) {
//     record = value;
//   } else {
//     record['.value'] = value;
//   }
//   record['.key'] = key;

//   return record;
// }
