const { normalizedUrl } = require("./crawl");
const { test, expect } = require("@jest/globals");

test("normalizedUrl strip protocol", () => {
  const input = "https://blog.boot.dev/path";
  const actual = normalizedUrl(input);
  const expected = "blog.boot.dev/path";

  expect(actual).toEqual(expected);
});

test("normalizedUrl strip trailing slash", () => {
  const input = "https://blog.boot.dev/path/";
  const actual = normalizedUrl(input);
  const expected = "blog.boot.dev/path";

  expect(actual).toEqual(expected);
});

test("normalizedUrl lower case capitals", () => {
  const input = "https://BLOG.boot.dev/path/";
  const actual = normalizedUrl(input);
  const expected = "blog.boot.dev/path";

  expect(actual).toEqual(expected);
});

test("normalizedUrl strip http(s)", () => {
  const input = "https://blog.boot.dev/path/";
  const actual = normalizedUrl(input);
  const expected = "blog.boot.dev/path";

  expect(actual).toEqual(expected);
});
