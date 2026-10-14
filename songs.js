// Lista de aberturas do OPdle.
// Campos:
//   anime     nome canônico (é a resposta certa)
//   aliases   outros nomes aceitos (romaji, inglês, japonês)
//   song      nome da música (revelado no fim da rodada)
//   artist    artista
//   youtubeId ID do vídeo oficial no YouTube (o que vem depois de watch?v=)
//   start     segundo do vídeo onde o trecho começa (ajuste se o vídeo tiver intro/silêncio)
//   tier      1 = muito famosa (rodadas iniciais), 2 = um pouco mais difícil
//
// Todos os IDs abaixo foram conferidos via oEmbed do YouTube em 13/10/2026.
// Rode `node validate.mjs` para checar de novo (vídeos somem ou bloqueiam embed com o tempo).

window.ANIME_OP_SONGS = [
  { anime: "Oshi no Ko", aliases: ["【推しの子】", "推しの子", "My Star"], song: "Idol (アイドル)", artist: "YOASOBI", youtubeId: "ZRtdQ81jPUQ", start: 0, tier: 1 },
  { anime: "Chainsaw Man", aliases: ["チェンソーマン"], song: "KICK BACK", artist: "Kenshi Yonezu", youtubeId: "M2cckDmNLMI", start: 0, tier: 1 },
  { anime: "Spy x Family", aliases: ["SPY×FAMILY", "Spy Family"], song: "Mixed Nuts", artist: "Official HIGE DANdism", youtubeId: "CbH2F0kXgTY", start: 0, tier: 1 },
  { anime: "Mashle", aliases: ["マッシュル", "Mashle: Magic and Muscles"], song: "Bling-Bang-Bang-Born", artist: "Creepy Nuts", youtubeId: "mLW35YMzELE", start: 0, tier: 2 },
  { anime: "My Hero Academia", aliases: ["Boku no Hero Academia", "僕のヒーローアカデミア", "Hero Aca", "Boku no Hero"], song: "Peace Sign", artist: "Kenshi Yonezu", youtubeId: "9aJVr5tTTWk", start: 0, tier: 1 },
  { anime: "Naruto Shippuden", aliases: ["Naruto Shippuuden", "NARUTO -ナルト- 疾風伝"], song: "Silhouette", artist: "KANA-BOON", youtubeId: "dlFA0Zq1k2A", start: 0, tier: 1 },
  { anime: "Jujutsu Kaisen", aliases: ["呪術廻戦", "JJK"], song: "Kaikai Kitan (廻廻奇譚)", artist: "Eve", youtubeId: "1tk1pqwrOys", start: 0, tier: 1 },
  { anime: "Frieren", aliases: ["Sousou no Frieren", "葬送のフリーレン", "Frieren: Beyond Journey's End"], song: "Yuusha (勇者)", artist: "YOASOBI", youtubeId: "OIBODIPC_8Y", start: 0, tier: 2 },
  { anime: "Demon Slayer", aliases: ["Kimetsu no Yaiba", "鬼滅の刃"], song: "Gurenge (紅蓮華)", artist: "LiSA", youtubeId: "CwkzK-F0Y00", start: 0, tier: 1 },
  { anime: "Jujutsu Kaisen", aliases: ["呪術廻戦", "JJK"], song: "Ao no Sumika (青のすみか)", artist: "Tatsuya Kitani", youtubeId: "gcgKUcJKxIs", start: 0, tier: 2 },
  { anime: "Tokyo Revengers", aliases: ["東京リベンジャーズ"], song: "Cry Baby", artist: "Official HIGE DANdism", youtubeId: "O1bhZgkC4Gw", start: 0, tier: 2 },
  { anime: "Naruto Shippuden", aliases: ["Naruto Shippuuden", "NARUTO -ナルト- 疾風伝"], song: "Blue Bird", artist: "Ikimonogakari", youtubeId: "aJRu5ltxXjc", start: 0, tier: 1 },
  { anime: "Tokyo Ghoul", aliases: ["東京喰種", "Tokyo Kushu"], song: "unravel", artist: "TK from Ling tosite sigure", youtubeId: "gQMmVCv8P3w", start: 0, tier: 1 },
  { anime: "Dandadan", aliases: ["Dan Da Dan", "ダンダダン"], song: "Otonoke (オトノケ)", artist: "Creepy Nuts", youtubeId: "tRwHpyOq4P4", start: 0, tier: 2 },
  { anime: "My Hero Academia", aliases: ["Boku no Hero Academia", "僕のヒーローアカデミア", "Hero Aca", "Boku no Hero"], song: "THE DAY", artist: "Porno Graffitti", youtubeId: "Th7MAZYFIMc", start: 0, tier: 2 },
  { anime: "Attack on Titan", aliases: ["Shingeki no Kyojin", "進撃の巨人", "AoT", "SnK"], song: "Guren no Yumiya (紅蓮の弓矢)", artist: "Linked Horizon", youtubeId: "2B6nj38AdD0", start: 0, tier: 1 },
  { anime: "Bocchi the Rock!", aliases: ["ぼっち・ざ・ろっく！", "Bocchi"], song: "Seishun Complex (青春コンプレックス)", artist: "Kessoku Band", youtubeId: "Yd8kUoB72xU", start: 0, tier: 2 },
  { anime: "Spy x Family", aliases: ["SPY×FAMILY", "Spy Family"], song: "SOUVENIR", artist: "BUMP OF CHICKEN", youtubeId: "ck2OiGpXaXw", start: 0, tier: 2 },
  { anime: "Fullmetal Alchemist: Brotherhood", aliases: ["Hagane no Renkinjutsushi", "鋼の錬金術師", "FMA", "FMAB", "Fullmetal Alchemist"], song: "again", artist: "YUI", youtubeId: "w5OUAY1j3gQ", start: 0, tier: 1 },
  { anime: "Solo Leveling", aliases: ["Ore dake Level Up na Ken", "俺だけレベルアップな件"], song: "LEveL", artist: "SawanoHiroyuki[nZk]:TOMORROW X TOGETHER", youtubeId: "9KBl_UurkEc", start: 0, tier: 2 },
  { anime: "Cowboy Bebop", aliases: ["カウボーイビバップ"], song: "Tank!", artist: "Yoko Kanno & SEATBELTS", youtubeId: "d75ov4HvRrM", start: 0, tier: 2 },
  { anime: "Attack on Titan", aliases: ["Shingeki no Kyojin", "進撃の巨人", "AoT", "SnK"], song: "Shinzou wo Sasageyo! (心臓を捧げよ!)", artist: "Linked Horizon", youtubeId: "8QPyFlJNmus", start: 0, tier: 1 },
  { anime: "Vinland Saga", aliases: ["ヴィンランド・サガ"], song: "MUKANJYO", artist: "Survive Said The Prophet", youtubeId: "l5wAdQ-UkWY", start: 0, tier: 2 }
];

