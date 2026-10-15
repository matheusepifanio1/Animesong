// Gerador de desafios do OPdle.
//
// Uso: node generator/generate.mjs --state state.json --out out [--days 35] [--from 2026-10-16] [--max-new 0]
//
// 1. Busca os animes mais populares no AniList e agrupa por franquia (temporadas, filmes e
//    histórias paralelas contam como a mesma resposta).
// 2. Busca as aberturas (OP) desses animes no AnimeThemes.
// 3. Para cada dia que ainda não tem desafio, escolhe 5 aberturas: a 1 de uma franquia muito
//    popular e a 5 de uma pouco conhecida. Escolhe um trecho que começa com música (sem silêncio),
//    diferente dos trechos já usados daquela abertura, corta 16,5 s em MP3 e monta as dicas.
// 4. Escreve em --out: puzzles/<data>.json, clips/<id>.mp3, catalog.json e state.json.
//
// O state.json guarda o histórico (o que já saiu e quais trechos) e a data de lançamento.
// Os desafios já gerados nunca são refeitos: novos animes só entram em dias futuros.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

// ---------- parâmetros ----------
const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, arr) => {
  if (a.startsWith("--")) acc.push([a.slice(2), arr[i + 1] && !arr[i + 1].startsWith("--") ? arr[i + 1] : "1"]);
  return acc;
}, []));
const OUT = args.out || "out";
const STATE_FILE = args.state || "state.json";
const DAYS_AHEAD = Number(args.days || 35);
const MAX_NEW = Number(args["max-new"] || 0);      // 0 = sem limite (útil para testes)
const TOP_N = Number(args.top || 1500);            // quantos animes do AniList considerar
const CLIP_SECONDS = 16.5;
const UA = "opdle-generator (github.com/matheusepifanio1/animesong)";

// Faixas de popularidade por posição do dia (índice no ranking de franquias)
const BANDS = [[0, 40], [40, 120], [120, 300], [300, 600], [600, 1200]];
const FRANCHISE_COOLDOWN = 30;   // dias sem repetir a mesma franquia
const THEME_COOLDOWN = 90;       // dias sem repetir a mesma abertura
const MIN_GAP_SECONDS = 20;      // distância mínima entre trechos da mesma abertura
const UNION_TYPES = new Set(["PREQUEL", "SEQUEL", "PARENT", "SIDE_STORY", "ALTERNATIVE"]);
const FORMATS = new Set(["TV", "TV_SHORT", "ONA", "MOVIE"]);      // entram no catálogo de respostas
const THEME_FORMATS = new Set(["TV", "TV_SHORT", "ONA"]);         // de onde saem as aberturas
const GENRE_PT = {
  Action: "Ação", Adventure: "Aventura", Comedy: "Comédia", Drama: "Drama", Ecchi: "Ecchi", Fantasy: "Fantasia",
  Horror: "Terror", "Mahou Shoujo": "Garota mágica", Mecha: "Mecha", Music: "Música", Mystery: "Mistério",
  Psychological: "Psicológico", Romance: "Romance", "Sci-Fi": "Ficção científica", "Slice of Life": "Cotidiano",
  Sports: "Esportes", Supernatural: "Sobrenatural", Thriller: "Suspense", Hentai: "Adulto"
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

// ---------- datas (horário de Brasília, sem horário de verão) ----------
const todayBRT = () => new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);
const addDays = (d, n) => { const t = new Date(d + "T12:00:00Z"); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10); };
const diffDays = (a, b) => Math.round((Date.parse(b + "T12:00:00Z") - Date.parse(a + "T12:00:00Z")) / 86400e3);

