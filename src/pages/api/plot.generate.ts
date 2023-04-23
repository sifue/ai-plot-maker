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

