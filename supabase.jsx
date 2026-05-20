// =========================================================================
// SUPABASE — cliente, auth e funções de acesso ao banco
// =========================================================================
const SUPABASE_URL = "https://lflxvbwcqpodareadfqe.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbHh2YndjcXBvZGFyZWFkZnFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NTExNTUsImV4cCI6MjA5NDUyNzE1NX0.spsHJy605meKGXnmdhniLEnxtmqQTYtHhKW29ydsG-g";

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Auth ──────────────────────────────────────────────────────────────────

async function signUp(email, password, displayName) {
  const { data, error } = await db.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });
  return { data, error };
}

async function signIn(email, password) {
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  return { data, error };
}

async function signOut() {
  return db.auth.signOut();
}

function onAuthChange(callback) {
  const { data: { subscription } } = db.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  return subscription;
}

async function getSession() {
  const { data: { session } } = await db.auth.getSession();
  return session?.user ?? null;
}

// ── Decks ─────────────────────────────────────────────────────────────────

async function fetchDecks() {
  const { data, error } = await db
    .from("decks")
    .select(`
      *,
      cards(count),
      cards!inner(id, due, state)
    `)
    .eq("archived", false)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

async function fetchDecksSimple() {
  const { data, error } = await db
    .from("decks")
    .select("*")
    .eq("archived", false)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

async function fetchDeckStats(deckId) {
  const now = new Date().toISOString();
  const { data: allCards, error } = await db
    .from("cards")
    .select("id, state, due")
    .eq("deck_id", deckId);
  if (error) throw error;

  const total    = allCards.length;
  const due      = allCards.filter(c => c.state !== "new" && new Date(c.due) <= new Date(now)).length;
  const newCards = allCards.filter(c => c.state === "new").length;
  const learning = allCards.filter(c => c.state === "learning" || c.state === "relearning").length;
  const review   = allCards.filter(c => c.state === "review").length;
  const mastery  = total > 0 ? Math.round((review / total) * 100) : 0;

  return { total, due, newCards, learning, review, mastery };
}

async function createDeck({ title, description, category, color, folder_path = "" }) {
  const { data: userResp } = await db.auth.getUser();
  const row = { title, description, category, color, folder_path, user_id: userResp.user.id };
  let { data, error } = await db.from("decks").insert(row).select().single();
  // Se a coluna folder_path não existir no banco, tenta sem ela
  if (error && error.message && error.message.includes("folder_path")) {
    const { folder_path: _fp, ...rowWithout } = row;
    ({ data, error } = await db.from("decks").insert(rowWithout).select().single());
  }
  if (error) throw error;
  return { ...data, folder_path: folder_path };
}

async function updateDeck(id, fields) {
  let { data, error } = await db.from("decks").update(fields).eq("id", id).select().single();
  // Se folder_path não existir na tabela, tenta sem o campo
  if (error && error.message && error.message.includes("folder_path") && "folder_path" in fields) {
    const { folder_path, ...rest } = fields;
    ({ data, error } = await db.from("decks").update(rest).eq("id", id).select().single());
    if (!error) return { ...data, folder_path };
  }
  if (error) throw error;
  return data;
}

async function deleteDeck(id) {
  const { error } = await db.from("decks").delete().eq("id", id);
  if (error) throw error;
}

// ── Cards ─────────────────────────────────────────────────────────────────

async function fetchDueCards(deckId, limit = 50) {
  const now = new Date().toISOString();
  let query = db
    .from("cards")
    .select("*")
    .or(`state.eq.new,and(state.neq.new,due.lte.${now})`)
    .order("due", { ascending: true })
    .limit(limit);
  if (deckId) query = query.eq("deck_id", deckId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async function fetchCardsByDeck(deckId) {
  if (!deckId) return [];
  const { data, error } = await db
    .from("cards")
    .select("front")
    .eq("deck_id", deckId);
  if (error) return [];
  return data.map(c => c.front).filter(Boolean);
}

async function createCard({ deck_id, type, front, back, tags }) {
  const { data: user } = await db.auth.getUser();
  const { data, error } = await db
    .from("cards")
    .insert({ deck_id, user_id: user.user.id, type, front, back, tags })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function updateCard(id, fields) {
  const { data, error } = await db
    .from("cards")
    .update(fields)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Aplica resultado de revisão ao card (algoritmo FSRS simplificado)
async function reviewCard(cardId, rating) {
  const { data: card, error: fetchErr } = await db
    .from("cards")
    .select("*")
    .eq("id", cardId)
    .single();
  if (fetchErr) throw fetchErr;

  const now = new Date();
  const updates = computeNextInterval(card, rating, now);

  const { data, error } = await db
    .from("cards")
    .update({ ...updates, last_review: now.toISOString() })
    .eq("id", cardId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Algoritmo de espaçamento simplificado baseado no FSRS
function computeNextInterval(card, rating, now) {
  const ratingMap = { again: 1, hard: 2, good: 3, easy: 4 };
  const r = ratingMap[rating];
  let { stability, difficulty, interval_days, reps, lapses, state } = card;

  if (stability === 0) stability = 1;
  if (difficulty === 0) difficulty = 5;

  let newInterval;

  if (state === "new" || state === "learning") {
    if (r === 1) { newInterval = 0.007; state = "learning"; }         // ~10min
    else if (r === 2) { newInterval = 0.04; state = "learning"; }    // ~1h
    else if (r === 3) { newInterval = 1; state = "review"; reps++; }
    else { newInterval = 4; state = "review"; reps++; }
  } else {
    if (r === 1) {
      lapses++;
      newInterval = 0.007;
      state = "relearning";
      stability = Math.max(1, stability * 0.2);
    } else {
      const ease = r === 2 ? 0.8 : r === 3 ? 1.0 : 1.3;
      stability = stability * ease * (1 + 0.1 * reps);
      newInterval = Math.min(365, Math.max(1, Math.round(stability)));
      state = "review";
      reps++;
    }
  }

  const due = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);

  return { stability, difficulty, interval_days: newInterval, reps, lapses, state, due: due.toISOString() };
}

// Calcula labels de intervalo para exibição nos botões
function previewIntervals(card) {
  const now = new Date();
  const ratings = ["again", "hard", "good", "easy"];
  const labels = {};
  for (const r of ratings) {
    const { interval_days } = computeNextInterval(card, r, now);
    if (interval_days < 0.02) labels[r] = "<10m";
    else if (interval_days < 0.1) labels[r] = "~1h";
    else if (interval_days < 1) labels[r] = `${Math.round(interval_days * 24)}h`;
    else labels[r] = `${Math.round(interval_days)}d`;
  }
  return labels;
}

// ── Study Sessions ────────────────────────────────────────────────────────

async function startSession(deckId) {
  const { data, error } = await db
    .from("study_sessions")
    .insert({ deck_id: deckId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function endSession(sessionId, cardsStudied) {
  const { error } = await db
    .from("study_sessions")
    .update({ ended_at: new Date().toISOString(), cards_studied: cardsStudied })
    .eq("id", sessionId);
  if (error) throw error;
}

async function recordReview(sessionId, cardId, rating) {
  const { data: user } = await db.auth.getUser();
  const { error } = await db.from("study_reviews").insert({
    session_id: sessionId,
    card_id: cardId,
    user_id: user.user.id,
    rating,
  });
  if (error) throw error;
}

// ── User Settings ─────────────────────────────────────────────────────────

async function fetchSettings() {
  const { data: user } = await db.auth.getUser();
  if (!user.user) return null;
  const { data, error } = await db
    .from("user_settings")
    .select("*")
    .eq("user_id", user.user.id)
    .single();
  if (error) return null;
  return data;
}

async function saveSettings(fields) {
  const { data: user } = await db.auth.getUser();
  const { data, error } = await db
    .from("user_settings")
    .update(fields)
    .eq("user_id", user.user.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── Activity (heatmap) ────────────────────────────────────────────────────

async function fetchActivity(days = 140) {
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const { data, error } = await db
    .from("study_reviews")
    .select("reviewed_at")
    .gte("reviewed_at", since);
  if (error) return [];

  const counts = {};
  for (const { reviewed_at } of data) {
    const day = reviewed_at.slice(0, 10);
    counts[day] = (counts[day] || 0) + 1;
  }
  return counts;
}

// Exporta tudo para window (padrão do projeto)
Object.assign(window, {
  db,
  signUp, signIn, signOut, onAuthChange, getSession,
  fetchDecks, fetchDecksSimple, fetchDeckStats,
  createDeck, updateDeck, deleteDeck,
  fetchDueCards, fetchCardsByDeck, createCard, updateCard, reviewCard,
  previewIntervals, computeNextInterval,
  startSession, endSession, recordReview,
  fetchSettings, saveSettings,
  fetchActivity,
});
