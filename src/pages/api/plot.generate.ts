// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { PlotParameter, PARAMETERS } from '../../components/parameters'

type ApiResponse = {
  parmeters: {
    selectedNovelist: string,
    selectedGenre: string,
    selectedWhen: string,
    selectedWhere: string,
    selectedWho: string,
    selectedWhat: string,
    selectedHow: string,
    selectedWhy: string
  },
  plot: string
}

const PLOT_SAMPLE = '【起】シーン名：宇宙船のクルー登場人物：主人公（幼なじみ）、クルー達場所：宇宙船内時間：深夜天候：宇宙空間起こる出来事：主人公が、幼なじみであるクルーの一人と再会する。彼女は新たに乗艦したと聞かされ、偶然再会を果たす。主人公は幼い頃から彼女に好意を持ち、再会に後ろ髪を引かれながらも、クルーたちと一緒に任務を遂行することに。シーンの目的：物語の舞台である宇宙船、また登場人物の関係性を導入すること。書いておくべき情報・伏線：幼なじみとの再会、主人公の好意。【承】シーン名：禁断の愛登場人物：主人公、幼なじみ場所：宇宙船内、倉庫時間：深夜天候：宇宙空間起こる出来事：主人公が偶然、幼なじみが隠れていた倉庫で再会する。幼なじみからは、他のクルーに内緒で自身が探していた宝石の話が出た。二人はそれ以来、顔を合わせるたびに親密な時間を過ごす中で、禁断の恋に落ちていく。シーンの目的：主人公と幼なじみの関係性を深め、物語の核心である「禁断の恋」というテーマを盛り込むこと。書いておくべき情報・伏線：幼なじみが探していた宝石、主人公と幼なじみの親密な時間。【転】シーン名：推理の真実登場人物：主人公、幼なじみ、クルー達場所：宇宙船内、監視室時間：深夜天候：宇宙空間起こる出来事：主人公が、幼なじみが死亡したことを知る。クルー達は、事故死として処理していたが、主人公はそうとは思えず、推理を駆使して真相を暴こうとする。結果、幼なじみが宝石泥棒として逮捕される寸前に、自殺で命を絶ったことが明らかになる。シーンの目的：クライマックスである真相解明を明かし、物語の流れを一転させること。書いておくべき情報・伏線：幼なじみが探していた宝石、クルーたちによる事故死の説明。【結】シーン名：真実の愛登場人物：主人公、クルー達場所：宇宙船内、メインゾーン時間：未明天候：宇宙空間起こる出来事：主人公が、幼なじみの死を受け止め、真実の愛を感じる。その後、クルーたちの手配で、宝石は発見され、地球への帰還が決定する。主人公は幼なじみの死もあり、クルー達に比べて';

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {

  console.log(PARAMETERS);
  console.log(req.body);
  await sleep(3000);

  res.status(200).json({
    parmeters: req.body,
    plot: PLOT_SAMPLE
  })
}

