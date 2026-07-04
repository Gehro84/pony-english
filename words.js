// Wortschatz passend zu «Young World 3» (5. Klasse) und «Young World 4» (6. Klasse)
// Neue Wörter hinzufügen: einfach eine Zeile nach gleichem Muster ergänzen.
const WOERTER = [
  // ===== Young World 3 =====
  // Unit 1: Schools Around the World
  { de: "Schulfach", en: "subject", buch: 3, unit: 1 },
  { de: "Stundenplan", en: "timetable", buch: 3, unit: 1 },
  { de: "Schuluniform", en: "uniform", buch: 3, unit: 1 },
  { de: "Pause", en: "break", buch: 3, unit: 1 },
  { de: "lernen", en: "learn", buch: 3, unit: 1 },
  { de: "Klassenzimmer", en: "classroom", buch: 3, unit: 1 },
  { de: "Lehrerin, Lehrer", en: "teacher", buch: 3, unit: 1 },

  // Unit 2: Friendships
  { de: "Freund, Freundin", en: "friend", buch: 3, unit: 2 },
  { de: "lustig", en: "funny", buch: 3, unit: 2 },
  { de: "schüchtern", en: "shy", buch: 3, unit: 2 },
  { de: "nett", en: "kind", buch: 3, unit: 2 },
  { de: "zusammen", en: "together", buch: 3, unit: 2 },
  { de: "lachen", en: "laugh", buch: 3, unit: 2 },
  { de: "Geheimnis", en: "secret", buch: 3, unit: 2 },

  // Unit 3: Help
  { de: "helfen", en: "help", buch: 3, unit: 3 },
  { de: "Ärztin, Arzt", en: "doctor", buch: 3, unit: 3 },
  { de: "Feuer", en: "fire", buch: 3, unit: 3 },
  { de: "Unfall", en: "accident", buch: 3, unit: 3 },
  { de: "vorsichtig", en: "careful", buch: 3, unit: 3 },
  { de: "mutig", en: "brave", buch: 3, unit: 3 },
  { de: "Spital", en: "hospital", buch: 3, unit: 3 },

  // Unit 4: Festivals
  { de: "Geburtstag", en: "birthday", buch: 3, unit: 4 },
  { de: "Geschenk", en: "present", buch: 3, unit: 4 },
  { de: "Feuerwerk", en: "fireworks", buch: 3, unit: 4 },
  { de: "feiern", en: "celebrate", buch: 3, unit: 4 },
  { de: "Gast", en: "guest", buch: 3, unit: 4 },
  { de: "Kuchen", en: "cake", buch: 3, unit: 4 },

  // Unit 5: Sports & Games
  { de: "gewinnen", en: "win", buch: 3, unit: 5 },
  { de: "verlieren", en: "lose", buch: 3, unit: 5 },
  { de: "Mannschaft", en: "team", buch: 3, unit: 5 },
  { de: "werfen", en: "throw", buch: 3, unit: 5 },
  { de: "fangen", en: "catch", buch: 3, unit: 5 },
  { de: "springen", en: "jump", buch: 3, unit: 5 },
  { de: "schwimmen", en: "swim", buch: 3, unit: 5 },

  // ===== Young World 4 =====
  // Unit 1: The Way We Live
  { de: "aufstehen", en: "get up", buch: 4, unit: 1 },
  { de: "Frühstück", en: "breakfast", buch: 4, unit: 1 },
  { de: "Hausaufgaben", en: "homework", buch: 4, unit: 1 },
  { de: "Freizeit", en: "free time", buch: 4, unit: 1 },
  { de: "immer", en: "always", buch: 4, unit: 1 },
  { de: "nie", en: "never", buch: 4, unit: 1 },
  { de: "Dorf", en: "village", buch: 4, unit: 1 },
  { de: "Stadt", en: "town", buch: 4, unit: 1 },

  // Unit 2: Fascinating Animal Facts
  { de: "Pferd", en: "horse", buch: 4, unit: 2 },
  { de: "gefährlich", en: "dangerous", buch: 4, unit: 2 },
  { de: "Flügel", en: "wings", buch: 4, unit: 2 },
  { de: "Schwanz", en: "tail", buch: 4, unit: 2 },
  { de: "Fell", en: "fur", buch: 4, unit: 2 },
  { de: "jagen", en: "hunt", buch: 4, unit: 2 },
  { de: "schnell", en: "fast", buch: 4, unit: 2 },
  { de: "Eier legen", en: "lay eggs", buch: 4, unit: 2 },

  // Unit 3: Yesterday & Today
  { de: "gestern", en: "yesterday", buch: 4, unit: 3 },
  { de: "altmodisch", en: "old-fashioned", buch: 4, unit: 3 },
  { de: "Grosseltern", en: "grandparents", buch: 4, unit: 3 },
  { de: "Kerze", en: "candle", buch: 4, unit: 3 },
  { de: "Geschichte", en: "history", buch: 4, unit: 3 },
  { de: "erfunden", en: "invented", buch: 4, unit: 3 },
  { de: "Waschmaschine", en: "washing machine", buch: 4, unit: 3 },

  // Unit 4: The Call of the Alps
  { de: "Berg", en: "mountain", buch: 4, unit: 4 },
  { de: "wandern", en: "hike", buch: 4, unit: 4 },
  { de: "Kuh", en: "cow", buch: 4, unit: 4 },
  { de: "Käse", en: "cheese", buch: 4, unit: 4 },
  { de: "Tal", en: "valley", buch: 4, unit: 4 },
  { de: "Schnee", en: "snow", buch: 4, unit: 4 },
  { de: "Gipfel", en: "peak", buch: 4, unit: 4 },
  { de: "Hütte", en: "hut", buch: 4, unit: 4 },

  // Unit 5: The Story of Chocolate
  { de: "Schokolade", en: "chocolate", buch: 4, unit: 5 },
  { de: "süss", en: "sweet", buch: 4, unit: 5 },
  { de: "Milch", en: "milk", buch: 4, unit: 5 },
  { de: "Zucker", en: "sugar", buch: 4, unit: 5 },
  { de: "Bohne", en: "bean", buch: 4, unit: 5 },
  { de: "Fabrik", en: "factory", buch: 4, unit: 5 },
  { de: "schmecken", en: "taste", buch: 4, unit: 5 },
  { de: "fein, lecker", en: "delicious", buch: 4, unit: 5 },
];
