// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

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
  return parameter.find((p) => p.id === parseInt(id))?.name
}

const isUseSamplePlot = false; // デバッグ用 (OpenAI APIにたくさんリクエストを送ってしまうため)
const PLOT_SAMPLE = `【起】
シーン名：失われた都市に現れた怪物
登場人物：貴族の主人公、貴族の家臣、都市の住人たち
場所：失われた都市の中心街
時間：夜
天候：霧
起こる出来事：貴族の主人公と家臣が失われた都市の探検中、突如として霧の中から謎の怪物が現れ、都市の住人たちを攻撃する。主人公たちは怪物を倒すことに成功するが、その怪物が何者なのかわからない。
シーンの目的：物語の導入と主人公たちが直面する危機を見せる。
書いておくべき情報・伏線：失われた都市の秘密、怪物の正体、貴族の主人公の過去のトラウマ


【承】
シーン名：迷宮探索
登場人物：貴族の主人公、貴族の家臣
場所：迷宮入り口
時間：朝
天候：晴れ
起こる出来事：怪物の出現から数日後、主人公たちは失われた都市の迷宮へと侵入する。迷宮の中には罠があり、主人公たちは苦難に遭遇する。しかし、その迷宮には都市を救う情報があると聞き、奮闘するうちに何とか脱出に成功する。
シーンの目的：主人公たちが試練に立ち向かう姿と、都市を救う情報の存在を示す。
書いておくべき情報・伏線：迷宮の中にある謎の情報、罠を仕掛けた張本人の存在


【転】
シーン名：強敵との戦い
登場人物：貴族の主人公、貴族の家臣
場所：迷宮の最深部
時間：夜
天候：嵐
起こる出来事：迷宮の最深部で、主人公たちは強大な怪物と対峙することになる。戦いの末に、主人公たちは怪物に勝利するが、その勝利は代償を伴う。
シーンの目的：クライマックスとなる戦いの描写と、主人公たちの敗北によって物語に大きな転換点をもたらす。
書いておくべき情報・伏線：怪物と関連する秘密、主人公たちの体力の限界


【結】
シーン名：世界を救う
登場人物：貴族の主人公、失われた都市の住人たち
場所：失われた都市の中心街
時間：朝
天候：晴れ
起こる出来事：主人公たちは、怪物との戦いで傷ついた身体を引きずりながら、失われた都市の住人たちを集め、都市を救う方法を探し続ける。その方法を見つけ、主人公たちは成功する。その後、主人公たちは立ち去るが、この事件で起きたことは世界の歴史に刻まれることになる。
シーンの目的：物語の結末を示し、主人公たちが世界を救ったことを示す。
書いておくべき情報・伏線：都市を救う方法、主人公たちの生死の行方`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const nps = { ...(req.body) };
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

  if (isUseSamplePlot) {
    res.status(200).json({
      parmeters: req.body,
      plot: PLOT_SAMPLE
    })
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const plot = completion.data.choices[0].message?.content ?? '';

    res.status(200).json({
      parmeters: req.body,
      plot: plot
    })

  } catch (e) {
    console.log(e);
    res.status(500).json({
      parmeters: req.body,
      plot: 'エラーが発生しました。'
    })
    return;
  }
}

