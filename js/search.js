const Search = (() => {
  let index = [];

  function buildIndex(sectionKey, records) {
    for (const r of records) {
      index.push({
        section: sectionKey,
        id: r.id,
        name: r.name,
        text: [r.name, r.description, r.type, r.traits]
          .filter(Boolean)
          .join(" ")
          .toLowerCase(),
        raw: r,
      });
    }
  }

  function query(q) {
    if (!q) {
      return [];
    }
    const parts = q.toLowerCase().split(/\s+/).filter(Boolean);
    return index
      .map((doc) => ({
        doc,
        score: parts.reduce((s, p) => s + (doc.text.includes(p) ? 1 : 0), 0),
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 50)
      .map((x) => x.doc);
  }

  return { buildIndex, query };
})();

window.Search = Search;
