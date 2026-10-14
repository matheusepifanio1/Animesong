// Lista do Luandle (versão Luan Santana do OPdle).
// Mesmo formato do jogo de anime, mas aqui:
//   anime     = nome da música (é a resposta certa)
//   aliases   = outros jeitos de escrever o nome
//   song      = descrição da gravação (revelada no fim)
//   artist    = artista
//   start     = segundo do vídeo onde o trecho começa (use o modo #ajuste para medir)
//   tier      = 1 muito conhecida (rodadas iniciais), 2 um pouco mais difícil
//
// Critério: só músicas do Luan, sem participações, usando a faixa de áudio do álbum
// (canal oficial "Luan Santana - Topic"), e nunca versões marcadas como ao vivo ou acústico.
// IDs conferidos via oEmbed do YouTube em 13/10/2026.

window.ANIME_OP_SONGS = [
  { anime: "Meteoro", aliases: [], song: "Faixa do álbum", artist: "Luan Santana", youtubeId: "yBx0SF4vJ2A", start: 0, tier: 1 },
  { anime: "Sinais", aliases: [], song: "Faixa do álbum", artist: "Luan Santana", youtubeId: "9fOxArNbEYw", start: 0, tier: 1 },
  { anime: "Você Não Sabe o Que É Amor", aliases: ["Voce nao sabe o que e amor"], song: "Faixa do álbum", artist: "Luan Santana", youtubeId: "_D6LSP3-A_c", start: 0, tier: 1 },
  { anime: "Escreve Aí", aliases: ["Escreve Ai"], song: "Faixa do álbum", artist: "Luan Santana", youtubeId: "CrkWxHh4HSU", start: 0, tier: 1 },
  { anime: "Tudo Que Você Quiser", aliases: ["Tudo que voce quiser"], song: "Faixa do álbum", artist: "Luan Santana", youtubeId: "YZsVJWbaGn8", start: 0, tier: 1 },
  { anime: "Cê Topa", aliases: ["Ce Topa", "Cê topa?"], song: "Faixa do álbum", artist: "Luan Santana", youtubeId: "Kl1CFIWn2oM", start: 0, tier: 1 },
  { anime: "Te Esperando", aliases: [], song: "Faixa do álbum", artist: "Luan Santana", youtubeId: "w7-PjZa6oxU", start: 0, tier: 1 },
  { anime: "Amar Não É Pecado", aliases: ["Amar nao e pecado"], song: "Faixa do álbum", artist: "Luan Santana", youtubeId: "9aYuvJvbspI", start: 0, tier: 1 },
  { anime: "Garotas Não Merecem Chorar", aliases: ["Garotas nao merecem chorar"], song: "Faixa do álbum", artist: "Luan Santana", youtubeId: "Cm4yTcb4Yrg", start: 0, tier: 2 },
  { anime: "Acordando o Prédio", aliases: ["Acordando o Predio"], song: "Faixa do álbum", artist: "Luan Santana", youtubeId: "DvG6Q8_6-CQ", start: 0, tier: 2 },
  { anime: "Eu Não Merecia Isso", aliases: ["Eu nao merecia isso"], song: "Faixa do álbum", artist: "Luan Santana", youtubeId: "HOiGXhHB55k", start: 0, tier: 2 },
  { anime: "Morena", aliases: [], song: "Faixa do álbum", artist: "Luan Santana", youtubeId: "tLQyvOgr5KQ", start: 0, tier: 2 },
  { anime: "Dia, Lugar e Hora", aliases: ["Dia Lugar e Hora"], song: "Faixa do álbum", artist: "Luan Santana", youtubeId: "PIsjEoXB428", start: 0, tier: 2 },
  { anime: "Ilha", aliases: [], song: "Faixa do álbum", artist: "Luan Santana", youtubeId: "X_4jJ-766Bk", start: 0, tier: 2 }
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
