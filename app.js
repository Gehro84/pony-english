// Gespeicherte XP laden – beim allerersten Start gibt es noch nichts, dann 0
let xp = Number(localStorage.getItem("xp")) || 0;

const XP_PRO_LEVEL = 100;

function aktuellesLevel() {
  return Math.floor(xp / XP_PRO_LEVEL) + 1;
}

// Zeigt Level, XP-Zahl und Fortschrittsbalken an
function anzeigen() {
  const level = aktuellesLevel();
  const rest = xp % XP_PRO_LEVEL;
  document.getElementById("level").textContent = "Level " + level;
  document.getElementById("xp-text").textContent = rest + " / " + XP_PRO_LEVEL + " XP";
  document.getElementById("xp-fill").style.width = (rest / XP_PRO_LEVEL) * 100 + "%";
}

// Blendet genau einen Bildschirm ein, alle anderen aus
function zeigeBildschirm(id) {
  for (const s of document.querySelectorAll("main section")) {
    s.hidden = s.id !== id;
  }
  if (id === "home-screen") startseiteAktualisieren();
}

// ----- Tages-Challenge -----
function gestern() {
  return new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
}

function startseiteAktualisieren() {
  const datum = localStorage.getItem("challengeDatum");

  // Serie gerissen? (letzte Challenge weder heute noch gestern)
  if (datum !== new Date().toDateString() && datum !== gestern()) {
    localStorage.setItem("streak", "0");
  }

  const geschafft = datum === new Date().toDateString();
  const btn = document.getElementById("challenge-btn");
  btn.disabled = geschafft;
  btn.textContent = geschafft
    ? "✅ Challenge geschafft – bis morgen!"
    : "⭐ Tages-Challenge (doppelte XP)";

  const streak = Number(localStorage.getItem("streak")) || 0;
  document.getElementById("streak").textContent =
    streak > 0 ? "🔥 " + streak + " Tage-Serie" : "";
}

function challengeGeschafft() {
  // Serie verlängern, wenn gestern auch gespielt wurde – sonst neu bei 1
  const streak =
    localStorage.getItem("challengeDatum") === gestern()
      ? Number(localStorage.getItem("streak")) + 1
      : 1;
  localStorage.setItem("streak", streak);
  localStorage.setItem("challengeDatum", new Date().toDateString());
}

// ----- Kleine Effekte -----
function konfetti() {
  const farben = ["#facc15", "#22c55e", "#3b82f6", "#ec4899", "#a855f7", "#f97316"];
  for (let i = 0; i < 80; i++) {
    const stueck = document.createElement("div");
    stueck.className = "confetti";
    stueck.style.left = Math.random() * 98 + "vw";
    stueck.style.background = farben[Math.floor(Math.random() * farben.length)];
    stueck.style.animationDelay = Math.random() * 0.8 + "s";
    document.body.appendChild(stueck);
    setTimeout(() => stueck.remove(), 3500); // aufräumen, wenn es unten ist
  }
}

// Spielt kurze Töne direkt im Browser ab – ganz ohne Sound-Dateien
function ton(frequenzen) {
  try {
    const audio = new AudioContext();
    frequenzen.forEach((f, i) => {
      const start = audio.currentTime + i * 0.12;
      const osc = audio.createOscillator();
      const lautstaerke = audio.createGain();
      osc.type = "triangle";
      osc.frequency.value = f;
      lautstaerke.gain.setValueAtTime(0.15, start);
      lautstaerke.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
      osc.connect(lautstaerke).connect(audio.destination);
      osc.start(start);
      osc.stop(start + 0.3);
    });
    setTimeout(() => audio.close(), 1500);
  } catch (e) {
    // Kein Ton möglich? Kein Problem – die App läuft trotzdem.
  }
}

// ----- Spaced Repetition (Karteikästchen-Prinzip) -----
// Pro Wort merken wir das Kästchen (0-4) und wann es wieder dran ist.
// Richtig: ein Kästchen weiter, Pause wird länger. Falsch: zurück auf Kästchen 0.
const BOX_TAGE = [0, 1, 3, 7, 30]; // Wartezeit in Tagen pro Kästchen

let lernstand = JSON.parse(localStorage.getItem("lernstand")) || {};

function lernstandMerken(wortEn, istRichtig) {
  const eintrag = lernstand[wortEn] || { box: 0 };
  eintrag.box = istRichtig ? Math.min(eintrag.box + 1, BOX_TAGE.length - 1) : 0;
  eintrag.faellig = Date.now() + BOX_TAGE[eintrag.box] * 24 * 60 * 60 * 1000;
  lernstand[wortEn] = eintrag;
  localStorage.setItem("lernstand", JSON.stringify(lernstand));
}

