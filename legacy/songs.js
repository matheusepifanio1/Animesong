// Lista de aberturas do OPdle.
// Campos:
//   anime     nome canônico (é a resposta certa)
//   aliases   outros nomes aceitos (romaji, inglês, japonês)
//   song      nome da música (revelado no fim da rodada)
//   artist    artista
//   itunes    como achar a faixa no iTunes:
//               term   o que buscar
//               artist nome(s) do artista como aparece no iTunes (basta conter)
//               title  nomes possíveis da faixa
//   trackId   (opcional) ID fixo da faixa no iTunes; quando existe, a busca é pulada
//   start     segundo da prévia de 30s onde o trecho começa
//   tier      1 = muito famosa (rodadas iniciais), 2 = um pouco mais difícil
//   youtubeId (opcional) só para o link "YouTube" no fim da rodada
//
// Use o modo #conferir (index.html#conferir) para ver o que o iTunes achou para cada música.

window.ANIME_OP_SONGS = [
  { anime: "Oshi no Ko", aliases: ["【推しの子】", "推しの子", "My Star"], song: "Idol (アイドル)", artist: "YOASOBI",
    itunes: { term: "YOASOBI Idol", artist: "YOASOBI", title: ["Idol", "アイドル"] }, youtubeId: "ZRtdQ81jPUQ", start: 0, tier: 1 },
  { anime: "Chainsaw Man", aliases: ["チェンソーマン"], song: "KICK BACK", artist: "Kenshi Yonezu",
    itunes: { term: "Kenshi Yonezu KICK BACK", artist: ["Kenshi Yonezu", "米津玄師"], title: ["KICK BACK"] }, youtubeId: "M2cckDmNLMI", start: 0, tier: 1 },
  { anime: "Spy x Family", aliases: ["SPY×FAMILY", "Spy Family"], song: "Mixed Nuts", artist: "Official HIGE DANdism",
    itunes: { term: "Official HIGE DANdism Mixed Nuts", artist: ["Official HIGE DANdism", "Official髭男dism"], title: ["Mixed Nuts", "ミックスナッツ"] }, youtubeId: "CbH2F0kXgTY", start: 0, tier: 1 },
  { anime: "Mashle", aliases: ["マッシュル", "Mashle: Magic and Muscles"], song: "Bling-Bang-Bang-Born", artist: "Creepy Nuts",
    itunes: { term: "Creepy Nuts Bling-Bang-Bang-Born", artist: "Creepy Nuts", title: ["Bling-Bang-Bang-Born"] }, youtubeId: "mLW35YMzELE", start: 0, tier: 2 },
  { anime: "My Hero Academia", aliases: ["Boku no Hero Academia", "僕のヒーローアカデミア", "Hero Aca", "Boku no Hero"], song: "Peace Sign", artist: "Kenshi Yonezu",
    itunes: { term: "Kenshi Yonezu Peace Sign", artist: ["Kenshi Yonezu", "米津玄師"], title: ["Peace Sign", "ピースサイン"] }, youtubeId: "9aJVr5tTTWk", start: 0, tier: 1 },
  { anime: "Naruto Shippuden", aliases: ["Naruto Shippuuden", "NARUTO -ナルト- 疾風伝"], song: "Silhouette", artist: "KANA-BOON",
    itunes: { term: "KANA-BOON", artist: "KANA-BOON", title: ["Silhouette", "シルエット"] }, youtubeId: "dlFA0Zq1k2A", start: 0, tier: 1 },
  { anime: "Jujutsu Kaisen", aliases: ["呪術廻戦", "JJK"], song: "Kaikai Kitan (廻廻奇譚)", artist: "Eve",
    itunes: { term: "Eve Kaikai Kitan", artist: "Eve", title: ["Kaikai Kitan", "廻廻奇譚"] }, youtubeId: "1tk1pqwrOys", start: 0, tier: 1 },
  { anime: "Frieren", aliases: ["Sousou no Frieren", "葬送のフリーレン", "Frieren: Beyond Journey's End"], song: "Yuusha (勇者)", artist: "YOASOBI",
    itunes: { term: "YOASOBI", artist: "YOASOBI", title: ["The Brave", "Yuusha", "勇者"] }, youtubeId: "OIBODIPC_8Y", start: 0, tier: 2 },
  { anime: "Demon Slayer", aliases: ["Kimetsu no Yaiba", "鬼滅の刃"], song: "Gurenge (紅蓮華)", artist: "LiSA",
    itunes: { term: "LiSA Gurenge", artist: "LiSA", title: ["Gurenge", "紅蓮華"] }, youtubeId: "CwkzK-F0Y00", start: 0, tier: 1 },
  { anime: "Jujutsu Kaisen", aliases: ["呪術廻戦", "JJK"], song: "Ao no Sumika (青のすみか)", artist: "Tatsuya Kitani",
    itunes: { term: "Tatsuya Kitani", artist: ["Tatsuya Kitani", "キタニタツヤ"], title: ["Where Our Blue Is", "Ao no Sumika", "青のすみか"] }, youtubeId: "gcgKUcJKxIs", start: 0, tier: 2 },
  { anime: "Tokyo Revengers", aliases: ["東京リベンジャーズ"], song: "Cry Baby", artist: "Official HIGE DANdism",
    itunes: { term: "Official HIGE DANdism Cry Baby", artist: ["Official HIGE DANdism", "Official髭男dism"], title: ["Cry Baby"] }, youtubeId: "O1bhZgkC4Gw", start: 0, tier: 2 },
  { anime: "Naruto Shippuden", aliases: ["Naruto Shippuuden", "NARUTO -ナルト- 疾風伝"], song: "Blue Bird", artist: "Ikimonogakari",
    itunes: { term: "Ikimonogakari Blue Bird", artist: ["Ikimonogakari", "いきものがかり"], title: ["Blue Bird", "ブルーバード"] }, youtubeId: "aJRu5ltxXjc", start: 0, tier: 1 },
  { anime: "Tokyo Ghoul", aliases: ["東京喰種", "Tokyo Kushu"], song: "unravel", artist: "TK from Ling tosite sigure",
    itunes: { term: "TK from Ling tosite sigure unravel", artist: ["TK from", "凛として時雨"], title: ["unravel"] }, youtubeId: "gQMmVCv8P3w", start: 0, tier: 1 },
  { anime: "Dandadan", aliases: ["Dan Da Dan", "ダンダダン"], song: "Otonoke (オトノケ)", artist: "Creepy Nuts",
    itunes: { term: "Creepy Nuts Otonoke", artist: "Creepy Nuts", title: ["Otonoke", "オトノケ"] }, youtubeId: "tRwHpyOq4P4", start: 0, tier: 2 },
  { anime: "My Hero Academia", aliases: ["Boku no Hero Academia", "僕のヒーローアカデミア", "Hero Aca", "Boku no Hero"], song: "THE DAY", artist: "Porno Graffitti",
    itunes: { term: "Porno Graffitti THE DAY", artist: ["Porno Graffitti", "ポルノグラフィティ"], title: ["THE DAY"] }, youtubeId: "Th7MAZYFIMc", start: 0, tier: 2 },
  { anime: "Attack on Titan", aliases: ["Shingeki no Kyojin", "進撃の巨人", "AoT", "SnK"], song: "Guren no Yumiya (紅蓮の弓矢)", artist: "Linked Horizon",
    itunes: { term: "Linked Horizon", artist: "Linked Horizon", title: ["Guren no Yumiya", "紅蓮の弓矢", "Crimson Bow and Arrow"] }, youtubeId: "2B6nj38AdD0", start: 0, tier: 1 },
  { anime: "Bocchi the Rock!", aliases: ["ぼっち・ざ・ろっく！", "Bocchi"], song: "Seishun Complex (青春コンプレックス)", artist: "Kessoku Band",
    itunes: { term: "kessoku band", artist: ["kessoku band", "結束バンド"], title: ["Seishun Complex", "青春コンプレックス"] }, youtubeId: "Yd8kUoB72xU", start: 0, tier: 2 },
  { anime: "Spy x Family", aliases: ["SPY×FAMILY", "Spy Family"], song: "SOUVENIR", artist: "BUMP OF CHICKEN",
    itunes: { term: "BUMP OF CHICKEN SOUVENIR", artist: "BUMP OF CHICKEN", title: ["SOUVENIR"] }, youtubeId: "ck2OiGpXaXw", start: 0, tier: 2 },
  { anime: "Fullmetal Alchemist: Brotherhood", aliases: ["Hagane no Renkinjutsushi", "鋼の錬金術師", "FMA", "FMAB", "Fullmetal Alchemist"], song: "again", artist: "YUI",
    itunes: { term: "YUI again", artist: "YUI", title: ["again"] }, youtubeId: "w5OUAY1j3gQ", start: 0, tier: 1 },
  { anime: "Solo Leveling", aliases: ["Ore dake Level Up na Ken", "俺だけレベルアップな件"], song: "LEveL", artist: "SawanoHiroyuki[nZk]:TOMORROW X TOGETHER",
    itunes: { term: "SawanoHiroyuki LEveL", artist: ["SawanoHiroyuki", "TOMORROW X TOGETHER"], title: ["LEveL"] }, youtubeId: "9KBl_UurkEc", start: 0, tier: 2 },
  { anime: "Cowboy Bebop", aliases: ["カウボーイビバップ"], song: "Tank!", artist: "Yoko Kanno & SEATBELTS",
    itunes: { term: "Seatbelts Tank", artist: ["Seatbelts", "Yoko Kanno"], title: ["Tank!"] }, youtubeId: "d75ov4HvRrM", start: 0, tier: 2 },
  { anime: "Attack on Titan", aliases: ["Shingeki no Kyojin", "進撃の巨人", "AoT", "SnK"], song: "Shinzou wo Sasageyo! (心臓を捧げよ!)", artist: "Linked Horizon",
    itunes: { term: "Linked Horizon Shinzou wo Sasageyo", artist: "Linked Horizon", title: ["Shinzou wo Sasageyo", "心臓を捧げよ", "Sasageyo"] }, youtubeId: "8QPyFlJNmus", start: 0, tier: 1 },
  { anime: "Vinland Saga", aliases: ["ヴィンランド・サガ"], song: "MUKANJYO", artist: "Survive Said The Prophet",
    itunes: { term: "Survive Said The Prophet MUKANJYO", artist: "Survive Said The Prophet", title: ["MUKANJYO"] }, youtubeId: "l5wAdQ-UkWY", start: 0, tier: 2 }
];

