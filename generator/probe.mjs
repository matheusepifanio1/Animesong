import fs from "node:fs"; globalThis.fsMod = fs;
const AL = "https://graphql.anilist.co";
const q = `query($page:Int){ Page(page:$page, perPage:3){ pageInfo{hasNextPage}
  media(type:ANIME, sort:POPULARITY_DESC, isAdult:false){ id format popularity seasonYear genres synonyms
    title{romaji english native} coverImage{large color}
    relations{ edges{ relationType node{ id type format } } }
    characters(role:MAIN, sort:[ROLE,RELEVANCE,ID], perPage:3){ nodes{ name{full} } } } } }`;
let r = await fetch(AL, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ query: q, variables: { page: 1 } }) });
console.log("ANILIST", r.status, "limit", r.headers.get("x-ratelimit-limit"), r.headers.get("x-ratelimit-remaining"));
const al = await r.json();
console.log(JSON.stringify(al, null, 1).slice(0, 3000));
const ids = al.data.Page.media.map((m) => m.id).join(",");
const u = `https://api.animethemes.moe/anime?filter[has]=resources&filter[site]=AniList&filter[external_id]=${ids}&include=resources,animethemes.song.artists,animethemes.animethemeentries.videos.audio&page[size]=25`;
r = await fetch(u, { headers: { "User-Agent": "opdle-generator (github.com/matheusepifanio1/animesong)" } });
console.log("ANIMETHEMES", r.status, r.headers.get("x-ratelimit-limit"), r.headers.get("x-ratelimit-remaining"));
const at = await r.json();
console.log("count", at.anime?.length, Object.keys(at));
for (const a of at.anime || []) {
  console.log("ANIME", a.name, a.slug, a.year, (a.resources||[]).filter(x=>x.site==="AniList").map(x=>x.external_id));
  for (const t of (a.animethemes||[]).slice(0, 3)) {
    console.log("  THEME", t.type, t.sequence, t.slug, t.song?.title, (t.song?.artists||[]).map(x=>x.name));
    for (const e of (t.animethemeentries||[]).slice(0,1)) {
      console.log("    ENTRY", JSON.stringify({ v: e.version, ep: e.episodes, sp: e.spoiler, nsfw: e.nsfw }));
      for (const v of (e.videos||[]).slice(0,2)) console.log("      VIDEO", JSON.stringify({ link: v.link, nc: v.nc, overlap: v.overlap, source: v.source, res: v.resolution, audio: v.audio && { link: v.audio.link, size: v.audio.size, keys: Object.keys(v.audio) } }));
    }
  }
}
const first = at.anime?.[0]?.animethemes?.[0]?.animethemeentries?.[0]?.videos?.[0]?.audio?.link;
console.log("AUDIO", first);
if (first) {
  const { execFileSync } = await import("node:child_process");
  console.log(execFileSync("ffprobe", ["-v","error","-show_entries","format=duration,format_name:stream=codec_name,sample_rate,channels","-of","json", first]).toString());
  const t0 = Date.now();
  execFileSync("ffmpeg", ["-v","error","-y","-ss","20","-t","16.5","-i",first,"-ac","1","-b:a","96k","/tmp/clip.mp3"]);
  console.log("cut ms", Date.now()-t0, require_size());
}
function require_size(){ try { return (awaitSize()); } catch(e){ return e.message } }
function awaitSize(){ return String(globalThis.process ? (await_fs()) : 0); }
function await_fs(){ const fs = globalThis.fsMod; return fs ? fs.statSync("/tmp/clip.mp3").size : "?"; }
