import { SortOrderEnum, SortTypeEnum, CharacterData } from "../types";

// Creates a sorting predicate to sort for some property
export const byProp =
  (propSelector: Function) =>
  (a: CharacterData, b: CharacterData): number => {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    const aProp = propSelector(a);
    const bProp = propSelector(b);

    if (aProp < bProp) {
      return -1;
    }

    if (aProp > bProp) {
      return 1;
    }

    return 0;
  };

// Creates a value to be used for sorting
export const createSortValue = (
  sortBy: SortTypeEnum,
  sortOrder: SortOrderEnum
): string => {
  return `${sortBy}-${sortOrder}`;
};

/**
 * Sorts an array of objects by a given key. If a drilled-down key is needed,
 * simply provide the path to the key as a string (ex. "key.subkey") and the
 * function will handle the rest.
 **/
export const orderBy = (
  arr: Array<any>,
  key?: string,
  sort: "asc" | "desc" = "asc"
) => {
  const getKey = (obj: any) => {
    if (key) {
      if (key.includes(".")) {
        const arr = key.split(".");
        return arr.reduce((acc, curr) => {
          return acc[curr];
        }, obj);
      } else {
        return obj[key];
      }
    } else {
      return;
    }
  };

  const handleSort = (valA: object, valB: object) => {
    // If a key is provided, sort by that
    if (key) {
      // Get values to compare
      const a = getKey(valA);
      const b = getKey(valB);
      // If the values are strings, compare them alphabetically
      if (a < b) return sort === "asc" ? -1 : 1;
      if (b < a) return sort === "asc" ? 1 : -1;
    }
    // Otherwise, sort by the object itself
    return 0;
  };
  // Return a new array with the sorted values
  return arr.concat().sort(handleSort);
};

/**
 * Separates a single array of objects into two separate arrays based on
 * whether or not they include a query or not. If a key is provided, the
 * function will look for the query by that key. If the key is nested, it will
 * handle that as well. The function will return both the items which match and
 * the ones that don't as separate arrays to be used as needed.
 **/
export const sortByMatch = (
  arr: Array<any>,
  query: string,
  key: string = "name",
  exact: boolean = false
) => {
  // If a key is provided, drill down until that key is found
  const getKey = (obj: any) => {
    if (key) {
      if (key.includes(".")) {
        const arr = key.split(".");
        return arr.reduce((acc, curr) => {
          return acc[curr];
        }, obj);
      } else {
        return obj[key];
      }
    } else {
      return;
    }
  };

  // Create empty arrays to store the objects
  let arrA: Array<any> = [];
  let arrB: Array<any> = [];

  // Loop through the provided array and separate the objects
  arr.forEach((item) => {
    if (exact) {
      if (getKey(item) === query) {
        arrA.push(item);
      } else {
        arrB.push(item);
      }
    } else {
      if (getKey(item).includes(query)) {
        arrA.push(item);
      } else {
        arrB.push(item);
      }
    }
  });

  // Return a new array with the sorted values
  return [arrA, arrB];
};

export const sortObjectByKeys = (val: object, dir: "asc" | "desc" = "asc") => {
  const sortFn = (a, b) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    return dir === "asc" ? numA - numB : numB - numA;
  };

  const sorted = Object.keys(val)
    .sort(sortFn)
    .reduce((obj, key) => {
      obj[key] = val[key];
      return obj;
    }, {});

  return sorted;
};
