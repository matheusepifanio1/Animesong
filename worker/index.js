// Worker do OPdle na Cloudflare.
// - Arquivos do site: pasta public/ (servidos antes deste código quando o arquivo existe).
// - GET /api/puzzle[?date=AAAA-MM-DD]  desafio do dia (só hoje ou dias passados, horário de Brasília)
// - GET /api/clip/<id>                 trecho de áudio (MP3)
// Dados no KV (binding KV): "puzzle:<data>" (JSON), "clip:<id>" (MP3), "state" (histórico do gerador).

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
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