// Wählt die Fragen der Runde: zuerst fällige Wiederholungen,
// dann neue Wörter, zuletzt die wackligsten der restlichen Wörter.
function fragenAuswaehlen() {
  const jetzt = Date.now();
  const mischen = (liste) => liste.sort(() => Math.random() - 0.5);
  const faellig = [], neu = [], rest = [];
  for (const w of WOERTER) {
    const s = lernstand[w.en];
    if (!s) neu.push(w);
    else if (s.faellig <= jetzt) faellig.push(w);
    else rest.push(w);
  }
  mischen(faellig);
  mischen(neu);
  mischen(rest).sort((a, b) => lernstand[a.en].box - lernstand[b.en].box);
  return [...faellig, ...neu, ...rest].slice(0, FRAGEN_PRO_RUNDE);
}

// ----- Quiz -----
const FRAGEN_PRO_RUNDE = 5;
const XP_PRO_RICHTIGE_ANTWORT = 10;

let fragen = [];   // die zufälligen Fragen der aktuellen Runde
let frageNr = 0;
let richtig = 0;
let levelVorRunde = 1; // um nach der Runde neue Pferde zu erkennen
let istChallenge = false;
let xpProAntwort = XP_PRO_RICHTIGE_ANTWORT;

function quizStarten(alsChallenge) {
  istChallenge = alsChallenge === true;
  xpProAntwort = istChallenge ? XP_PRO_RICHTIGE_ANTWORT * 2 : XP_PRO_RICHTIGE_ANTWORT;
  levelVorRunde = aktuellesLevel();
  fragen = fragenAuswaehlen();
  frageNr = 0;
  richtig = 0;
  zeigeBildschirm("quiz-screen");
  frageZeigen();
}

function frageZeigen() {
  const frage = fragen[frageNr];
  document.getElementById("quiz-progress").textContent =
    "Frage " + (frageNr + 1) + " von " + FRAGEN_PRO_RUNDE;
  document.getElementById("question").textContent =
    "Was heisst «" + frage.de + "» auf Englisch?";

  // 3 falsche Antworten aus den übrigen Wörtern ziehen, dann alle 4 mischen
  const falsche = WOERTER.filter((w) => w.en !== frage.en)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const antworten = [frage, ...falsche].sort(() => Math.random() - 0.5);

  const box = document.getElementById("answers");
  box.innerHTML = "";
  for (const a of antworten) {
    const btn = document.createElement("button");
    btn.className = "big-btn answer";
    btn.textContent = a.en;
    btn.onclick = () => antwortPruefen(btn, a.en === frage.en);
    box.appendChild(btn);
  }
}

function antwortPruefen(geklickterBtn, istRichtig) {
  lernstandMerken(fragen[frageNr].en, istRichtig);

  // Alle Buttons sperren und die richtige Antwort grün markieren
  for (const b of document.querySelectorAll(".answer")) {
    b.disabled = true;
    if (b.textContent === fragen[frageNr].en) b.classList.add("correct");
  }

  if (istRichtig) {
    richtig++;
    xp += xpProAntwort;
    localStorage.setItem("xp", xp);
    anzeigen();
    ton([523, 784]); // fröhliches "Pling"
  } else {
    geklickterBtn.classList.add("wrong");
    ton([196]); // tiefer "Brummer"
  }

  setTimeout(naechsteFrage, 1200); // kurz Zeit lassen, das Feedback zu sehen
}

function naechsteFrage() {
  frageNr++;
  if (frageNr < FRAGEN_PRO_RUNDE) {
    frageZeigen();
  } else {
    rundeBeenden();
  }
}

function rundeBeenden() {
  const titel =
    richtig === FRAGEN_PRO_RUNDE ? "🌟 Perfekt!" :
    richtig >= 3 ? "🎉 Super gemacht!" : "💪 Weiter üben!";
  document.getElementById("result-title").textContent =
    (istChallenge ? "⭐ " : "") + titel;
  document.getElementById("result-text").textContent =
    richtig + " von " + FRAGEN_PRO_RUNDE + " richtig – +" +
    richtig * xpProAntwort + " XP";

  if (istChallenge) challengeGeschafft();

  // Wurde durch den Level-Aufstieg ein neues Pferd freigeschaltet?
  const neuePferde = PFERDE.filter(
    (p) => p.level > levelVorRunde && p.level <= aktuellesLevel()
  );
  const box = document.getElementById("result-horse");
  box.hidden = neuePferde.length === 0;
  box.innerHTML = neuePferde
    .map((p) => '<div class="unlock-emoji">' + p.emoji + "</div><b>Neues Pferd: " + p.name + "!</b>")
    .join("");

  // Grosse Momente feiern: perfekte Runde oder neues Pferd
  if (richtig === FRAGEN_PRO_RUNDE || neuePferde.length > 0) {
    konfetti();
    ton([523, 659, 784, 1047]); // kleine Sieger-Fanfare
  }

  zeigeBildschirm("result-screen");
}

// ----- Aussprache-Training -----
// Vorlesen (Text-to-Speech) und Zuhören (Spracherkennung) sind im Browser eingebaut.
const Erkennung = window.SpeechRecognition || window.webkitSpeechRecognition;

