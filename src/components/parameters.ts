export type PlotParameter = {
  id: number,
  name: string
}

export const PARAMETERS: {
  novelist: PlotParameter[],
  genre: PlotParameter[],
  when: PlotParameter[],
  where: PlotParameter[],
  who: PlotParameter[],
  what: PlotParameter[],
  how: PlotParameter[],
  why: PlotParameter[]
} = {
  novelist: [
    {
      id: 1,
      name: '芥川龍之介'
    },
    {
      id: 2,
      name: '夏目漱石'
    },
    {
      id: 3,
      name: '江戸川乱歩'
    },
    {
      id: 4,
      name: '夢野久作'
    },
    {
      id: 5,
      name: '太宰治'
    },
    {
      id: 6,
      name: '谷崎潤一郎'
    },
    {
      id: 7,
      name: '二葉亭四迷'
    },
    {
      id: 8,
      name: '森鴎外'
    },
    {
      id: 9,
      name: '島崎藤村'
    },
    {
      id: 10,
      name: 'ウィリアム・シェイクスピア'
    }
  ],
  genre: [
    {
      id: 1,
      name: 'SF'
    },
    {
      id: 2,
      name: 'ミステリー'
    },
    {
      id: 3,
      name: 'ファンタジー'
    },
    {
      id: 4,
      name: 'ロマンス'
    },
    {
      id: 5,
      name: 'コメディ'
    },
    {
      id: 6,
      name: 'サスペンス'
    },
    {
      id: 7,
      name: '歴史小説'
    },
    {
      id: 8,
      name: 'ホラー'
    },
    {
      id: 9,
      name: '現代風刺'
    },
    {
      id: 10,
      name: '冒険小説'
    }
  ],
  when: [
    {
      id: 1,
      name: '古代'
    },
    {
      id: 2,
      name: '中世'
    },
    {
      id: 3,
      name: '16世紀'
    },
    {
      id: 4,
      name: '19世紀'
    },
    {
      id: 5,
      name: '近代'
    },
    {
      id: 6,
      name: '現代'
    },
    {
      id: 7,
      name: 'ディストピアの未来'
    },
    {
      id: 8,
      name: 'AI支配の未来'
    },
    {
      id: 9,
      name: '宇宙時代'
    },
    {
      id: 10,
      name: '時間を超越した時空'
    }
  ],
  where: [
    {
      id: 1,
      name: '都会'
    },
    {
      id: 2,
      name: '田舎'
    },
    {
      id: 3,
      name: '小さな島'
    },
    {
      id: 4,
      name: '海外旅行中'
    },
    {
      id: 5,
      name: '遠い未来の都市'
    },
    {
      id: 6,
      name: 'スペースコロニー'
    },
    {
      id: 7,
      name: '夢の中'
    },
    {
      id: 8,
      name: '仮想現実の世界'
    },
    {
      id: 9,
      name: '異世界'
    },
    {
      id: 10,
      name: '失われた都市'
    }
  ],
  who: [
    {
      id: 1,
      name: '若者'
    },
    {
      id: 2,
      name: '女性探偵'
    },
    {
      id: 3,
      name: '或る貴族'
    },
    {
      id: 4,
      name: 'タイムトラベラー'
    },
    {
      id: 5,
      name: '動物と話せる少年'
    },
    {
      id: 6,
      name: '孤独な芸術家'
    },
    {
      id: 7,
      name: '最後の生き残り'
    },
    {
      id: 8,
      name: '冒険者'
    },
    {
      id: 9,
      name: '地味なサラリーマン'
    },
    {
      id: 10,
      name: '異世界から来た少女'
    }
  ],
  what: [
    {
      id: 1,
      name: '愛を探す'
    },
    {
      id: 2,
      name: '世界を救う'
    },
    {
      id: 3,
      name: '過去の秘密を発掘'
    },
    {
      id: 4,
      name: '家族を守る'
    },
    {
      id: 5,
      name: '真実を暴く'
    },
    {
      id: 6,
      name: '幸せを求める'
    },
    {
      id: 7,
      name: '物語の意味を解き明かす'
    },
    {
      id: 8,
      name: '魔法の力を手にする'
    },
    {
      id: 9,
      name: '無力な人々を助ける'
    },
    {
      id: 10,
      name: 'タイムパラドックスを防ぐ'
    }
  ],
  how: [
    {
      id: 1,
      name: '時間旅行を使って'
    },
    {
      id: 2,
      name: '魔法を学びながら'
    },
    {
      id: 3,
      name: '状況をつぶさに観察をしながら'
    },
    {
      id: 4,
      name: '陰謀を解明する'
    },
    {
      id: 5,
      name: '異世界を探険する'
    },
    {
      id: 6,
      name: '科学的手段で'
    },
    {
      id: 7,
      name: '知恵と知識を駆使して'
    },
    {
      id: 8,
      name: '試練に立ち向かいながら'
    },
    {
      id: 9,
      name: '不思議な力を獲得して'
    },
    {
      id: 10,
      name: '謎めいた伝説を辿りながら'
    }
  ],
  why: [
    {
      id: 1,
      name: '自分を解放するため'
    },
    {
      id: 2,
      name: '世界の平和のため'
    },
    {
      id: 3,
      name: '失われた記憶を取り戻すため'
    },
    {
      id: 4,
      name: '運命の恋に導かれて'
    },
    {
      id: 5,
      name: '偉大なる目的を達成するため'
    },
    {
      id: 6,
      name: '誤解を解き、真実を知るため'
    },
    {
      id: 7,
      name: '不幸な過去から立ち直るため'
    },
    {
      id: 8,
      name: '社会の不正を正すため'
    },
    {
      id: 9,
      name: '人類の未来を守るため'
    },
    {
      id: 10,
      name: '引き裂かれた友情を修復するため'
    }
  ]
}
