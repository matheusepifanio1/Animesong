# OPdle

Jogo diário de adivinhar o anime pela abertura. 5 aberturas por dia, iguais para todo mundo, com trechos de 1s → 2s → 4s → 7s → 11s → 16s.

## Rodar

O player do YouTube não toca com o arquivo aberto direto do disco (`file://`), então sirva a pasta:

```bash
npx serve .
# ou
python -m http.server 8000
```

Para publicar, qualquer hospedagem estática serve: GitHub Pages, Netlify, Cloudflare Pages.

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | O jogo inteiro (HTML, CSS e JS, sem build) |
| `songs.js` | Lista de aberturas + animes extras do autocomplete |
| `validate.mjs` | Confere se os vídeos existem e permitem embed |

## Adicionar músicas

Acrescente um objeto em `window.ANIME_OP_SONGS`:

```js
{ anime: "Haikyuu!!", aliases: ["ハイキュー!!", "Haikyu"], song: "Imagination", artist: "SPYAIR",
  youtubeId: "XXXXXXXXXXX", start: 0, tier: 1 }
```

- `anime` é a resposta. Animes com o mesmo `anime` contam como o mesmo (o jogo nunca sorteia dois do mesmo anime no dia).
- `start` é o segundo onde o trecho começa. Se o clipe tem intro falada ou silêncio, ajuste aqui.
- `tier` 1 vai para as primeiras rodadas do dia; 2 para as últimas.
- Se o anime já está em `ANIME_EXTRA_TITLES`, pode tirar de lá (não é obrigatório).

Depois rode:

```bash
node validate.mjs
```

Prefira vídeos de canais oficiais (do artista, Aniplex, TOHO animation, Crunchyroll, canais "- Topic"), que tendem a durar mais e liberar embed.

## Como funciona

- **Sorteio do dia**: a data local (`AAAA-MM-DD`) vira a seed de um PRNG; ele embaralha a lista e pega os 5 primeiros animes diferentes. Não precisa de backend.
- **Número do desafio**: dias desde `LAUNCH` (`2026-10-13`) no topo do script.
- **Progresso**: salvo no `localStorage` por data. Volume também.
- **Pontos**: acertar na tentativa *n* (1 a 6) vale `7 - n`. Máximo 30.
- **Compartilhar**: 🟩 acerto, 🟥 erro, ⬛ pulo, ⬜ não usado.
- **Modo treino**: depois de terminar o dia, sorteia 5 aleatórias que não ficam salvas.
- No console do navegador, `OPDLE.pickSongs("2026-10-20")` mostra o que sai em qualquer data.

## Observações

- A capa por cima do player esconde título e miniatura. As regras da API do YouTube pedem player visível, então isso é zona cinzenta, comum em jogos de fã.
- Com 23 músicas, aberturas se repetem em poucos dias. O ideal é chegar a 150+ antes de divulgar.
