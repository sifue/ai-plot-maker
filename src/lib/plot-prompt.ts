export type PlotPromptParameters = {
    novelist?: string;
    genre?: string;
    when?: string;
    where?: string;
    who?: string;
    what?: string;
    how?: string;
    why?: string;
};

export function buildPlotPrompt(params: PlotPromptParameters): string {
    return `あなたは、小説家の${params.novelist}です。これから以下の設定で、小説家の${params.novelist}の作風を意識して物語のプロットを作成してください。

プロットは、起承転結の4シーンを作成してください。
必ず「起」のシーンでは導入をすること、
「転」のシーンではクライマックスを迎えること、
「結」のシーンでは物語の結末を明らかにするように構成してください。

各シーンの内容は、

・シーン名
・登場人物
・場所
・時間
・天候
・起こる出来事
・シーンの目的
・書いておくべき情報・伏線

以上を明記してください。これらの内容はできるだけ具体的な内容や固有名詞や人物の呼称を含めるようにしてください。
また「起こる出来事」に関しては、段階的に、読者が展開にのめりこまれるようにより具体的にストーリーを展開してください。
「結」のシーンの物語の結末についても、読者が納得できるように、物語の伏線を回収するようにしてください。
また、登場人物に小説家自身の名前を含めないようにしてください。

では、以下の物語の設定にて、起承転結の4つのシーンのプロットを作成してください。

・ジャンル: ${params.genre}
・いつ（When）：  ${params.when}
・どこで（Where）： ${params.where}
・誰が（Who）： ${params.who}
・何を（What）： ${params.what}
・どのように（How）： ${params.how}
・なぜ（Why）： ${params.why}

以上の設定を再度復唱する必要はありません。加えて、各シーンごと以下のプロットのフォーマットを利用して出力するようにしてください。

■「起」
・シーン名:
・登場人物:
・場所:
・時間:
・天候:
・起こる出来事:
・シーンの目的:
・書いておくべき情報・伏線:
`;
}