// ---------- PRNG determinístico ----------
function rngFrom(str) {
  let h = crypto.createHash("sha256").update(str).digest().readUInt32LE(0);
  return () => { h |= 0; h = (h + 0x6D2B79F5) | 0; let t = Math.imul(h ^ (h >>> 15), 1 | h); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function weightedPick(items, weights, rnd) {
  const total = weights.reduce((a, b) => a + b, 0);
  if (!(total > 0)) return null;
  let x = rnd() * total;
  for (let i = 0; i < items.length; i++) { x -= weights[i]; if (x <= 0) return items[i]; }
  return items[items.length - 1];
}

// ---------- HTTP com retentativa ----------
async function getJSON(url, opts = {}, tries = 6) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { ...opts, headers: { "User-Agent": UA, Accept: "application/json", ...(opts.headers || {}) } });
      if (r.status === 429 || r.status >= 500) {
        const wait = (Number(r.headers.get("retry-after")) || 20) * 1000;
        log(`HTTP ${r.status} em ${url.slice(0, 80)}… esperando ${wait / 1000}s`);
        await sleep(wait); continue;
      }
      if (!r.ok) throw new Error(`HTTP ${r.status}: ${(await r.text()).slice(0, 200)}`);
      return await r.json();
    } catch (e) {
      if (i === tries - 1) throw e;
      log("erro de rede, tentando de novo:", e.message); await sleep(5000);
    }
  }
}

// ---------- 1. AniList ----------
const AL_QUERY = `query($page:Int,$perPage:Int){ Page(page:$page, perPage:$perPage){ pageInfo{ hasNextPage }
  media(type:ANIME, sort:POPULARITY_DESC, isAdult:false){
    id format popularity seasonYear genres synonyms
    title{ romaji english native } coverImage{ large color }
    relations{ edges{ relationType node{ id type } } }
    characters(role:MAIN, sort:[ROLE, RELEVANCE, ID], perPage:2){ nodes{ name{ full } } }
  } } }`;

async function fetchAniList() {
  const perPage = 25, out = [];
  for (let page = 1; out.length < TOP_N; page++) {
    const d = await getJSON("https://graphql.anilist.co", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: AL_QUERY, variables: { page, perPage } })
    });
    if (d.errors) throw new Error("AniList: " + JSON.stringify(d.errors).slice(0, 300));
    out.push(...d.data.Page.media);
    if (page % 10 === 0) log(`AniList: ${out.length} animes`);
    if (!d.data.Page.pageInfo.hasNextPage) break;
    await sleep(2300); // limite atual: 30 req/min
  }
  return out.slice(0, TOP_N);
}

const latinOrJp = (s) => /^[\p{Script=Latin}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{N}\p{P}\p{S}\s]+$/u.test(s);
const titleOf = (m) => m.title.english || m.title.romaji;
const cleanTitle = (t) => t
  .replace(/\s*\((?:19|20)\d{2}\)\s*/g, " ")
  .replace(/[:\s]+(?:Season|Seasons|Part|Cour)\s+[\d&\s,]+$/i, "")
  .replace(/[:\s]+\d+(?:st|nd|rd|th)\s+Season$/i, "")
  .replace(/\s+(?:Season|Part)\s+(?:Two|Three|Four|II|III|IV)$/i, "")
  .replace(/\s{2,}/g, " ").trim();

function buildFranchises(media) {
  const parent = new Map();
  const find = (x) => { while (parent.has(x) && parent.get(x) !== x) { parent.set(x, parent.get(parent.get(x)) ?? parent.get(x)); x = parent.get(x); } return x; };
  const union = (a, b) => { if (!parent.has(a)) parent.set(a, a); if (!parent.has(b)) parent.set(b, b); const ra = find(a), rb = find(b); if (ra !== rb) parent.set(rb, ra); };
  for (const m of media) {
    if (!parent.has(m.id)) parent.set(m.id, m.id);
    for (const e of m.relations?.edges || []) if (e.node?.type === "ANIME" && UNION_TYPES.has(e.relationType)) union(m.id, e.node.id);
  }
  const groups = new Map();
  for (const m of media) {
    const r = find(m.id);
    if (!groups.has(r)) groups.set(r, []);
    groups.get(r).push(m);
  }
  const franchises = [];
  for (const members of groups.values()) {
    members.sort((a, b) => b.popularity - a.popularity);
    const top = members[0];
    // nome exibido: o título do membro mais antigo entre os bem populares, sem "Season 2", "(2019)" etc.
    const strong = members.filter((m) => m.popularity >= top.popularity * 0.3 && FORMATS.has(m.format));
    const base = (strong.length ? strong : [top]).slice().sort((a, b) => (a.seasonYear || 9999) - (b.seasonYear || 9999))[0];
    const names = new Set();
    for (const m of members) for (const t of [m.title.english, m.title.romaji, m.title.native, ...(m.synonyms || [])]) if (t && latinOrJp(t)) names.add(t.trim());
    const name = cleanTitle(titleOf(base)) || titleOf(base);
    names.delete(name);
    franchises.push({ id: top.id, name, aliases: [...names].slice(0, 40), popularity: top.popularity, members: members.map((m) => m.id) });
  }
  franchises.sort((a, b) => b.popularity - a.popularity);
  return franchises;
}

