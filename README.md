# OPdle e Luandle

Jogos diários de adivinhar a música pelo trecho. 5 por dia, iguais para todo mundo, com trechos de 1s → 2s → 4s → 7s → 11s → 16s.

- `/` — **OPdle**: adivinhe o anime pela abertura.
- `/luan/` — **Luandle**: adivinhe a música do Luan Santana.

## Áudio

O áudio vem das prévias oficiais de 30s da Apple Music/iTunes. O navegador busca cada música na API pública do iTunes (JSONP, sem chave), descarta versões ao vivo, acústicas, remix e instrumentais, e guarda o resultado em cache. Funciona em qualquer hospedagem estática, inclusive abrindo o arquivo direto do disco.

## Conferir as músicas

Abra `index.html#conferir` (ou `luan/#conferir`). Para cada música aparece a faixa que o iTunes achou, com capa e álbum. Dá para:

- ouvir 2s ou a prévia inteira;
- trocar para outro resultado, se a faixa estiver errada;
- marcar ou ajustar o segundo em que o trecho começa.

As escolhas valem no aparelho na hora. **Copiar lista** gera um texto com o `trackId` e o `start` de cada música para fixar no `songs.js`, e aí vale para todo mundo.

## Adicionar músicas

```js
{ anime: "Haikyuu!!", aliases: ["ハイキュー!!"], song: "Imagination", artist: "SPYAIR",
  itunes: { term: "SPYAIR Imagination", artist: "SPYAIR", title: ["Imagination"] },
  start: 0, tier: 1 }
```

- `anime` é a resposta (no Luandle, o nome da música).
- `itunes.artist` e `itunes.title` aceitam listas, útil para nomes em japonês.
- `trackId` (opcional) fixa a faixa e pula a busca.
- `tier` 1 vai para as primeiras rodadas do dia; 2 para as últimas.

## Como funciona

- **Sorteio do dia**: a data local vira a seed de um PRNG que escolhe 5 respostas diferentes.
- **Progresso**: salvo no `localStorage` por data.
- **Pontos**: acertar na tentativa *n* (1 a 6) vale `7 - n`. Máximo 30.
- **Compartilhar**: 🟩 acerto, 🟥 erro, ⬛ pulo, ⬜ não usado.
