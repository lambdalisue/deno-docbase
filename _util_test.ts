import { assertEquals } from "@std/assert";
import * as util from "./_util.ts";

Deno.test("toCamelCaseDeep", () => {
  const input: Record<string, unknown> = {
    snake_case: {
      nested_snake_case: 1,
      nested_snake_case_array: [
        {
          nested_snake_case: 2,
        },
      ],
    },
  };
  const expected = {
    snakeCase: {
      nestedSnakeCase: 1,
      nestedSnakeCaseArray: [
        {
          nestedSnakeCase: 2,
        },
      ],
    },
  };
  assertEquals(util.toCamelCaseDeep(input), expected);
});

Deno.test("toSnakeCaseDeep", () => {
  const input: Record<string, unknown> = {
    snakeCase: {
      nestedSnakeCase: 1,
      nestedSnakeCaseArray: [
        {
          nestedSnakeCase: 2,
        },
      ],
    },
  };
  const expected = {
    snake_case: {
      nested_snake_case: 1,
      nested_snake_case_array: [
        {
          nested_snake_case: 2,
        },
      ],
    },
  };
  assertEquals(util.toSnakeCaseDeep(input), expected);
});

Deno.test("compactValues", () => {
  const input = {
    a: 1,
    b: null,
    c: undefined,
  };
  const expected = {
    a: 1,
  };
  assertEquals(util.compactValues(input), expected);
});

Deno.test("stringifyValues", () => {
  const input = {
    a: 1,
    b: "2",
  };
  const expected = {
    a: "1",
    b: "2",
  };
  assertEquals(util.stringifyValues(input), expected);
});
