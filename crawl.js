const { JSDOM } = require("jsdom");

async function crawlPage(baseURL, currentURL, pages) {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);

  // if current page is offsite, Bail immediately
  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }

  const normalizedURL = normalizedUrl(currentURL);

  // IF page has been visited, increase the count and don't repeat
  if (pages[normalizedURL] > 0) {
    pages[normalizedURL]++;
    return pages;
  }

  // Initialize this page in the map
  pages[normalizedURL] = 1;

  // Fetch and parse the HTML document
  console.log(`Actively crawling on: ${currentURL}`);

  try {
    const resp = await fetch(currentURL);

    if (resp.status > 399) {
      console.log(`Got HTTP error, status code: ${resp.status}`);
      return pages;
    }

    const contentType = resp.headers.get("content-type");

    if (!contentType.includes("text/html")) {
      console.log(
        `Non html response: content type: ${contentType}, on page: ${currentURL}`
      );
      return pages;
    }

    const htmlBody = await resp.text();
    // console.log(htmlBody);
    const nextURLs = getURLsFromHTML(htmlBody, baseURL);
    for (const nextURL of nextURLs) {
      pages = crawlPage(baseURL, nextURL, pages);
    }
  } catch (error) {
    console.log(`Error on fetch: ${error.message}, on page: ${currentURL}`);
  }

  return pages;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");

  //   console.log(linkElements);
  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === "/") {
      // Relative
      try {
        // const fullPath = `${baseURL}${linkElement.href}`;
        // const urlObj = new URL(fullPath);
        urls.push(new URL(linkElement.href, baseURL).href);
      } catch (error) {
        console.log(`Error with relative URL: ${error.message}`);
      }
    } else {
      // Absolute
      try {
        // const fullPath = linkElement.href;
        // const urlObj = new URL(fullPath);
        urls.push(new URL(linkElement.href).href);
      } catch (error) {
        console.log(`Error with absolute URL: ${error.message}`);
      }
    }
  }
  return urls;
}

function normalizedUrl(urlString) {
  const urlObj = new URL(urlString);
  const fullPath = `${urlObj.host}${urlObj.pathname}`;

  if (fullPath.length > 0 && fullPath.slice(-1) === "/") {
    return fullPath.slice(0, -1);
  }

  return fullPath;
}

module.exports = {
  normalizedUrl,
  getURLsFromHTML,
  crawlPage,
};
