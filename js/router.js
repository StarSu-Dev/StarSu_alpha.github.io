const Router = (() => {
  const routes = new Map();

  function on(path, handler) {
    routes.set(path, handler);
  }

  function resolve() {
    const hash = window.location.hash || "#/";
    const [path, query] = hash.replace(/^#/, "").split("?");
    const params = Object.fromEntries(new URLSearchParams(query || ""));
    const handler = routes.get(path) || routes.get("404");
    if (handler) {
      handler({ path, params });
    }
  }

  function init() {
    window.addEventListener("hashchange", resolve);
    resolve();
  }

  return { on, init };
})();

window.Router = Router;
