/**
 * transform object into string joining keys that have truthy values
 */
export const truthyKeysToString = (value: object): string =>
  Object.entries(value)
    .filter((entry) => entry[1])
    .map((entry) => entry[0])
    .join(' ');
