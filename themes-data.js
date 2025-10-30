const themesData = {
  list: [
    { id: "soldier", name: "Солдат", description: "Боевой опыт и дисциплина." },
    {
      id: "explorer",
      name: "Исследователь",
      description: "Путешествия и открытие новых миров.",
    },
    // ...
  ],
  details: {
    soldier: {
      name: "Солдат",
      description: "Вы прошли через огонь, воду и медные трубы...",
      traits: [
        { name: "Боевой инстинкт", value: "+1 к атаке в первом раунде боя." },
      ],
      links: [{ name: "Core Rulebook", url: "#" }],
    },
  },
};
