export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/") {
      return env.ASSETS.fetch(new Request(url.toString() + "index.html"));
    }

    // Decode the pathname to handle special characters
    const decodedPathname = decodeURIComponent(url.pathname);
    const newUrl = new URL(url.origin + decodedPathname);
    return env.ASSETS.fetch(new Request(newUrl));
  },
};
