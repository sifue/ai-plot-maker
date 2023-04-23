// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi} from 'openai'

import { PlotParameter, PARAMETERS } from '../../components/parameters'

type ApiResponse = {
  parmeters: {
    novelist: string,
    genre: string,
    when: string,
    where: string,
    who: string,
    what: string,
    how: string,
    why: string
  },
plot: string
}

function transformIdToName(idParameters: any) {
  idParameters.novelist = getNameFromId(PARAMETERS.novelist, idParameters.novelist);
  idParameters.genre = getNameFromId(PARAMETERS.genre, idParameters.genre);
  idParameters.when = getNameFromId(PARAMETERS.when, idParameters.when);
  idParameters.where = getNameFromId(PARAMETERS.where, idParameters.where);
  idParameters.who = getNameFromId(PARAMETERS.who, idParameters.who);
  idParameters.what = getNameFromId(PARAMETERS.what, idParameters.what);
  idParameters.how = getNameFromId(PARAMETERS.how, idParameters.how);
  idParameters.why = getNameFromId(PARAMETERS.why, idParameters.why);
}

function getNameFromId(parameter: PlotParameter[], id: string) {
  return  parameter.find((p) => p.id === parseInt(id))?.name
}

const isUseSamplePlot = false;
const PLOT_SAMPLE = `【起】
シーン名：村での事件
登場人物：探偵、村人たち、犯人
場所：小さな村の広場
時間：古代ローマ時代、日没直前
天候：晴れ
起こる出来事：村に住む人々が次々に殺され、事件が起こる。村人たちは恐怖に陥り、誰が犯人か分からずにいた。その中で、探偵が現れ、犯人を捕まえることを誓いあぐねるが、その決心を
励まされる。
シーンの目的：事件の発生を明確にし、探偵の出現と課題の提示を行う。
書いておくべき情報・伏線：探偵の能力や過去の経歴、村人たちの人間関係など

【承】
シーン名：真相に迫る
登場人物：探偵、犯人、死者の家族
場所：死者の家
時間：深夜
天候：雨
起こる出来事：探偵は犯人を追跡し、死者の家を訪れる。死者の家族から、死者が最後に訪れた場所が教えられる。探偵はその場所へ向かい、犯人と対峙するが、犯人は自分がやったことを認
めることはしない。探偵は徐々に犯人に迫っていく。
シーンの目的：真相に迫っていく緊迫感を表現する。
書いておくべき情報・伏線：犯人の動機、死者の訪れた場所、探偵の推理など

【転】
シーン名：未来世界を救うために
登場人物：探偵、犯人、未来人
場所：未来世界の支配者のいる場所
時間：未来
天候：晴れ
起こる出来事：犯人が未来世界を支配しようと企んでいることを知った探偵は、未来世界に飛ばされる。そこで、未来人に協力を仰ぎ、犯人の陰謀を阻止する。探偵は自分の過去や失敗から学
びながら、未来世界を救おうと奮闘する。
シーンの目的：物語のクライマックスを示現する。
書いておくべき情報・伏線：未来世界の技術や暮らし、犯人の計画や方法、探偵の成長や決断など

【結】
シーン名：過去との決別
登場人物：探偵、未来人、犯人
場所：未来世界のポータル
時間：未来、帰還前
天候：晴れ
起こる出来事：探偵が犯人の陰謀を阻止し、未来世界を救うことに成功する。未来人たちは探偵を称えながら、彼女が過去世界に帰ることを促す。探偵は帰還前に、過去の自分や事件の記憶を
振り返り、その決断を下す。
シーンの目的：物語の結末を明らかにする。
書いておくべき情報・伏線：探偵の過去や現在、未来世界の変化、犯人の処遇など`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const nps = {...(req.body)};
  transformIdToName(nps);

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const prompt = `あなたは、小説家の${nps.novelist}です。これから以下の設定で物語のプロットを作成してください。

  「プロットは、起承転結の4シーンを作成してください。必ず「起」のシーンでは導入をすること、「転」のシーンではクライマックスを迎えること、「結」のシーンでは物語の結末を明らかににするように構成してください。
  
  各4シーンの内容は、
  
  - シーン名
  - 登場人物
  - 場所
  - 時間
  - 天候
  - 起こる出来事
  - シーンの目的
  - 書いておくべき情報・伏線
  
  以上を明記してください。
  
  以下の物語の設定にて、起承転結の4つのシーンのプロットを作成してください。
  
  ジャンル: ${nps.genre}
  いつ（When）：  ${nps.when}
  どこで（Where）： ${nps.where}
  誰が（Who）： ${nps.who}
  何を（What）： ${nps.what}
  どのように（How）： ${nps.how}
  なぜ（Why）： ${nps.why}`;

  console.log('prompt:');
  console.log(prompt);

  if(isUseSamplePlot) {
    res.status(200).json({
      parmeters: req.body,
      plot: PLOT_SAMPLE
    })
    return;
  }

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{role: 'user', content: prompt}],
  });

  const plot = completion.data.choices[0].message?.content ?? '';
  console.log('plot:');
  console.log(plot);

  res.status(200).json({
    parmeters: req.body,
    plot: plot
  })
}

