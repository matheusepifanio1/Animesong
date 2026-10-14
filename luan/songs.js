// Lista do Luandle (versão Luan Santana do OPdle).
// Mesmo formato do jogo de anime, mas aqui:
//   anime     = nome da música (é a resposta certa)
//   aliases   = outros jeitos de escrever o nome
//   song      = descrição da gravação (revelada no fim)
//   artist    = artista
//   itunes    = como achar a faixa no iTunes (term, artist, title)
//   trackId   = (opcional) ID fixo da faixa no iTunes; quando existe, a busca é pulada
//   start     = segundo da prévia de 30s onde o trecho começa (use o modo #conferir)
//   tier      = 1 muito conhecida (rodadas iniciais), 2 um pouco mais difícil
//
// Critério: só músicas do Luan, sem participações. O jogo usa a prévia de 30s do iTunes e
// descarta automaticamente faixas marcadas como ao vivo, acústico, remix ou instrumental.

window.ANIME_OP_SONGS = [
  { anime: "Meteoro", aliases: [], song: "Versão de estúdio", artist: "Luan Santana",
    itunes: { term: "Luan Santana Meteoro", artist: "Luan Santana", title: ["Meteoro"] }, start: 0, tier: 1 },
  { anime: "Sinais", aliases: [], song: "Versão de estúdio", artist: "Luan Santana",
    itunes: { term: "Luan Santana Sinais", artist: "Luan Santana", title: ["Sinais"] }, start: 0, tier: 1 },
  { anime: "Você Não Sabe o Que É Amor", aliases: ["Voce nao sabe o que e amor"], song: "Versão de estúdio", artist: "Luan Santana",
    itunes: { term: "Luan Santana Você Não Sabe o Que É Amor", artist: "Luan Santana", title: ["Você Não Sabe o Que É Amor"] }, start: 0, tier: 1 },
  { anime: "Escreve Aí", aliases: ["Escreve Ai"], song: "Versão de estúdio", artist: "Luan Santana",
    itunes: { term: "Luan Santana Escreve Aí", artist: "Luan Santana", title: ["Escreve Aí"] }, start: 0, tier: 1 },
  { anime: "Tudo Que Você Quiser", aliases: ["Tudo que voce quiser"], song: "Versão de estúdio", artist: "Luan Santana",
    itunes: { term: "Luan Santana Tudo Que Você Quiser", artist: "Luan Santana", title: ["Tudo Que Você Quiser"] }, start: 0, tier: 1 },
  { anime: "Cê Topa", aliases: ["Ce Topa", "Cê topa?"], song: "Versão de estúdio", artist: "Luan Santana",
    itunes: { term: "Luan Santana Cê Topa", artist: "Luan Santana", title: ["Cê Topa"] }, start: 0, tier: 1 },
  { anime: "Te Esperando", aliases: [], song: "Versão de estúdio", artist: "Luan Santana",
    itunes: { term: "Luan Santana Te Esperando", artist: "Luan Santana", title: ["Te Esperando"] }, start: 0, tier: 1 },
  { anime: "Amar Não É Pecado", aliases: ["Amar nao e pecado"], song: "Versão de estúdio", artist: "Luan Santana",
    itunes: { term: "Luan Santana Amar Não É Pecado", artist: "Luan Santana", title: ["Amar Não É Pecado"] }, start: 0, tier: 1 },
  { anime: "Garotas Não Merecem Chorar", aliases: ["Garotas nao merecem chorar"], song: "Versão de estúdio", artist: "Luan Santana",
    itunes: { term: "Luan Santana Garotas Não Merecem Chorar", artist: "Luan Santana", title: ["Garotas Não Merecem Chorar"] }, start: 0, tier: 2 },
  { anime: "Acordando o Prédio", aliases: ["Acordando o Predio"], song: "Versão de estúdio", artist: "Luan Santana",
    itunes: { term: "Luan Santana Acordando o Prédio", artist: "Luan Santana", title: ["Acordando o Prédio"] }, start: 0, tier: 2 },
  { anime: "Eu Não Merecia Isso", aliases: ["Eu nao merecia isso"], song: "Versão de estúdio", artist: "Luan Santana",
    itunes: { term: "Luan Santana Eu Não Merecia Isso", artist: "Luan Santana", title: ["Eu Não Merecia Isso"] }, start: 0, tier: 2 },
  { anime: "Morena", aliases: [], song: "Versão de estúdio", artist: "Luan Santana",
    itunes: { term: "Luan Santana Morena", artist: "Luan Santana", title: ["Morena"] }, start: 0, tier: 2 },
  { anime: "Dia, Lugar e Hora", aliases: ["Dia Lugar e Hora"], song: "Versão de estúdio", artist: "Luan Santana",
    itunes: { term: "Luan Santana Dia, Lugar e Hora", artist: "Luan Santana", title: ["Dia, Lugar e Hora"] }, start: 0, tier: 2 },
  { anime: "Ilha", aliases: [], song: "Versão de estúdio", artist: "Luan Santana",
    itunes: { term: "Luan Santana Ilha", artist: "Luan Santana", title: ["Ilha"] }, start: 0, tier: 2 }
];

// Títulos extras no autocomplete (outras do Luan e hits sertanejos de outros artistas),
// para a lista de opções não entregar a resposta.
window.ANIME_EXTRA_TITLES = [
  ["Dona"], ["Parece"], ["Vou Voar"], ["Meteoro da Paixão"], ["Eu Volto"], ["Chuva de Arroz"],
  ["Química do Amor"], ["Sofazinho"], ["Água com Açúcar"], ["Incondicional"],
  ["Evidências"], ["Ai Se Eu Te Pego"], ["Camaro Amarelo"], ["Infiel"], ["Largado às Traças"],
  ["Atrasadinha"], ["Liberdade Provisória"], ["50 Reais"], ["Batom de Cereja"],
  ["Sorte Que Cê Beija Bem"], ["Notificação Preferida"], ["Erro Gostoso"], ["Barzinho Aleatório"]
];
