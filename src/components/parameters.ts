export type PlotParameter = {
  id: number,
  name: string
}

export const PARAMETERS: {
  novelist: PlotParameter[],
  ganre: PlotParameter[],
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
      name: '宮部みゆき'
    },
    {
      id: 2,
      name: '村上春樹'
    },
    {
      id: 3,
      name: '太宰治'
    },
    {
      id: 4,
      name: 'ジョージ・オーウェル'
    },
    {
      id: 5,
      name: '川原礫'
    }
  ],
  ganre: [
    {
      id: 1,
      name: 'ミステリー'
    },
    {
      id: 2,
      name: 'ファンタジー'
    },
    {
      id: 3,
      name: 'SF（科学小説）'
    },
    {
      id: 4,
      name: 'ロマンス小説'
    },
    {
      id: 5,
      name: '時代小説'
    }
  ],
  when: [
    {
      id: 1,
      name: '江戸時代'
    },
    {
      id: 2,
      name: '第二次世界大戦'
    },
    {
      id: 3,
      name: '近未来'
    },
    {
      id: 4,
      name: '現代'
    },
    {
      id: 5,
      name: '古代ローマ'
    }
  ],
  where: [
    {
      id: 1,
      name: '孤島'
    },
    {
      id: 2,
      name: '大都市'
    },
    {
      id: 3,
      name: '宇宙船'
    },
    {
      id: 4,
      name: '幻想的な王国'
    },
    {
      id: 5,
      name: '小さな村'
    }
  ],
  who: [
    {
      id: 1,
      name: '探偵'
    },
    {
      id: 2,
      name: '宇宙飛行士'
    },
    {
      id: 3,
      name: '時間旅行者'
    },
    {
      id: 4,
      name: '幼なじみ'
    },
    {
      id: 5,
      name: '忍者'
    }
  ],
  what: [
    {
      id: 1,
      name: '殺人事件の謎を解く'
    },
    {
      id: 2,
      name: '箱庭的世界を冒険する'
    },
    {
      id: 3,
      name: '未来世界を救う'
    },
    {
      id: 4,
      name: '禁断の恋に落ちる'
    },
    {
      id: 5,
      name: '秘宝を探す'
    }
  ],
  how: [
    {
      id: 1,
      name: '推理を駆使して'
    },
    {
      id: 2,
      name: '魔法と剣で戦いながら'
    },
    {
      id: 3,
      name: '時間を操りながら'
    },
    {
      id: 4,
      name: '危険な秘密を隠しながら'
    },
    {
      id: 5,
      name: '忠誠心と勇気をもって'
    }
  ],
  why: [
    {
      id: 1,
      name: '真相を明らかにするため'
    },
    {
      id: 2,
      name: '自分の過去を探るため'
    },
    {
      id: 3,
      name: '世界の破滅を防ぐため'
    },
    {
      id: 4,
      name: '真実の愛を見つけるため'
    },
    {
      id: 5,
      name: '家族の名誉を守るため'
    }
  ]
}