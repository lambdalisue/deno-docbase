import { isRecord } from "@core/unknownutil/is/record";
import { isArray } from "@core/unknownutil/is/array";
import { isString } from "@core/unknownutil/is/string";
import { toCamelCase } from "@std/text/to-camel-case";
import { toSnakeCase } from "@std/text/to-snake-case";
import { mapEntries } from "@std/collections/map-entries";
import { filterValues } from "@std/collections/filter-values";
import { mapValues } from "@std/collections/map-values";

export function toCamelCaseDeep<T>(v: T): T {
  if (isRecord(v)) {
    return mapEntries(
      v,
      ([k, v]) => [isString(k) ? toCamelCase(k) : k, toCamelCaseDeep(v)],
    ) as T;
  } else if (isArray(v)) {
    return v.map(toCamelCaseDeep) as T;
  }
  return v;
}

export function toSnakeCaseDeep<T>(v: T): T {
  if (isRecord(v)) {
    return mapEntries(
      v,
      ([k, v]) => [isString(k) ? toSnakeCase(k) : k, toSnakeCaseDeep(v)],
    ) as T;
  } else if (isArray(v)) {
    return v.map(toSnakeCaseDeep) as T;
  }
  return v;
}

export function compactValues<T>(
  v: Record<string, T>,
): Record<string, NonNullable<T>> {
  return filterValues(v, (v) => v != null) as Record<string, NonNullable<T>>;
}

export function stringifyValues<T extends { toString: () => string }>(
  v: Record<string, T>,
): Record<string, string> {
  return mapValues(v, (v) => v.toString());
}
