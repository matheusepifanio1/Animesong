// Worker do OPdle na Cloudflare.
// - Arquivos do site: pasta public/ (servidos antes deste código quando o arquivo existe).
// - GET /api/puzzle[?date=AAAA-MM-DD]  desafio do dia (só hoje ou dias passados, horário de Brasília)
// - GET /api/clip/<id>                 trecho de áudio (MP3)
// Dados no KV (binding KV): "puzzle:<data>" (JSON), "clip:<id>" (MP3), "state" (histórico do gerador).

export { OpdleDB } from "./db.js";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const PLAYER_RE = /^[a-z0-9-]{16,64}$/;
const CODE_RE = /^[a-z0-9]{6}$/;
const addDays = (d, n) => { const t = new Date(d + "T12:00:00Z"); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10); };
const cleanName = (s, max) => String(s || "").replace(/[\u0000-\u001f]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
const db = (env) => env.DB.get(env.DB.idFromName("main"));

async function readBody(request) {
  const text = await request.text();
  if (text.length > 4000) throw new Error("grande demais");
  return JSON.parse(text || "{}");
}

async function handleApi(url, request, env) {
  const p = url.pathname, today = todayBRT();
  const noStore = { "Cache-Control": "no-store" };
  if (request.method === "POST") {
    let b;
    try { b = await readBody(request); } catch { return json({ error: "Pedido inválido." }, 400, noStore); }
    if (!PLAYER_RE.test(b.player || "")) return json({ error: "Jogador inválido." }, 400, noStore);
    const name = cleanName(b.name, 24);
    if (p === "/api/result") {
      const att = Array.isArray(b.attempts) ? b.attempts.map(Number) : [];
      if (att.length !== 5 || att.some((a) => !Number.isInteger(a) || a < 0 || a > 6)) return json({ error: "Resultado inválido." }, 400, noStore);
      if (b.date !== today) return json({ ok: true, counted: false }, 200, noStore); // só vale no próprio dia
      return json({ ...(await db(env).submit({ player: b.player, name, date: today, attempts: att })), counted: true }, 200, noStore);
    }
    if (p === "/api/name") return json(await db(env).setName(b.player, name), 200, noStore);
    if (p === "/api/group") {
      const groupName = cleanName(b.groupName, 30);
      if (!groupName) return json({ error: "Dê um nome ao grupo." }, 400, noStore);
      return json(await db(env).createGroup({ player: b.player, name, groupName }), 200, noStore);
    }
    if (p === "/api/group/join" || p === "/api/group/leave") {
      if (!CODE_RE.test(b.code || "")) return json({ error: "Código de grupo inválido." }, 400, noStore);
      const r = p.endsWith("join") ? await db(env).joinGroup({ player: b.player, name, code: b.code }) : await db(env).leaveGroup({ player: b.player, code: b.code });
      return json(r, r.error ? 404 : 200, noStore);
    }
    return json({ error: "Rota não encontrada." }, 404, noStore);
  }

  if (p === "/api/stats") {
    const date = url.searchParams.get("date") || today;
    if (!DATE_RE.test(date) || date > today) return json({ error: "data inválida" }, 400, noStore);
    return json(await db(env).stats(date), 200, { "Cache-Control": "public, max-age=30" });
  }
  if (p === "/api/groups") {
    const player = url.searchParams.get("player") || "";
    if (!PLAYER_RE.test(player)) return json({ error: "Jogador inválido." }, 400, noStore);
    return json({ groups: await db(env).myGroups(player) }, 200, noStore);
  }
  const m = p.match(/^\/api\/group\/([a-z0-9]{6})(\/info)?$/);
  if (m) {
    if (m[2]) { const g = await db(env).groupInfo(m[1]); return g ? json(g, 200, noStore) : json({ error: "Grupo não encontrado." }, 404, noStore); }
    const player = url.searchParams.get("player") || "";
    const r = await db(env).ranking({ code: m[1], player, date: today, weekStart: addDays(today, -6) });
    return json(r, r.error ? 404 : 200, noStore);
  }
  return null;
}
const todayBRT = () => new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);

function secondsToMidnightBRT() {
  const now = Date.now() - 3 * 3600e3;
  return Math.max(60, Math.ceil((86400e3 - (now % 86400e3)) / 1000));
}

const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", ...headers } });

async function cached(request, ctx, make) {
  const cache = caches.default;
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await make();
  if (res.ok) ctx.waitUntil(cache.put(request, res.clone()));
  return res;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/") && !url.pathname.startsWith("/api/puzzle") && !url.pathname.startsWith("/api/clip/") && url.pathname !== "/api/today") {
      const r = await handleApi(url, request, env);
      if (r) return r;
    }
    if (request.method !== "GET" && request.method !== "HEAD") return new Response("Método não permitido", { status: 405 });

    if (url.pathname === "/api/puzzle") {
      const today = todayBRT();
      const date = url.searchParams.get("date") || today;
      if (!DATE_RE.test(date)) return json({ error: "data inválida" }, 400);
      if (date > today) return json({ error: "Esse desafio ainda não saiu." }, 403, { "Cache-Control": "no-store" });
      // a chave de cache inclui a data explícita, para "hoje" virar sozinho à meia-noite
      const key = new Request(`${url.origin}/api/puzzle?date=${date}&v=${date === today ? "today" : "past"}`);
      return cached(key, ctx, async () => {
        const [puzzle, launch] = await Promise.all([env.KV.get("puzzle:" + date, "json"), env.KV.get("launch")]);
        if (!puzzle) return json({ error: "Não há desafio para essa data." }, 404, { "Cache-Control": "no-store" });
        const maxAge = date === today ? Math.min(600, secondsToMidnightBRT()) : 86400;
        return json({ ...puzzle, launch, today }, 200, { "Cache-Control": `public, max-age=${maxAge}` });
      });
    }

    if (url.pathname.startsWith("/api/clip/")) {
      const id = url.pathname.slice("/api/clip/".length).replace(/\.mp3$/, "");
      if (!/^[a-f0-9]{32}$/.test(id)) return new Response("Não encontrado", { status: 404 });
      return cached(new Request(`${url.origin}/api/clip/${id}`), ctx, async () => {
        const buf = await env.KV.get("clip:" + id, "arrayBuffer");
        if (!buf) return new Response("Não encontrado", { status: 404 });
        return new Response(buf, { headers: { "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=31536000, immutable" } });
      });
    }

    if (url.pathname === "/catalog.json") {
      return cached(new Request(`${url.origin}/catalog.json?d=${todayBRT()}`), ctx, async () => {
        const body = await env.KV.get("catalog");
        if (!body) return json({ franchises: [] }, 503, { "Cache-Control": "no-store" });
        return new Response(body, { headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
      });
    }

    if (url.pathname === "/api/today") return json({ today: todayBRT() }, 200, { "Cache-Control": "no-store" });

    return env.ASSETS.fetch(request);
  }
};
