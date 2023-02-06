function normalizedUrl(urlString) {
  const newUrl = new URL(urlString);
  const pathName = `${newUrl.hostname}${newUrl.pathname}`;

  console.log(newUrl.hostname);
  console.log(newUrl.pathname);

  if (pathName.length > 0 && pathName.slice(-1) === "/") {
    return pathName.slice(0, -1);
  }

  return pathName;
}

module.exports = {
  normalizedUrl,
};
