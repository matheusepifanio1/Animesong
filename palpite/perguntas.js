// Perguntas do Palpite Otaku. Toda resposta é um número inteiro.
//   q      pergunta
//   a      resposta
//   unit   unidade mostrada ao lado do número (opcional)
//   kind   "ano" para anos (os rivais chutam em volta em anos); "num" para o resto
//   note   curiosidade mostrada na revelação (opcional)
//
// Prefira fatos que não mudam (séries terminadas, dados oficiais fixos).

window.PERGUNTAS = [
  { q: "Quantos episódios tem Naruto clássico (antes do Shippuden)?", a: 220, unit: "episódios", kind: "num" },
  { q: "Quantos episódios tem Naruto Shippuden?", a: 500, unit: "episódios", kind: "num" },
  { q: "Quantos episódios tem Fullmetal Alchemist: Brotherhood?", a: 64, unit: "episódios", kind: "num" },
  { q: "Quantos episódios tem o anime de Death Note?", a: 37, unit: "episódios", kind: "num" },
  { q: "Quantos episódios tem Dragon Ball Z?", a: 291, unit: "episódios", kind: "num" },
  { q: "Quantos episódios tem Dragon Ball GT?", a: 64, unit: "episódios", kind: "num" },
  { q: "Quantos episódios tem a série de TV de Neon Genesis Evangelion?", a: 26, unit: "episódios", kind: "num" },
  { q: "Quantos episódios tem Cowboy Bebop?", a: 26, unit: "episódios", kind: "num" },
  { q: "Quantos episódios tem Hunter x Hunter (2011)?", a: 148, unit: "episódios", kind: "num" },
  { q: "Quantos episódios teve Bleach na exibição original (antes de Thousand-Year Blood War)?", a: 366, unit: "episódios", kind: "num" },
  { q: "Quantos episódios tem a série clássica de Sailor Moon, somando as 5 temporadas?", a: 200, unit: "episódios", kind: "num" },
  { q: "Quantos episódios tem o InuYasha original (sem o Kanketsu-hen)?", a: 167, unit: "episódios", kind: "num" },
  { q: "Quantos episódios tem Yu Yu Hakusho?", a: 112, unit: "episódios", kind: "num" },
  { q: "Quantos episódios tem Code Geass, somando R1 e R2?", a: 50, unit: "episódios", kind: "num" },
  { q: "Quantos episódios tem a série de TV de Steins;Gate (a primeira)?", a: 24, unit: "episódios", kind: "num" },

  { q: "Qual a altura do Titã Colossal, em metros?", a: 60, unit: "m", kind: "num" },
  { q: "Qual a altura das muralhas Maria, Rose e Sina, em metros?", a: 50, unit: "m", kind: "num" },
  { q: "Qual a altura oficial do Levi Ackerman, em centímetros?", a: 160, unit: "cm", kind: "num" },
  { q: "Qual a altura oficial do All Might, em centímetros?", a: 220, unit: "cm", kind: "num" },
  { q: "Qual a altura oficial do Saitama, em centímetros?", a: 175, unit: "cm", kind: "num" },

  { q: "De quanto foi a recompensa do Luffy depois do arco de Wano?", a: 3000000000, unit: "berries", kind: "num", note: "Mesmo valor das recompensas de Kid e Law, que subiram junto." },
  { q: "Quantas flexões por dia Saitama fazia no treino que o deixou careca?", a: 100, unit: "flexões", kind: "num", note: "Mais 100 abdominais, 100 agachamentos e 10 km de corrida." },
  { q: "Quantos Hashira existem em Demon Slayer?", a: 9, unit: "Hashira", kind: "num" },
  { q: "Quantas constelações (e Cavaleiros) existem em Cavaleiros do Zodíaco?", a: 88, unit: "constelações", kind: "num" },
  { q: "Quantos Pokémon existem na primeira geração?", a: 151, unit: "Pokémon", kind: "num" },
  { q: "Quantos anos o Light Yagami tem no começo de Death Note?", a: 17, unit: "anos", kind: "num" },
  { q: "Quantos anos o Gon tem no começo de Hunter x Hunter?", a: 12, unit: "anos", kind: "num" },
  { q: "Quantos anos o Naruto tem no começo do anime?", a: 12, unit: "anos", kind: "num" },

  { q: "Em que ano o anime de Dragon Ball estreou no Japão?", a: 1986, kind: "ano" },
  { q: "Em que ano o anime de Pokémon estreou no Japão?", a: 1997, kind: "ano" },
  { q: "Em que ano o anime de Sailor Moon estreou no Japão?", a: 1992, kind: "ano" },
  { q: "Em que ano o anime de One Piece estreou no Japão?", a: 1999, kind: "ano" },
  { q: "Em que ano Cowboy Bebop estreou no Japão?", a: 1998, kind: "ano" },
  { q: "Em que ano o filme Akira foi lançado?", a: 1988, kind: "ano" },
  { q: "Em que ano A Viagem de Chihiro foi lançado no Japão?", a: 2001, kind: "ano" },
  { q: "Em que ano o filme Your Name (Kimi no Na wa) foi lançado?", a: 2016, kind: "ano" }
];
