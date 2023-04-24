export const config = {
    runtime: 'edge',
}

export default async function handler() {
    const API_KEY = process.env.OPENAI_API_KEY;
    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`
        },
        method: 'POST',
        body: JSON.stringify({
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            messages: [{ role: 'user', content: '何かジョークをひとつ言ってください。'}],
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

                    const jsons :any[] = chunk
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