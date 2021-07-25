export function deepCompare<T>(item1: T, item2: T): boolean {
  if (typeof item1 !== typeof item2) {
    return false;
  }
  if (item1 === null || item1 === undefined) {
    return true;
  }
  if (item1 instanceof Array && item2 instanceof Array) {
    return deepCompareArrays(item1, item2);
  }
  if (item1 instanceof Date && item2 instanceof Date) {
    return item1.getTime() === item2.getTime();
  }
  if (item1 instanceof Object && item2 instanceof Object) {
    return deepCompareObjects(item1, item2);
  }
  return item1 === item2;
}

function deepCompareArrays<T>(array1: T[], array2: T[]): boolean {
  if (array1.length !== array2.length) {
    return false;
  }
  for (let i = 0; i < array1.length; i++) {
    if (!deepCompare(array1[i], array2[i])) {
      return false;
    }
  }
  return true;
}

function deepCompareObjects<T extends {}>(object1: T, object2: T): boolean {
  for (let property in object1) {
    if (object1.hasOwnProperty(property) && !object2.hasOwnProperty(property)) {
      return false;
    }
  }
  for (let property in object2) {
    if (object2.hasOwnProperty(property) && object1.hasOwnProperty(property)) {
      if (!deepCompare(object1[property], object2[property])) {
        return false;
      }
    } else if (object1.hasOwnProperty(property) !== object2.hasOwnProperty(property)) {
      return false;
    }
  }
  return true;
}
