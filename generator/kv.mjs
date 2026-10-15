// Ferramentas para o KV da Cloudflare usadas pelo workflow.
//   node generator/kv.mjs ns                 -> garante o namespace "opdle-data" e imprime o id
//   node generator/kv.mjs pull-state <arq>   -> baixa o histórico do gerador (se existir)
//   node generator/kv.mjs push <pasta out>   -> envia desafios, trechos, catálogo e histórico
// Precisa de CLOUDFLARE_API_TOKEN e CLOUDFLARE_ACCOUNT_ID no ambiente.

import fs from "node:fs";
import path from "node:path";

const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ACC = process.env.CLOUDFLARE_ACCOUNT_ID;
const TITLE = "opdle-data";
if (!TOKEN || !ACC) { console.error("Faltam CLOUDFLARE_API_TOKEN e/ou CLOUDFLARE_ACCOUNT_ID."); process.exit(1); }
const API = `https://api.cloudflare.com/client/v4/accounts/${ACC}/storage/kv/namespaces`;
const H = { Authorization: `Bearer ${TOKEN}` };

async function cf(url, opts = {}) {
  const r = await fetch(url, { ...opts, headers: { ...H, ...(opts.headers || {}) } });
  if (opts.raw) return r;
  const d = await r.json().catch(() => ({}));
  if (!r.ok || d.success === false) throw new Error(`Cloudflare ${r.status}: ${JSON.stringify(d.errors || d).slice(0, 400)}`);
  return d;
}

async function nsId() {
  for (let page = 1; page < 20; page++) {
    const d = await cf(`${API}?per_page=100&page=${page}`);
    const hit = d.result.find((n) => n.title === TITLE);
    if (hit) return hit.id;
    if (d.result.length < 100) break;
  }
  const d = await cf(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: TITLE }) });
  return d.result.id;
}

async function bulkPut(ns, pairs) {
  // a API aceita até 10.000 pares e 100 MB por chamada; mandamos em lotes de ~40 MB
  let batch = [], size = 0, sent = 0;
  const flush = async () => {
    if (!batch.length) return;
    await cf(`${API}/${ns}/bulk`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(batch) });
    sent += batch.length; console.log(`KV: ${sent}/${pairs.length} chaves enviadas`);
    batch = []; size = 0;
  };
  for (const p of pairs) {
    const s = p.value.length + p.key.length + 64;
    if (batch.length && (size + s > 40e6 || batch.length >= 5000)) await flush();
    batch.push(p); size += s;
  }
  await flush();
}

const [cmd, arg] = process.argv.slice(2);
const ns = await nsId();

if (cmd === "ns") {
  console.log(ns);
} else if (cmd === "pull-state") {
  const r = await cf(`${API}/${ns}/values/state`, { raw: true });
  if (r.status === 404) console.error("Ainda não há histórico; o gerador vai começar do zero.");
  else if (!r.ok) throw new Error(`Falha ao baixar o histórico: HTTP ${r.status}`);
  else { fs.writeFileSync(arg, await r.text()); console.error("Histórico baixado."); }
} else if (cmd === "push") {
  const out = arg;
  const pairs = [];
  const pz = path.join(out, "puzzles"), cl = path.join(out, "clips");
  if (fs.existsSync(cl)) for (const f of fs.readdirSync(cl)) pairs.push({ key: "clip:" + f.replace(/\.mp3$/, ""), value: fs.readFileSync(path.join(cl, f)).toString("base64"), base64: true });
  if (fs.existsSync(pz)) for (const f of fs.readdirSync(pz)) pairs.push({ key: "puzzle:" + f.replace(/\.json$/, ""), value: fs.readFileSync(path.join(pz, f), "utf8") });
  if (fs.existsSync(path.join(out, "catalog.json"))) pairs.push({ key: "catalog", value: fs.readFileSync(path.join(out, "catalog.json"), "utf8") });
  if (fs.existsSync(path.join(out, "state.json"))) {
    const state = fs.readFileSync(path.join(out, "state.json"), "utf8");
    pairs.push({ key: "state", value: state });
    pairs.push({ key: "launch", value: JSON.parse(state).launch });
  }
  // trechos e desafios antes do histórico: se algo falhar no meio, o histórico não avança
  await bulkPut(ns, pairs);
} else {
  console.error("Comando desconhecido:", cmd); process.exit(1);
}
