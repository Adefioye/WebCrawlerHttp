const { normalizedUrl, getURLsFromHTML } = require("./crawl");
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

test("getURLsFromHTML absolute", () => {
  const inputHTMLBody = `
    <html>
        <body>
            <a href="https://blog.boot.dev/path/">
                Boot.dev Blog
            </a>
        </body>
    </html>
    `;

  const inputBaseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://blog.boot.dev/path/"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML relative", () => {
  const inputHTMLBody = `
      <html>
          <body>
              <a href="/path/">
                  Boot.dev Blog
              </a>
          </body>
      </html>
      `;

  const inputBaseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://blog.boot.dev/path/"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML relative and absolute", () => {
  const inputHTMLBody = `
        <html>
            <body>
                <a href="/path1/">
                    Boot.dev Blog
                </a>
                <a href="https://blog.boot.dev/path2/">
                Boot.dev Blog
            </a>
            </body>
        </html>
        `;

  const inputBaseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [
    "https://blog.boot.dev/path1/",
    "https://blog.boot.dev/path2/",
  ];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML invalid", () => {
  const inputHTMLBody = `
          <html>
              <body>
                  <a href="invalid">
                      Boot.dev Blog
                  </a>
              </body>
          </html>
          `;

  const inputBaseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [];
  expect(actual).toEqual(expected);
});
