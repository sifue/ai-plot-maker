import { PlotParameter, PARAMETERS } from '../../components/parameters'
import type { NextApiRequest } from 'next'
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

export default async function handler(req: NextApiRequest) {

    if (!req.body) {
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

    const nps = { ...(req.body) };
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
    
では、以下の物語の設定にて、起承転結の4つのシーンのプロットを作成してください。
    
・ジャンル: ${nps.genre}
・いつ（When）：  ${nps.when}
・どこで（Where）： ${nps.where}
・誰が（Who）： ${nps.who}
・何を（What）： ${nps.what}
・どのように（How）： ${nps.how}
・なぜ（Why）： ${nps.why}
    
以上の設定を再度復唱する必要はありません。加えて、以下のプロットのフォーマットを利用して出力するようにしてください。

■「起」
・シーン名: 
・登場人物: 
・場所: 
・時間: 
・天候: 
・起こる出来事: 
・シーンの目的: 
・書いておくべき情報・伏線: 

■「承」
・シーン名: 
・登場人物: 
・場所: 
・時間: 
・天候: 
・起こる出来事: 
・シーンの目的: 
・書いておくべき情報・伏線: 

■「転」
・シーン名: 
・登場人物: 
・場所: 
・時間: 
・天候: 
・起こる出来事: 
・シーンの目的: 
・書いておくべき情報・伏線: 

■「結」
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
    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`
        },
        method: 'POST',
        body: JSON.stringify({
            messages: [{ role: 'user', content: prompt }],
            model: 'gpt-3.5-turbo',
            stream: true
        })
    });

    const encoder = new TextEncoder();
    const reader = completion.body?.getReader();

    if (completion.status !== 200 || !reader) {
        const readable = new ReadableStream({
            start(controller) {
                controller.enqueue(
                    encoder.encode(
                        '<html><head><title>OpenAI API has somthing wrong.</title></head><body>',
                    ),
                );
                controller.enqueue(encoder.encode('OpenAI API has somthing wrong.'));
                controller.enqueue(encoder.encode('<br>status: ' + completion.status));
                controller.enqueue(encoder.encode('<br>statusText: ' + completion.statusText));
                controller.enqueue(encoder.encode('</body></html>'));
                controller.close();
            },
        });
        return new Response(readable, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
    }

    const decoder = new TextDecoder('utf-8');
    const readable = new ReadableStream({
        async start(controller) {
            try {
                // readAndEnqueue という再帰関数を定義
                const readAndEnqueue = async (): Promise<any> => {
                    const { done, value } = await reader.read();
                    if (done) return reader.releaseLock(); // readerが空になったら終了

                    const chunk = decoder.decode(value, { stream: true });
                    // Event stream format
                    // https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format
                    // console.log(chunk);
                    // 以下のようなテキストが返ってくる
                    // data: {"id":"chatcmpl-78stxULKFHLxPg1GjbjBATBlajkYg","object":"chat.completion.chunk","created":1682352021,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":"から"},"index":0,"finish_reason":null}]}
                    // data: {"id":"chatcmpl-78stxULKFHLxPg1GjbjBATBlajkYg","object":"chat.completion.chunk","created":1682352021,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{},"index":0,"finish_reason":"stop"}]}
                    // data: [DONE]

                    const jsons: any[] = chunk
                        .split('data:') // JSONがdataに複数格納されていることもあるため split する
                        .map((data) => {
                            const trimData = data.trim();
                            if (trimData === '') return undefined;
                            if (trimData === '[DONE]') return undefined; // 最後の行
                            return JSON.parse(data.trim());
                        })
                        .filter((data) => data);

                    // console.log(jsons);
                    // 以下のようなオブジェクトの配列になっている
                    // [{"id":"chatcmpl-78stxULKFHLxPg1GjbjBATBlajkYg","object":"chat.completion.chunk","created":1682352021,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":"る"},"index":0,"finish_reason":null}]}]

                    jsons.forEach((json) => {
                        controller.enqueue(
                            encoder.encode(
                                json["choices"][0]["delta"]["content"]
                            ),
                        );
                    });
                    return readAndEnqueue();
                };
                await readAndEnqueue();
            } catch (e) {
                console.error(e);
            }
            // readAndEnqueueの終了後、リソースを解放
            reader.releaseLock();
            controller.close();
        },
    });

    return new Response(readable, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
}