// Confere se cada vídeo de songs.js existe e permite embed.
// Uso: node validate.mjs   (Node 18+)
import { readFileSync } from "node:fs";
import vm from "node:vm";

const code = readFileSync(new URL("./songs.js", import.meta.url), "utf8");
const ctx = { window: {} };
vm.runInNewContext(code, ctx);
const songs = ctx.window.ANIME_OP_SONGS || [];

const seen = new Map();
let problems = 0;

for (const s of songs) {
  const label = `${s.anime} · ${s.song}`;
  if (seen.has(s.youtubeId)) {
    console.log(`DUPLICADO  ${label} (mesmo ID de ${seen.get(s.youtubeId)})`);
    problems++;
  }
  seen.set(s.youtubeId, label);

  const url = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent("https://www.youtube.com/watch?v=" + s.youtubeId)}`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const j = await res.json();
      console.log(`OK         ${label}\n           ↳ "${j.title}" — ${j.author_name}`);
    } else if (res.status === 401 || res.status === 403) {
      console.log(`SEM EMBED  ${label} (${s.youtubeId}) — o dono bloqueou tocar fora do YouTube`);
      problems++;
    } else {
      console.log(`SUMIU      ${label} (${s.youtubeId}) — HTTP ${res.status}`);
      problems++;
    }
  } catch (e) {
    console.log(`ERRO       ${label} — ${e.message}`);
    problems++;
  }
}

const animes = new Set(songs.map((s) => s.anime.toLowerCase()));
console.log(`\n${songs.length} músicas, ${animes.size} animes diferentes, ${problems} problema(s).`);
if (animes.size < 5) console.log("Atenção: o jogo precisa de pelo menos 5 animes diferentes.");
process.exitCode = problems ? 1 : 0;