// ---------- 2. AnimeThemes ----------
async function fetchThemes(media) {
  const byId = new Map(media.map((m) => [m.id, m]));
  const themes = [];
  const ids = media.filter((m) => THEME_FORMATS.has(m.format)).map((m) => m.id);
  for (let i = 0; i < ids.length; i += 25) {
    let url = `https://api.animethemes.moe/anime?filter[has]=resources&filter[site]=AniList&filter[external_id]=${ids.slice(i, i + 25).join(",")}`
      + `&include=resources,animethemes.song.artists,animethemes.animethemeentries.videos.audio&page[size]=25`;
    while (url) {
      const d = await getJSON(url);
      for (const a of d.anime || []) {
        const res = (a.resources || []).find((x) => x.site === "AniList" && byId.has(Number(x.external_id)));
        if (!res) continue;
        const m = byId.get(Number(res.external_id));
        for (const t of a.animethemes || []) {
          if (t.type !== "OP") continue;
          const entry = (t.animethemeentries || []).find((e) => !e.nsfw && (e.videos || []).some((v) => v.audio?.link));
          if (!entry) continue;
          const vids = entry.videos.filter((v) => v.audio?.link);
          const v = vids.find((x) => x.overlap === "None") || vids[0];
          themes.push({
            key: `${a.slug}-${t.slug}`, anilistId: m.id, slug: t.slug, sequence: t.sequence || 1,
            song: t.song?.title || "", artists: (t.song?.artists || []).map((x) => x.name), audio: v.audio.link
          });
        }
      }
      url = d.links?.next || null;
      await sleep(800);
    }
    if ((i / 25) % 10 === 0) log(`AnimeThemes: ${i + 25}/${ids.length} animes consultados, ${themes.length} aberturas`);
  }
  return themes;
}

// ---------- 3. Áudio ----------
function analyze(file) {
  // decodifica para PCM mono 8 kHz e mede o volume em janelas de 250 ms
  const pcm = execFileSync("ffmpeg", ["-v", "error", "-i", file, "-ac", "1", "-ar", "8000", "-f", "s16le", "-"], { maxBuffer: 64 * 1024 * 1024 });
  const samples = new Int16Array(pcm.buffer, pcm.byteOffset, Math.floor(pcm.length / 2));
  const win = 2000, rms = [];
  for (let i = 0; i + win <= samples.length; i += win) {
    let s = 0; for (let j = i; j < i + win; j++) s += samples[j] * samples[j];
    rms.push(Math.sqrt(s / win));
  }
  return { rms, duration: samples.length / 8000 };
}

function chooseStart({ rms, duration }, used, slot) {
  if (duration < CLIP_SECONDS + 4) return null;
  const sorted = [...rms].sort((a, b) => a - b);
  const p90 = sorted[Math.floor(sorted.length * 0.9)] || 1;
  const loudFrom = (f) => { // começo alto: primeiro 1 s com volume razoável e nada de silêncio nos 3 s seguintes
    const first = rms.slice(f, f + 4), next = rms.slice(f, f + 12);
    return first.length === 4 && first.reduce((a, b) => a + b, 0) / 4 > 0.35 * p90 && Math.min(...next) > 0.08 * p90;
  };
  const maxFrame = Math.floor((duration - CLIP_SECONDS - 1) / 0.25);
  const onset = rms.findIndex((v) => v > 0.25 * p90);
  const nearestLoud = (target) => {
    for (let d = 0; d < 40; d++) for (const f of [target + d, target - d]) if (f >= 0 && f <= maxFrame && loudFrom(f)) return f;
    return -1;
  };
  const targets = [Math.max(0, onset), Math.floor(duration * 0.38 / 0.25), Math.floor(duration * 0.62 / 0.25)];
  const order = slot <= 2 ? [0, 1, 2] : [1, 2, 0];
  for (const k of order) {
    const f = nearestLoud(targets[k]);
    if (f < 0) continue;
    const start = Math.round(f * 0.25 * 10) / 10;
    if (used.every((u) => Math.abs(u - start) >= MIN_GAP_SECONDS)) return start;
  }
  return null;
}

