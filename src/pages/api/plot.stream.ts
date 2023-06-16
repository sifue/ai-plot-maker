import {
    createParser,
    ParsedEvent,
    ReconnectInterval,
} from 'eventsource-parser';

import { PlotParameter, PARAMETERS } from '../../components/parameters'
import { NextRequest, NextResponse } from 'next/server'
export const config = {
    runtime: 'edge',
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

/**
 * JSON String からデータを抽出する
 * @param content {"id":"chatcmpl-78ujFabH0JI1P4wezczUXyYtegkVt","object":"chat.completion.chunk","created":1682359045,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":"者"},"index":0,"finish_reason":null}]}
 * @returns 
 */
function extractDataFromJSONString(content: string): string {
    try {
        const json = JSON.parse(content);
        return json.choices[0].delta.content;
    } catch (error) {
        console.error(error);
        return '';
    }
}

function queryParamsToObject(urlSearchParams: URLSearchParams): { [key: string]: string } {
    const queryParams: { [key: string]: string } = {};
    const entries = Array.from(urlSearchParams.entries());
    entries.forEach(([key, value]) => {
        queryParams[key] = value;
    });
    return queryParams;
}

export default async function handler(req: NextRequest) {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const url = req.nextUrl;
    const params = queryParamsToObject(url.searchParams);

    if (!params || !params.novelist || Object.keys(params).length === 0) {
        const readable = new ReadableStream({
            start(controller) {
                controller.enqueue(
                    encoder.encode(
                        '<html><head><title>Request is empty.</title></head><body>Request is empty.</body></html>',
                    ),
                );
                controller.close();
            },
        });
        return new Response(readable, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
    }

    const nps = { ...(params) };
    transformIdToName(nps);

    const prompt = `あなたは、小説家の${nps.novelist}です。これから以下の設定で、小説家の${nps.novelist}の作風を意識して物語のプロットを作成してください。

プロットは、起承転結の4シーンを作成してください。
必ず「起」のシーンでは導入をすること、
「転」のシーンではクライマックスを迎えること、
「結」のシーンでは物語の結末を明らかににするように構成してください。
 
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
    
・ジャンル: ${nps.genre}
・いつ（When）：  ${nps.when}
・どこで（Where）： ${nps.where}
・誰が（Who）： ${nps.who}
・何を（What）： ${nps.what}
・どのように（How）： ${nps.how}
・なぜ（Why）： ${nps.why}
    
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

    const API_KEY = process.env.OPENAI_API_KEY;
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`
        },
        method: 'POST',
        body: JSON.stringify({
            messages: [{ role: 'user', content: prompt }],
            model: 'gpt-3.5-turbo-16k',
            stream: true
        })
    });

    if (res.status !== 200) {
        console.log(`Fetch to OpenAI API failed. status: ${res.status}`);
        console.log({ res });
        return new Response(JSON.stringify({ text: res.text, status: res.status }), { status: res.status });
    }

    // 問題なければそのままServer-sent Eventをクライアントに転送する
    return new Response(res.body, {
        headers: { 'Content-Type': 'text/event-stream;charset=utf-8' },
    });

}