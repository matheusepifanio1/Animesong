// Lista do Luandle (versão Luan Santana do OPdle).
// Mesmo formato do jogo de anime, mas aqui:
//   anime     = nome da música (é a resposta certa)
//   aliases   = outros jeitos de escrever o nome
//   song      = versão/gravação do vídeo (revelado no fim)
//   artist    = artista(s)
//   start     = segundo do vídeo onde o trecho começa (ajuste se tiver intro falada)
//   tier      = 1 muito conhecida (rodadas iniciais), 2 um pouco mais difícil
//
// IDs conferidos via oEmbed do YouTube em 13/10/2026; todos de canais oficiais
// (Luan Santana ou Som Livre).

window.ANIME_OP_SONGS = [
  { anime: "Meteoro", aliases: [], song: "Luan Santana Acústico", artist: "Luan Santana", youtubeId: "yYvvFSs2hk4", start: 0, tier: 1 },
  { anime: "Você Não Sabe o Que É Amor", aliases: ["Voce nao sabe o que e amor"], song: "Registro Histórico", artist: "Luan Santana", youtubeId: "CG1s-5ZsZQk", start: 0, tier: 1 },
  { anime: "Química do Amor", aliases: ["Quimica do Amor"], song: "Duetos (áudio oficial)", artist: "Luan Santana part. Ivete Sangalo", youtubeId: "wx49QjX8i3A", start: 0, tier: 1 },
  { anime: "Escreve Aí", aliases: ["Escreve Ai"], song: "Luan Santana Acústico", artist: "Luan Santana", youtubeId: "ysZP--fcgnc", start: 0, tier: 1 },
  { anime: "Sinais", aliases: [], song: "Ao Vivo", artist: "Luan Santana", youtubeId: "MxwZ66L9RQI", start: 0, tier: 1 },
  { anime: "Tudo Que Você Quiser", aliases: ["Tudo que voce quiser"], song: "Acústico (áudio oficial)", artist: "Luan Santana", youtubeId: "zF2I8IazFNo", start: 0, tier: 1 },
  { anime: "Cê Topa", aliases: ["Ce Topa", "Cê topa?"], song: "Acústico (áudio oficial)", artist: "Luan Santana", youtubeId: "x9y_SlHCzHs", start: 0, tier: 1 },
  { anime: "Acordando o Prédio", aliases: ["Acordando o Predio"], song: "Vídeo oficial", artist: "Luan Santana", youtubeId: "mvWXaz0Gtbo", start: 0, tier: 2 },
  { anime: "Te Esperando", aliases: [], song: "Acústico (áudio oficial)", artist: "Luan Santana", youtubeId: "cFXQjfjEh74", start: 0, tier: 1 },
  { anime: "Amar Não É Pecado", aliases: ["Amar nao e pecado"], song: "Ao Vivo no Rio", artist: "Luan Santana", youtubeId: "Xh7bdsJWJCU", start: 0, tier: 1 },
  { anime: "Chuva de Arroz", aliases: [], song: "Luan Santana Acústico", artist: "Luan Santana", youtubeId: "rTsbSY04s1Y", start: 0, tier: 2 },
  { anime: "Garotas Não Merecem Chorar", aliases: ["Garotas nao merecem chorar"], song: "O Nosso Tempo É Hoje", artist: "Luan Santana", youtubeId: "uPLztx0LcYA", start: 0, tier: 2 },
  { anime: "Eu Não Merecia Isso", aliases: ["Eu nao merecia isso"], song: "Arena de Ouro (áudio oficial)", artist: "Luan Santana", youtubeId: "xgqOsVnFKCc", start: 0, tier: 2 },
  { anime: "Morena", aliases: [], song: "Clipe oficial", artist: "Luan Santana", youtubeId: "ZIiQ1jMqhVM", start: 0, tier: 2 },
  { anime: "Dia, Lugar e Hora", aliases: ["Dia Lugar e Hora"], song: "Lovenejo 2 (áudio oficial)", artist: "Luan Santana", youtubeId: "P1ILZZ4qjaQ", start: 0, tier: 2 },
  { anime: "Sofazinho", aliases: [], song: "Live-Móvel", artist: "Luan Santana part. Jorge & Mateus", youtubeId: "zFjqdEplaHc", start: 0, tier: 2 },
  { anime: "Água com Açúcar", aliases: ["Agua com Acucar"], song: "DVD Viva", artist: "Luan Santana", youtubeId: "6c0LA4Nb1vY", start: 0, tier: 2 },
  { anime: "Ilha", aliases: [], song: "Clipe oficial", artist: "Luan Santana", youtubeId: "dl0Dp_FRMo4", start: 0, tier: 2 }
];

// Títulos extras no autocomplete (outras do Luan e hits sertanejos de outros artistas),
// para a lista de opções não entregar a resposta.
window.ANIME_EXTRA_TITLES = [
  ["Dona"], ["Parece"], ["Vou Voar"], ["Meteoro da Paixão"], ["Eu Volto"],
  ["Evidências"], ["Ai Se Eu Te Pego"], ["Camaro Amarelo"], ["Infiel"], ["Largado às Traças"],
  ["Atrasadinha"], ["Liberdade Provisória"], ["50 Reais"], ["Batom de Cereja"],
  ["Sorte Que Cê Beija Bem"], ["Notificação Preferida"], ["Erro Gostoso"], ["Barzinho Aleatório"]
];
