import isEqual from "lodash/isEqual";
import { default as baseOmit } from "lodash/omit";

/**
 *
 */
export function isDeepEqual(a: object, b: object) {
  return isEqual(a, b);
}

/**
 *
 */
export function omit<O extends object, K extends keyof O>(
  obj: O,
  paths: Array<K>
) {
  return baseOmit(obj, paths);
}