// Animes que aparecem no autocomplete mesmo sem música na lista (servem de "pegadinha"
// para a lista de opções não entregar a resposta). Formato: [nome, ...apelidos]
window.ANIME_EXTRA_TITLES = [
  ["One Piece", "ワンピース"],
  ["Naruto", "ナルト"],
  ["Boruto"],
  ["Dragon Ball Z", "DBZ"],
  ["Dragon Ball Super"],
  ["Bleach", "ブリーチ"],
  ["Hunter x Hunter", "HxH"],
  ["Death Note", "デスノート"],
  ["Sword Art Online", "SAO"],
  ["Black Clover"],
  ["Haikyuu!!", "Haikyu"],
  ["Mob Psycho 100"],
  ["One Punch Man", "OPM"],
  ["Steins;Gate"],
  ["Code Geass"],
  ["Neon Genesis Evangelion", "Evangelion", "Eva"],
  ["Fire Force", "Enen no Shouboutai"],
  ["Blue Lock"],
  ["Kaguya-sama: Love is War", "Kaguya-sama"],
  ["Re:Zero"],
  ["Your Lie in April", "Shigatsu wa Kimi no Uso"],
  ["Violet Evergarden"],
  ["Dr. Stone"],
  ["The Promised Neverland", "Yakusoku no Neverland"],
  ["JoJo's Bizarre Adventure", "JoJo"],
  ["Sailor Moon"],
  ["Bungo Stray Dogs"],
  ["Hellsing"],
  ["Parasyte", "Kiseijuu"],
  ["Made in Abyss"],
  ["Kaiju No. 8"],
  ["Sakamoto Days"],
  ["Wind Breaker"],
  ["Gintama"],
  ["Fairy Tail"],
  ["Toradora!"],
  ["Angel Beats!"],
  ["Noragami"],
  ["Assassination Classroom", "Ansatsu Kyoushitsu"],
  ["Beastars"],
  ["Overlord"],
  ["That Time I Got Reincarnated as a Slime", "Tensura"],
  ["Konosuba"],
  ["Cyberpunk: Edgerunners"],
  ["Lycoris Recoil"],
  ["Horimiya"],
  ["Mushoku Tensei"],
  ["Blue Exorcist", "Ao no Exorcist"],
  ["Seven Deadly Sins", "Nanatsu no Taizai"],
  ["Hell's Paradise", "Jigokuraku"],
  ["Tokyo Ghoul:re"],
  ["Inuyasha"],
  ["Yu Yu Hakusho"],
  ["Saint Seiya", "Cavaleiros do Zodíaco"],
  ["Pokémon", "Pokemon"],
  ["Digimon Adventure", "Digimon"]
];
