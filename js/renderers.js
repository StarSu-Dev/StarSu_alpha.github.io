const Renderers = (() => {
  function renderHome(root) {
    root.innerHTML = `
			<h2 class="section-title">Добро пожаловать в StarSu‑Lite</h2>
			<p class="muted">Быстрый онлайн‑справочник по Starfinder</p>
			<div class="grid" id="homeCards"></div>
		`;
    const container = root.querySelector("#homeCards");
    for (const section of window.StarSuConfig.sections) {
      const el = document.createElement("div");
      el.className = "card";
      el.innerHTML = `<h3>${section.title}</h3><p class="muted">Раздел: ${section.key}</p><a href="#/${section.key}">Открыть →</a>`;
      container.appendChild(el);
    }
  }

  function renderList(root, title, items, opts) {
    const { pillKey, subtitleKey } = opts || {};
    root.innerHTML = `
			<h2 class="section-title">${title}</h2>
			<div class="grid" id="list"></div>
		`;
    const list = root.querySelector("#list");
    for (const item of items) {
      const card = document.createElement("div");
      card.className = "card";
      const pill =
        pillKey && item[pillKey]
          ? `<span class="pill">${item[pillKey]}</span>`
          : "";
      const sub =
        subtitleKey && item[subtitleKey]
          ? `<div class="muted">${item[subtitleKey]}</div>`
          : "";
      card.innerHTML = `<h3>${item.name}</h3>${sub}${pill}`;
      card.addEventListener("click", () => {
        window.location.hash = `#/${opts.route}/${encodeURIComponent(
          item.slug || item.id
        )}`;
      });
      list.appendChild(card);
    }
  }

  function renderDetails(root, title, item) {
    root.innerHTML = `
			<h2 class="section-title">${title}: ${item.name}</h2>
			<div class="card">
				<div class="muted">ID: ${item.id}</div>
				<div id="details"></div>
			</div>
		`;
    const details = root.querySelector("#details");
    const pre = document.createElement("pre");
    pre.textContent = JSON.stringify(item, null, 2);
    details.appendChild(pre);
  }

  return { renderHome, renderList, renderDetails };
})();

window.Renderers = Renderers;
