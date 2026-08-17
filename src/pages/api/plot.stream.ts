import { PlotParameter, PARAMETERS } from '../../components/parameters'
import { buildPlotPrompt } from '../../lib/plot-prompt'
import { NextRequest } from 'next/server'
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

    const prompt = buildPlotPrompt(nps);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ message: 'OPENAI_API_KEY が設定されていません。サーバー側環境変数を確認してください。' }), { status: 500 });
    }

    const model = process.env.OPENAI_MODEL || 'gpt-5.6-luna';

    const res = await fetch('https://api.openai.com/v1/responses', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        method: 'POST',
        body: JSON.stringify({
            model,
            input: prompt,
            // GPT-5.1の既定値と同じ条件にして、移行時の遅延増加を防ぐ
            reasoning: { effort: 'none' },
            stream: true
        })
    });

    if (res.status !== 200) {
        let errorText = '';
        try {
            errorText = await res.text();
        } catch (_) {}
        console.log(`Fetch to OpenAI API failed. status: ${res.status}`);
        console.log(errorText);
        return new Response(JSON.stringify({ status: res.status, message: errorText || 'OpenAI API 呼び出しに失敗しました' }), { status: res.status });
    }

    // 問題なければそのままServer-sent Eventをクライアントに転送する
    return new Response(res.body, {
        headers: { 'Content-Type': 'text/event-stream;charset=utf-8' },
    });

}
