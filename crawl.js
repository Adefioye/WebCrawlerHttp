const { JSDOM } = require("jsdom");

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === "/") {
      // Relative
      try {
        const urlString = `${baseURL}${linkElement.href}`;
        const url = new URL(urlString);
        urls.push(urlString);
      } catch (error) {
        console.log(`Error with relative URL: ${error.message}`);
      }
    } else {
      // Absolute
      try {
        const urlString = linkElement.href;
        const url = new URL(urlString);
        urls.push(urlString);
      } catch (error) {
        console.log(`Error with absolute URL: ${error.message}`);
      }
    }
  }
  return urls;
}

function normalizedUrl(urlString) {
  const newUrl = new URL(urlString);
  const pathName = `${newUrl.hostname}${newUrl.pathname}`;

  if (pathName.length > 0 && pathName.slice(-1) === "/") {
    return pathName.slice(0, -1);
  }

  return pathName;
}

module.exports = {
  normalizedUrl,
  getURLsFromHTML,
};