let sprechWoerter = [];
let sprechNr = 0;

function vorsprechen(text) {
  speechSynthesis.cancel(); // falls noch etwas läuft
  const stimme = new SpeechSynthesisUtterance(text);
  stimme.lang = "en-GB";
  stimme.rate = 0.9; // etwas langsamer, gut zum Nachsprechen
  speechSynthesis.speak(stimme);
}

function ausspracheStarten() {
  sprechWoerter = [...WOERTER].sort(() => Math.random() - 0.5).slice(0, FRAGEN_PRO_RUNDE);
  sprechNr = 0;
  zeigeBildschirm("speak-screen");
  sprechwortZeigen();
}

function sprechwortZeigen() {
  const wort = sprechWoerter[sprechNr];
  document.getElementById("speak-progress").textContent =
    "Wort " + (sprechNr + 1) + " von " + FRAGEN_PRO_RUNDE;
  document.getElementById("speak-word").textContent = wort.en;
  document.getElementById("speak-de").textContent = wort.de;
  document.getElementById("speak-feedback").textContent = "";
  document.getElementById("speak-next-btn").textContent = "Überspringen";
  document.getElementById("mic-btn").disabled = false;
  vorsprechen(wort.en);
}

function zuhoeren() {
  const feedback = document.getElementById("speak-feedback");
  const micBtn = document.getElementById("mic-btn");

  if (!Erkennung) {
    feedback.textContent = "😕 Dieser Browser kann leider keine Spracheingabe – probier Chrome, Edge oder Safari.";
    return;
  }

  const ziel = sprechWoerter[sprechNr].en.toLowerCase();
  const rec = new Erkennung();
  rec.lang = "en-GB";
  micBtn.disabled = true;
  micBtn.textContent = "🎙️ Ich höre zu ...";
  let hatReagiert = false; // damit es am Ende immer eine Rückmeldung gibt

  rec.onresult = (e) => {
    hatReagiert = true;
    const gehoert = e.results[0][0].transcript.toLowerCase().trim();
    if (gehoert === ziel || gehoert.includes(ziel)) {
      feedback.textContent = "✅ Super ausgesprochen!";
      xp += XP_PRO_RICHTIGE_ANTWORT;
      localStorage.setItem("xp", xp);
      anzeigen();
      ton([523, 784]);
      document.getElementById("speak-next-btn").textContent = "Weiter";
    } else {
      feedback.textContent = "Ich habe «" + gehoert + "» verstanden – probier's nochmal!";
      ton([196]);
    }
  };

  rec.onerror = () => {
    hatReagiert = true;
    feedback.textContent = "😕 Ich konnte nichts hören. Ist das Mikrofon erlaubt?";
  };

  rec.onend = () => {
    if (!hatReagiert) {
      feedback.textContent = "😕 Ich konnte nichts hören – sprich laut und deutlich!";
    }
    micBtn.disabled = false;
    micBtn.textContent = "🎤 Jetzt nachsprechen";
  };

  rec.start();
}

function naechstesSprechwort() {
  sprechNr++;
  if (sprechNr < FRAGEN_PRO_RUNDE) {
    sprechwortZeigen();
  } else {
    konfetti();
    ton([523, 659, 784, 1047]);
    zeigeBildschirm("home-screen");
  }
}

// ----- Stall -----
function stallZeigen() {
  const level = aktuellesLevel();
  const box = document.getElementById("stable");
  box.innerHTML = "";
  for (const p of PFERDE) {
    const karte = document.createElement("div");
    const frei = level >= p.level;
    karte.className = "horse-card" + (frei ? "" : " locked");
    if (frei) {
      karte.style.background = p.farbe;
      karte.innerHTML = '<div class="horse-emoji">' + p.emoji + "</div>" + p.name;
    } else {
      karte.innerHTML = '<div class="horse-emoji">🔒</div>Level ' + p.level;
    }
    box.appendChild(karte);
  }
  zeigeBildschirm("stable-screen");
}

document.getElementById("start-btn").onclick = () => quizStarten(false);
document.getElementById("challenge-btn").onclick = () => quizStarten(true);
document.getElementById("again-btn").onclick = () => quizStarten(false);
document.getElementById("home-btn").onclick = () => zeigeBildschirm("home-screen");
document.getElementById("stable-btn").onclick = stallZeigen;
document.getElementById("speak-btn").onclick = ausspracheStarten;
document.getElementById("listen-btn").onclick = () => vorsprechen(sprechWoerter[sprechNr].en);
document.getElementById("mic-btn").onclick = zuhoeren;
document.getElementById("speak-next-btn").onclick = naechstesSprechwort;
document.getElementById("speak-home-btn").onclick = () => zeigeBildschirm("home-screen");
document.getElementById("stable-home-btn").onclick = () => zeigeBildschirm("home-screen");

anzeigen();
startseiteAktualisieren();
