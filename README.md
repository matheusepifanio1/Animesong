# OPdle

Jogo diário: adivinhe o anime pela abertura. 5 aberturas por dia, iguais para todo mundo, da mais conhecida (1) para a menos conhecida (5). Trechos de 1s → 2s → 4s → 7s → 11s → 16s; depois de 3 tentativas aparecem os gêneros e o ano, na última o protagonista.

Também no ar: `/luan/` (Luandle) e `/palpite/` (Palpite Otaku).

## Como está montado

```
public/            site (OPdle em index.html, Luandle e Palpite Otaku em subpastas)
worker/index.js    Worker da Cloudflare: serve o site e a API
generator/         gerador de desafios (roda no GitHub Actions)
wrangler.toml      configuração do Worker
.github/workflows/opdle.yml   gera e publica
```

- **Cloudflare Worker** serve o site e três rotas:
  - `GET /api/puzzle` desafio de hoje (horário de Brasília); `?date=AAAA-MM-DD` para dias passados. Dias futuros são recusados.
  - `GET /api/clip/<id>` trecho de áudio (MP3, 16,5 s).
  - `GET /catalog.json` lista de animes para o autocompletar.
- **Cloudflare KV** (`opdle-data`) guarda desafios, trechos, catálogo e o histórico do gerador.
- **Histórico do jogador** fica no `localStorage` do navegador: sequência, média, distribuição e arquivo de dias anteriores.

## Gerador

`generator/generate.mjs`:
1. Pega os 1500 animes mais populares do [AniList](https://anilist.co) e agrupa temporadas, filmes e histórias paralelas por franquia (qualquer uma vale como resposta).
2. Busca as aberturas no [AnimeThemes](https://animethemes.moe).
3. Para cada dia que falta (até 35 dias à frente), escolhe uma franquia por faixa de popularidade:
   1: top 40 · 2: 40–120 · 3: 120–300 · 4: 300–600 · 5: 600–1200.
   Mesma franquia só volta depois de 30 dias; mesma abertura depois de 90 e sempre com outro trecho (20 s de distância, no mínimo).
4. Escolhe um trecho que começa com som (sem silêncio no 1º segundo), corta 16,5 s, normaliza o volume e salva com nome aleatório.

Dias já gerados nunca mudam. Novos animes só entram em dias futuros.

## Publicação

O workflow roda toda segunda-feira, a cada push na `main` e quando disparado à mão (Actions → OPdle → Run workflow). Precisa dos segredos `CLOUDFLARE_API_TOKEN` (modelo "Edit Cloudflare Workers") e `CLOUDFLARE_ACCOUNT_ID`. O namespace do KV é criado sozinho na primeira execução.

Se algo falhar, o log fica no branch `opdle-logs`.
