// === КНОПКА СМЕНЫ ТЕМЫ ===
const themeBtnMain = document.createElement("button");
themeBtnMain.className = "theme-toggle-btn";

themeBtnMain.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-mode") ? "dark" : "light"
  );
});

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
}

// === ДАННЫЕ ЗАГРУЖАЮТСЯ ИЗ ВНЕШНИХ ФАЙЛОВ ===
// Предполагается, что все *-data.js уже подключены в HTML
const data = {
  races: racesData.list,
  classes: classesData.list,
  themes: themesData.list,
  traits: traitsData.list,
  equipment: equipmentData.list,
};

const details = {
  ...racesData.details,
  ...classesData.details,
  ...themesData.details,
  ...traitsData.details,
  ...equipmentData.details,
};

// === ФУНКЦИИ РЕНДЕРИНГА ===

function showHome() {
  const mainContent = document.querySelector(".main-content");
  mainContent.innerHTML = `
    <h1>Starfinder Справочник</h1>
    <p>Добро пожаловать в справочник по вселенной Starfinder. Выберите интересующую вас категорию.</p>
    <div class="cards-container">
      <div class="card" data-section="races">
        <h3>Расы</h3>
        <p>Узнайте о различных расах, доступных персонажам.</p>
      </div>
      <div class="card" data-section="classes">
        <h3>Классы</h3>
        <p>Описание всех классов и их особенностей.</p>
      </div>
      <div class="card" data-section="themes">
        <h3>Темы</h3>
        <p>Фоновые истории и бонусы от тем.</p>
      </div>
      <div class="card" data-section="traits">
        <h3>Черты</h3>
        <p>Уникальные способности и особенности персонажа.</p>
      </div>
      <div class="card" data-section="equipment">
        <h3>Снаряжение</h3>
        <p>Оружие, броня, гаджеты и магические предметы.</p>
      </div>
    </div>
  `;
  mainContent.appendChild(themeBtnMain);
}

function renderCards(items) {
  const container = document.querySelector(".cards-container");
  container.innerHTML = "";
  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-section", item.id);
    card.setAttribute("data-id", item.id);
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <small class="card-source">${item.source}</small>
    `;
    container.appendChild(card);
  });
}

function showSection(sectionName) {
  const items = data[sectionName];
  if (!items) return;

  const mainContent = document.querySelector(".main-content");
  mainContent.innerHTML = `
    <h1>${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}</h1>
    <div class="cards-container"></div>
  `;
  mainContent.appendChild(themeBtnMain);
  renderCards(items);
}

function showDetail(detailId) {
  const detail = details[detailId];
  if (!detail) return;

  const mainContent = document.querySelector(".main-content");
  let tableHTML = "";
  if (detail.table) {
    const headers = detail.table[0];
    const rows = detail.table.slice(1);
    tableHTML = `<table>
      <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
      <tbody>${rows
        .map(
          (row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`
        )
        .join("")}</tbody>
    </table>`;
  }

  let traitsHTML = detail.traits
    ? "<h3>Особенности</h3><ul>" +
      detail.traits
        .map((t) => `<li><strong>${t.name}:</strong> ${t.value}</li>`)
        .join("") +
      "</ul>"
    : "";
  let propertiesHTML = detail.properties
    ? "<h3>Свойства</h3><ul>" +
      detail.properties
        .map((p) => `<li><strong>${p.name}:</strong> ${p.value}</li>`)
        .join("") +
      "</ul>"
    : "";
  let abilitiesHTML = detail.abilities
    ? "<h3>Способности</h3><ul>" +
      detail.abilities
        .map((a) => `<li><strong>${a.name}:</strong> ${a.description}</li>`)
        .join("") +
      "</ul>"
    : "";
  let statsHTML = detail.stats
    ? `<pre class="race-stats">${detail.stats}</pre>`
    : "";
  let loreHTML = detail.lore
    ? `<h3>Описание</h3><p>${detail.lore.replace(/\n/g, "<br>")}</p>`
    : "";
  let linksHTML = detail.links
    ? "<h3>Ссылки</h3><ul>" +
      detail.links
        .map((l) => `<li><a href="${l.url}" target="_blank">${l.name}</a></li>`)
        .join("") +
      "</ul>"
    : "";

  mainContent.innerHTML = `
    <div class="detail-content">
      <h2>${detail.name}</h2>
      <p>${detail.description}</p>
      ${statsHTML}
      ${tableHTML}
      ${traitsHTML}
      ${propertiesHTML}
      ${abilitiesHTML}
      ${loreHTML}
      ${linksHTML}
    </div>
  `;
  mainContent.appendChild(themeBtnMain);
}

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener("DOMContentLoaded", () => {
  const mainContent = document.getElementById("main-content");
  mainContent.appendChild(themeBtnMain);
});

// === САЙДБАР ===
document.addEventListener("click", (e) => {
  if (e.target.id === "sidebar-toggle") {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("hidden");
    return;
  }

  const target = e.target.closest("[data-section]");
  if (target) {
    e.preventDefault();
    const section = target.getAttribute("data-section");
    const id = target.getAttribute("data-id");

    if (section === "home") {
      showHome();
    } else if (id && details[id]) {
      showDetail(id);
    } else {
      showSection(section);
    }

    // Закрывать сайдбар ТОЛЬКО на мобильных
    if (window.innerWidth <= 768) {
      document.getElementById("sidebar").classList.add("hidden");
    }
  }
});