// Animes que aparecem no autocomplete mesmo sem música na lista (servem de "pegadinha"
// para a lista de opções não entregar a resposta). Formato: [nome, ...apelidos]
window.ANIME_EXTRA_TITLES = [
  ["One Piece", "ワンピース"], ["Naruto", "ナルト"], ["Boruto"], ["Dragon Ball Z", "DBZ"], ["Dragon Ball Super"],
  ["Bleach", "ブリーチ"], ["Hunter x Hunter", "HxH"], ["Death Note", "デスノート"], ["Sword Art Online", "SAO"],
  ["Black Clover"], ["Haikyuu!!", "Haikyu"], ["Mob Psycho 100"], ["One Punch Man", "OPM"], ["Steins;Gate"],
  ["Code Geass"], ["Neon Genesis Evangelion", "Evangelion", "Eva"], ["Fire Force", "Enen no Shouboutai"],
  ["Blue Lock"], ["Kaguya-sama: Love is War", "Kaguya-sama"], ["Re:Zero"], ["Your Lie in April", "Shigatsu wa Kimi no Uso"],
  ["Violet Evergarden"], ["Dr. Stone"], ["The Promised Neverland", "Yakusoku no Neverland"], ["JoJo's Bizarre Adventure", "JoJo"],
  ["Sailor Moon"], ["Bungo Stray Dogs"], ["Hellsing"], ["Parasyte", "Kiseijuu"], ["Made in Abyss"], ["Kaiju No. 8"],
  ["Sakamoto Days"], ["Wind Breaker"], ["Gintama"], ["Fairy Tail"], ["Toradora!"], ["Angel Beats!"], ["Noragami"],
  ["Assassination Classroom", "Ansatsu Kyoushitsu"], ["Beastars"], ["Overlord"],
  ["That Time I Got Reincarnated as a Slime", "Tensura"], ["Konosuba"], ["Cyberpunk: Edgerunners"], ["Lycoris Recoil"],
  ["Horimiya"], ["Mushoku Tensei"], ["Blue Exorcist", "Ao no Exorcist"], ["Seven Deadly Sins", "Nanatsu no Taizai"],
  ["Hell's Paradise", "Jigokuraku"], ["Tokyo Ghoul:re"], ["Inuyasha"], ["Yu Yu Hakusho"],
  ["Saint Seiya", "Cavaleiros do Zodíaco"], ["Pokémon", "Pokemon"], ["Digimon Adventure", "Digimon"]
];
