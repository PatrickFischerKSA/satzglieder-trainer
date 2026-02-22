(function () {
  const CATEGORIES = ["S", "P", "AO", "DO", "GO", "k"];
  const CATEGORY_LABEL = {
    S: "Subjekt (Nominativ)", P: "Prädikat (Verbteil)", AO: "Akkusativobjekt",
    DO: "Dativobjekt", GO: "Genitivobjekt", k: "keines davon"
  };

  const POOLS = {
    subjects: ["Die Lehrerin", "Der Schüler", "Unsere Nachbarin", "Der Trainer", "Das Team", "Die Klasse", "Mein Bruder", "Die Autorin"],
    ao: ["den Satz", "die Aufgabe", "einen Fehler", "das Beispiel", "die Lösung", "den Plan", "die Notiz", "ein neues Wort"],
    dative: ["dem Kind", "der Klasse", "seinem Freund", "der Schülerin", "dem Team", "der Lehrperson"],
    genitive: ["des Erfolgs", "der Regeln", "des Projekts", "der Ruhe", "des neuen Plans", "der alten Tradition"],
    adverbials: ["heute", "am Morgen", "nach der Pause", "im Unterricht", "mit großer Ruhe", "ohne Hast", "im Klassenzimmer", "aus Versehen", "mit viel Geduld"],
    transitiveVerbs: ["analysiert", "lobt", "korrigiert", "ordnet", "notiert", "beobachtet"],
    ditransitiveVerbs: ["gibt", "zeigt", "erklärt", "schickt", "leiht"],
    genitiveVerbs: ["gedenkt", "bedarf"],
    splitVerbs: [{ start: "räumt", end: "auf" }, { start: "stellt", end: "vor" }, { start: "schreibt", end: "ab" }, { start: "fasst", end: "zusammen" }]
  };

  const state = { level: 1, maxLevel: 6, streak: 0, mode: "Normal", current: null, repetitionQueue: [], queuedKeys: new Set() };
  const el = {
    rows: document.getElementById("rows"), sentenceText: document.getElementById("sentenceText"), statusHint: document.getElementById("statusHint"),
    newExerciseBtn: document.getElementById("newExerciseBtn"), levelBadge: document.getElementById("levelBadge"),
    streakBadge: document.getElementById("streakBadge"), modeBadge: document.getElementById("modeBadge"),
    explanationCard: document.getElementById("explanationCard"), explanationText: document.getElementById("explanationText")
  };

  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const clone = (obj) => JSON.parse(JSON.stringify(obj));
  const escapeHtml = (v) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");

  function makePart(text, category) {
    const whyMap = {
      S: `"${text}" steht im Nominativ und beantwortet die Frage "Wer oder was ...?".`,
      P: `"${text}" ist ein Verbteil und gehört damit zum Prädikat.`,
      AO: `"${text}" beantwortet die Frage "Wen oder was ...?" und ist daher Akkusativobjekt.`,
      DO: `"${text}" beantwortet die Frage "Wem ...?" und ist daher Dativobjekt.`,
      GO: `"${text}" beantwortet die Frage "Wessen ...?" und ist daher Genitivobjekt.`,
      k: `"${text}" ist hier eine adverbiale/zusätzliche Angabe und gehört nicht zu S, P, AO, DO oder GO.`
    };
    return { text, category, why: whyMap[category] };
  }

  function templateSimple(order) {
    const map = { S: makePart(pick(POOLS.subjects), "S"), P: makePart(pick(POOLS.transitiveVerbs), "P"), AO: makePart(pick(POOLS.ao), "AO"), k: makePart(pick(POOLS.adverbials), "k") };
    const parts = order.map((k) => map[k]);
    return { parts, sentence: `${parts.map((p, i) => `(${i + 1}) ${p.text}`).join(" ")}.` };
  }

  function templateDative(order) {
    const map = {
      S: makePart(pick(POOLS.subjects), "S"), P: makePart(pick(POOLS.ditransitiveVerbs), "P"),
      DO: makePart(pick(POOLS.dative), "DO"), AO: makePart(pick(POOLS.ao), "AO"), k: makePart(pick(POOLS.adverbials), "k")
    };
    const parts = order.map((k) => map[k]);
    return { parts, sentence: `${parts.map((p, i) => `(${i + 1}) ${p.text}`).join(" ")}.` };
  }

  function templateGenitive(order) {
    const map = { S: makePart(pick(POOLS.subjects), "S"), P: makePart(pick(POOLS.genitiveVerbs), "P"), GO: makePart(pick(POOLS.genitive), "GO"), k: makePart(pick(POOLS.adverbials), "k") };
    const parts = order.map((k) => map[k]);
    return { parts, sentence: `${parts.map((p, i) => `(${i + 1}) ${p.text}`).join(" ")}.` };
  }

  function templateSplitPredicate() {
    const split = pick(POOLS.splitVerbs);
    const parts = [makePart(pick(POOLS.subjects), "S"), makePart(split.start, "P"), makePart(pick(POOLS.ao), "AO"), makePart(pick(POOLS.adverbials), "k"), makePart(split.end, "P")];
    return { parts, sentence: `${parts.map((p, i) => `(${i + 1}) ${p.text}`).join(" ")}.` };
  }

  function templateAdvanced() {
    const parts = [makePart(pick(POOLS.adverbials), "k"), makePart(pick(POOLS.subjects), "S"), makePart(pick(POOLS.ditransitiveVerbs), "P"), makePart(pick(POOLS.dative), "DO"), makePart(pick(POOLS.ao), "AO"), makePart(pick(POOLS.adverbials), "k")];
    return { parts, sentence: `${parts.map((p, i) => `(${i + 1}) ${p.text}`).join(" ")}.` };
  }

  function generateNormalExercise() {
    if (state.level <= 1) return Math.random() < 0.5 ? templateSimple(["S", "P", "AO", "k"]) : templateSimple(["k", "S", "P", "AO"]);
    if (state.level === 2) return Math.random() < 0.5 ? templateDative(["S", "P", "DO", "AO", "k"]) : templateDative(["k", "S", "P", "DO", "AO"]);
    if (state.level === 3) return Math.random() < 0.5 ? templateDative(["S", "P", "AO", "k", "DO"]) : templateDative(["k", "S", "P", "DO", "AO"]);
    if (state.level === 4) return Math.random() < 0.5 ? templateGenitive(["S", "P", "GO", "k"]) : templateDative(["S", "P", "DO", "AO", "k"]);
    if (state.level === 5) return Math.random() < 0.5 ? templateSplitPredicate() : templateGenitive(["k", "S", "P", "GO"]);
    return Math.random() < 0.5 ? templateAdvanced() : templateSplitPredicate();
  }

  const repetitionKey = (exercise) => `${exercise.sentence}__${exercise.parts.map((p) => p.category).join("-")}`;
  function enqueueRepetition(exercise) {
    const key = repetitionKey(exercise);
    if (state.queuedKeys.has(key)) return;
    state.repetitionQueue.push({ key, exercise: clone(exercise) });
    state.queuedKeys.add(key);
  }

  function takeExercise() {
    if (state.repetitionQueue.length > 0) {
      const next = state.repetitionQueue.shift();
      state.queuedKeys.delete(next.key);
      state.mode = "Repetition";
      return next.exercise;
    }
    state.mode = "Normal";
    return generateNormalExercise();
  }

  function formatSentence(parts) {
    return `${parts.map((p, i) => `<span class="part-mark"><em>(${i + 1})</em> ${escapeHtml(p.text)}</span>`).join(" ")}.`;
  }

  function createRow(part, idx) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${idx + 1}</td><td>${part.text}</td><td></td><td id="feedback-${idx}" class="feedback"></td>`;

    const select = document.createElement("select");
    select.dataset.index = String(idx);
    select.innerHTML = `<option value="">Bitte wählen</option>`;
    CATEGORIES.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = `${cat} – ${CATEGORY_LABEL[cat]}`;
      select.appendChild(option);
    });
    select.addEventListener("change", onAnswerChange);
    tr.children[2].appendChild(select);
    return tr;
  }

  function showExplanation(text) {
    el.explanationCard.hidden = false;
    el.explanationText.textContent = text;
  }

  function hideExplanation() {
    el.explanationCard.hidden = true;
    el.explanationText.textContent = "";
  }

  function onAnswerChange(event) {
    const select = event.target;
    const idx = Number(select.dataset.index);
    const chosen = select.value;
    const part = state.current.parts[idx];
    const feedbackCell = document.getElementById(`feedback-${idx}`);

    if (!chosen) {
      feedbackCell.className = "feedback";
      feedbackCell.textContent = "";
      return;
    }

    if (chosen === part.category) {
      feedbackCell.className = "feedback ok";
      feedbackCell.textContent = `Richtig (${part.category})`;
      hideExplanation();
    } else {
      feedbackCell.className = "feedback bad";
      feedbackCell.textContent = `Falsch: korrekt wäre ${part.category}`;
      showExplanation(`Fehler bei "${part.text}": Du hast "${chosen}" gewählt, korrekt ist "${part.category}" (${CATEGORY_LABEL[part.category]}). ${part.why}`);
    }

    evaluateExerciseState();
  }

  function allAnswered() {
    return Array.from(el.rows.querySelectorAll("select")).every((select) => select.value);
  }

  function allCorrect() {
    return Array.from(el.rows.querySelectorAll("select")).every((select, idx) => select.value === state.current.parts[idx].category);
  }

  function evaluateExerciseState() {
    if (!allAnswered()) {
      el.statusHint.textContent = "Noch nicht alle Satzglieder sind zugeordnet.";
      return;
    }

    if (allCorrect()) {
      state.streak += 1;
      let levelInfo = "";
      if (state.streak >= 2 && state.level < state.maxLevel) {
        state.level += 1;
        state.streak = 0;
        levelInfo = ` Level erhöht auf ${state.level}.`;
      }
      el.statusHint.textContent = `Alles korrekt. Sehr gut.${levelInfo} Klicke auf "Neuer Satz".`;
    } else {
      state.streak = 0;
      enqueueRepetition(state.current);
      el.statusHint.textContent = "Mindestens ein Fehler. Repetitionsmodus ist für den nächsten Satz aktiv.";
    }

    updateBadges();
  }

  function renderExercise(exercise) {
    state.current = exercise;
    el.rows.innerHTML = "";
    hideExplanation();
    exercise.parts.forEach((part, idx) => el.rows.appendChild(createRow(part, idx)));
    el.sentenceText.innerHTML = formatSentence(exercise.parts);
    el.statusHint.textContent = "Wähle für jedes Satzglied eine Kategorie.";
    updateBadges();
  }

  function updateBadges() {
    el.levelBadge.textContent = String(state.level);
    el.streakBadge.textContent = String(state.streak);
    el.modeBadge.textContent = state.mode;
  }

  function nextExercise() {
    renderExercise(takeExercise());
  }

  el.newExerciseBtn.addEventListener("click", nextExercise);
  nextExercise();
})();
