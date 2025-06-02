export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/") {
      return env.ASSETS.fetch(new Request(url.toString() + "index.html"));
    }

    return env.ASSETS.fetch(request);
  },
};