async function makeClip(theme, used, slot, tmpDir, clipDir) {
  const src = path.join(tmpDir, theme.key.replace(/[^\w.-]/g, "_") + ".ogg");
  if (!fs.existsSync(src)) {
    const r = await fetch(theme.audio, { headers: { "User-Agent": UA } });
    if (!r.ok) throw new Error(`áudio HTTP ${r.status}`);
    fs.writeFileSync(src, Buffer.from(await r.arrayBuffer()));
    await sleep(700);
  }
  const start = chooseStart(analyze(src), used, slot);
  if (start == null) return null;
  const id = crypto.randomBytes(16).toString("hex");
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(start), "-t", String(CLIP_SECONDS), "-i", src,
    "-af", "afade=t=in:d=0.03,loudnorm=I=-15:TP=-1.5:LRA=11", "-ac", "1", "-ar", "44100", "-b:a", "96k", path.join(clipDir, id + ".mp3")]);
  return { id, start };
}

// ---------- 4. Agenda ----------
async function main() {
  const state = fs.existsSync(STATE_FILE) ? JSON.parse(fs.readFileSync(STATE_FILE, "utf8")) : { launch: null, days: {} };
  const from = args.from || (state.launch ? null : addDays(todayBRT(), 0));
  if (!state.launch) state.launch = from;
  const lastDay = Object.keys(state.days).sort().pop();
  const startDay = lastDay ? addDays(lastDay, 1) : state.launch;
  const endDay = addDays(todayBRT(), DAYS_AHEAD);
  let dates = [];
  for (let d = startDay; d <= endDay; d = addDays(d, 1)) dates.push(d);
  if (MAX_NEW) dates = dates.slice(0, MAX_NEW);

  fs.mkdirSync(path.join(OUT, "puzzles"), { recursive: true });
  fs.mkdirSync(path.join(OUT, "clips"), { recursive: true });
  const tmpDir = fs.mkdtempSync(path.join(OUT, "tmp-"));

  log(`Lançamento ${state.launch}; dias já prontos: ${Object.keys(state.days).length}; gerar: ${dates.length}`);

  const media = await fetchAniList();
  log(`AniList: ${media.length} animes`);
  const franchises = buildFranchises(media);
  const franchiseOf = new Map();
  franchises.forEach((f) => f.members.forEach((id) => franchiseOf.set(id, f)));
  const mediaById = new Map(media.map((m) => [m.id, m]));

  // catálogo para o autocomplete (todas as franquias, mesmo sem abertura)
  fs.writeFileSync(path.join(OUT, "catalog.json"), JSON.stringify({
    generated: new Date().toISOString(),
    franchises: franchises.map((f) => ({ id: f.id, name: f.name, aliases: f.aliases, pop: f.popularity }))
  }));

  if (!dates.length) { log("Nada para gerar."); fs.writeFileSync(path.join(OUT, "state.json"), JSON.stringify(state)); return; }

  const themes = await fetchThemes(media);
  log(`AnimeThemes: ${themes.length} aberturas`);
  const themesByFr = new Map();
  for (const t of themes) {
    const f = franchiseOf.get(t.anilistId); if (!f) continue;
    if (!themesByFr.has(f.id)) themesByFr.set(f.id, []);
    themesByFr.get(f.id).push(t);
  }
  const ranked = franchises.filter((f) => themesByFr.has(f.id)); // só franquias com abertura
  log(`Franquias com abertura: ${ranked.length}`);

  // histórico: último uso de franquia/abertura e trechos já usados
  const lastFr = new Map(), lastTheme = new Map(), usedStarts = new Map();
  const remember = (date, r) => {
    lastFr.set(r.franchiseId, date); lastTheme.set(r.themeKey, date);
    if (!usedStarts.has(r.themeKey)) usedStarts.set(r.themeKey, []);
    usedStarts.get(r.themeKey).push(r.start);
  };
  for (const [date, day] of Object.entries(state.days)) for (const r of day.rounds) remember(date, r);

  for (const date of dates) {
    const rounds = [];
    const rnd = rngFrom("opdle|" + date);
    for (let slot = 0; slot < 5; slot++) {
      const [lo, hi] = BANDS[slot];
      let pool = ranked.slice(lo, Math.min(hi, ranked.length));
      const fresh = (f) => !rounds.some((r) => r.franchiseId === f.id) && (!lastFr.has(f.id) || diffDays(lastFr.get(f.id), date) >= FRANCHISE_COOLDOWN);
      let cands = pool.filter(fresh);
      if (!cands.length) cands = ranked.slice(lo, Math.min(hi * 2, ranked.length)).filter(fresh);
      let made = null;
      for (let attempt = 0; attempt < 12 && cands.length && !made; attempt++) {
        const f = cands.splice(Math.floor(rnd() * cands.length), 1)[0];
        const ts = themesByFr.get(f.id).filter((t) => !lastTheme.has(t.key) || diffDays(lastTheme.get(t.key), date) >= THEME_COOLDOWN);
        if (!ts.length) continue;
        // posições fáceis preferem a abertura mais icônica (anime mais popular, primeira OP)
        const w = ts.map((t) => {
          const pop = mediaById.get(t.anilistId)?.popularity || 1;
          return slot <= 1 ? pop / Math.pow(t.sequence, 1.2) : slot === 2 ? Math.sqrt(pop) : 1;
        });
        const order = [];
        const pickable = [...ts], ww = [...w];
        while (pickable.length) { const t = weightedPick(pickable, ww, rnd); const k = pickable.indexOf(t); order.push(t); pickable.splice(k, 1); ww.splice(k, 1); }
        for (const t of order.slice(0, 3)) {
          try {
            const clip = await makeClip(t, usedStarts.get(t.key) || [], slot, tmpDir, path.join(OUT, "clips"));
            if (!clip) { log(`  sem trecho bom: ${t.key}`); continue; }
            const m = mediaById.get(t.anilistId);
            made = {
              clip: clip.id, start: clip.start, themeKey: t.key, franchiseId: f.id,
              answer: f.name, media: titleOf(m), slug: t.slug, song: t.song, artists: t.artists,
              year: m.seasonYear || null, genres: (m.genres || []).filter((g) => g !== "Hentai").slice(0, 3).map((g) => GENRE_PT[g] || g),
              protagonist: m.characters?.nodes?.[0]?.name?.full || null,
              cover: m.coverImage?.large || null, color: m.coverImage?.color || null
            };
            break;
          } catch (e) { log(`  falhou ${t.key}: ${e.message}`); }
        }
      }
      if (!made) throw new Error(`Não consegui montar a posição ${slot + 1} de ${date}`);
      rounds.push(made);
      remember(date, made);
    }
    const number = diffDays(state.launch, date) + 1;
    fs.writeFileSync(path.join(OUT, "puzzles", date + ".json"), JSON.stringify({ date, number, rounds }));
    state.days[date] = { rounds: rounds.map((r) => ({ themeKey: r.themeKey, franchiseId: r.franchiseId, start: r.start })) };
    log(`${date} (#${number}): ${rounds.map((r) => `${r.answer} ${r.slug}@${r.start}s`).join(" | ")}`);
    for (const f of fs.readdirSync(tmpDir)) fs.rmSync(path.join(tmpDir, f)); // limpa áudios baixados
  }
  fs.rmSync(tmpDir, { recursive: true, force: true });
  fs.writeFileSync(path.join(OUT, "state.json"), JSON.stringify(state));
  log("Pronto.");
}

main().catch((e) => { console.error(e); process.exit(1); });
