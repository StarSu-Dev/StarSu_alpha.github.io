(function () {
  const app = document.getElementById("app");
  const searchInput = document.getElementById("globalSearch");
  const themeToggle = document.getElementById("themeToggle");

  // theme
  const userTheme = localStorage.getItem("starsu-theme") || "dark";
  document.documentElement.setAttribute("data-theme", userTheme);
  themeToggle.addEventListener("click", () => {
    const next =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("starsu-theme", next);
  });

  // data cache
  const cache = new Map();
  async function load(section) {
    if (cache.has(section.key)) return cache.get(section.key);
    const resp = await fetch(section.data);
    const json = await resp.json();
    cache.set(section.key, json);
    Search.buildIndex(section.key, json);
    return json;
  }

  // search
  function renderSearchResults(query) {
    const results = Search.query(query);
    app.innerHTML = `<h2 class="section-title">Поиск: ${query}</h2><div class="grid" id="sr"></div>`;
    const sr = app.querySelector("#sr");
    for (const r of results) {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<h3>${r.name}</h3><div class="muted">${r.section}</div>`;
      card.addEventListener("click", () => {
        window.location.hash = `#/${r.section}/${encodeURIComponent(
          r.raw.slug || r.id
        )}`;
      });
      sr.appendChild(card);
    }
  }

  let searchDebounce;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchDebounce);
    const q = searchInput.value.trim();
    if (!q) {
      return;
    }
    searchDebounce = setTimeout(() => renderSearchResults(q), 120);
  });

  // sidebar
  const sidebar = document.getElementById("sidebar");
  function buildSidebar() {
    const groups = VaultManifest.categories
      .map((cat) => {
        const items = cat.files
          .map(
            (f) =>
              `<a href="#/vault/${encodeURIComponent(
                cat.key
              )}/${encodeURIComponent(f.file)}">${f.title}</a>`
          )
          .join("\n");
        return `<div class="group"><details><summary>${cat.key}</summary>${items}</details></div>`;
      })
      .join("\n");
    sidebar.innerHTML = groups;
  }
  buildSidebar();

  // routes
  Router.on("/", (ctx) => {
    Renderers.renderHome(app);
  });

  for (const section of StarSuConfig.sections) {
    // JSON list/detail sections
    if (section.data) {
      Router.on(`/${section.key}`, async () => {
        const data = await load(section);
        Renderers.renderList(app, section.title, data, {
          route: section.key,
          pillKey: "type",
          subtitleKey: "source",
        });
      });
      Router.on(`/${section.key}/:id`, async (ctx) => {
        const data = await load(section);
        const id = decodeURIComponent(
          (window.location.hash || "").split("/").pop()
        );
        const item = data.find((x) => String(x.id) === id || x.slug === id);
        if (item) {
          Renderers.renderDetails(app, section.title, item);
        } else {
          app.innerHTML = "<p>Не найдено</p>";
        }
      });
    }

    // Markdown sections defined directly
    if (section.md) {
      Router.on(`/${section.key}`, async () => {
        const resp = await fetch(section.md);
        const text = await resp.text();
        app.innerHTML = `<h2 class="section-title">${section.title}</h2><div class="card" id="md"></div>`;
        const md = app.querySelector("#md");
        md.innerHTML = Markdown.parse(text);
      });
    }
  }

  // Vault dynamic routes
  Router.on(`/vault/:cat/:file`, async () => {
    const parts = (window.location.hash || "").replace(/^#\//, "").split("/");
    const cat = decodeURIComponent(parts[1] || "");
    const file = decodeURIComponent(parts.slice(2).join("/") || "");
    const category = VaultManifest.categories.find((c) => c.key === cat);
    if (!category) {
      app.innerHTML = "<p>Раздел не найден</p>";
      return;
    }
    const url = `${category.base}/${file}`;
    try {
      const resp = await fetch(url);
      const text = await resp.text();
      app.innerHTML = `<h2 class="section-title">${cat}</h2><div class="card" id="md"></div>`;
      const md = app.querySelector("#md");
      md.innerHTML = Markdown.parse(text);
    } catch (e) {
      app.innerHTML = "<p>Файл не найден</p>";
    }
  });

  Router.on("404", () => {
    app.textContent = "Страница не найдена";
  });
  Router.init();
})();
