import { loadEnvFile } from 'node:process';
import { performance } from 'node:perf_hooks';
import { createParser } from 'eventsource-parser';

import { buildPlotPrompt } from '../src/lib/plot-prompt.ts';

try {
    loadEnvFile('.env.local');
} catch (error) {
    if (error?.code !== 'ENOENT') throw error;
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    throw new Error('OPENAI_API_KEY が設定されていません。');
}

const allConfigurations = [
    { model: 'gpt-5.1', effort: 'none' },
    { model: 'gpt-5.6-luna', effort: 'none' },
    { model: 'gpt-5.6-luna', effort: 'low' },
];

const configurationFilter = process.env.EVALUATION_MODELS?.split(',');
const configurations = configurationFilter
    ? allConfigurations.filter((configuration) =>
          configurationFilter.includes(
              `${configuration.model}:${configuration.effort}`,
          ),
      )
    : allConfigurations;

if (configurations.length === 0) {
    throw new Error('EVALUATION_MODELS に一致する評価構成がありません。');
}

const samples = [
    {
        name: 'ミステリー',
        novelist: '江戸川乱歩',
        genre: 'ミステリー',
        when: '昭和初期の冬',
        where: '雪に閉ざされた山荘',
        who: '記憶を失った探偵',
        what: '消えた肖像画の謎を',
        how: '残された暗号を解きながら',
        why: '無実の使用人を救うため',
    },
    {
        name: 'SF',
        novelist: '海野十三',
        genre: 'SF',
        when: '22世紀の夏',
        where: '火星の地下都市',
        who: '気象技師の姉妹',
        what: '人工太陽の停止事故を',
        how: '旧式ロボットと協力して',
        why: '都市の住民を避難させるため',
    },
    {
        name: '人間ドラマ',
        novelist: '芥川龍之介',
        genre: '人間ドラマ',
        when: '現代の春',
        where: '廃校直前の島の中学校',
        who: '赴任したばかりの音楽教師',
        what: '最後の卒業演奏会を',
        how: '対立する島民をまとめながら',
        why: '一人だけの卒業生との約束を守るため',
    },
];

const tokenPrices = {
    'gpt-5.1': { input: 1.25, cachedInput: 0.125, output: 10.0 },
    'gpt-5.6-luna': { input: 0.2, cachedInput: 0.02, output: 1.2 },
};

function evaluateFormat(output, novelist) {
    const scenes = ['起', '承', '転', '結'];
    const fields = [
        'シーン名',
        '登場人物',
        '場所',
        '時間',
        '天候',
        '起こる出来事',
        'シーンの目的',
        '書いておくべき情報・伏線',
    ];

    const sceneCount = scenes.filter((scene) =>
        output.includes(`「${scene}」`),
    ).length;
    const completeFields = fields.filter((field) =>
        (output.match(new RegExp(field, 'g')) || []).length >= 4,
    ).length;

    return {
        sceneCount,
        completeFields,
        novelistExcluded: !output.includes(novelist),
        passed:
            sceneCount === scenes.length &&
            completeFields === fields.length &&
            !output.includes(novelist),
    };
}

function estimateCost(model, usage) {
    const price = tokenPrices[model];
    const cachedTokens = usage?.input_tokens_details?.cached_tokens || 0;
    const inputTokens = usage?.input_tokens || 0;
    const outputTokens = usage?.output_tokens || 0;
    return (
        ((inputTokens - cachedTokens) * price.input +
            cachedTokens * price.cachedInput +
            outputTokens * price.output) /
        1_000_000
    );
}

async function runEvaluation(configuration, sample) {
    const startedAt = performance.now();
    let firstTokenAt;
    let output = '';
    let usage;
    let responseError;
    let responseStatus = 'completed';

    const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: configuration.model,
            input: buildPlotPrompt(sample),
            reasoning: { effort: configuration.effort },
            max_output_tokens: 8000,
            stream: true,
        }),
    });

    if (!response.ok) {
        throw new Error(
            `${configuration.model}の呼び出しに失敗しました（${response.status}）: ${await response.text()}`,
        );
    }
    if (!response.body) {
        throw new Error(`${configuration.model}のレスポンス本文がありません。`);
    }

    const parser = createParser((event) => {
        if (event.type !== 'event' || event.data === '[DONE]') return;

        const data = JSON.parse(event.data);
        if (data.type === 'response.output_text.delta') {
            firstTokenAt ??= performance.now();
            output += data.delta;
        } else if (data.type === 'response.completed') {
            usage = data.response?.usage;
        } else if (data.type === 'response.incomplete') {
            usage = data.response?.usage;
            responseStatus = 'incomplete';
        } else if (data.type === 'response.failed') {
            responseError = data.response?.error || data;
        }
    });

    const decoder = new TextDecoder();
    for await (const chunk of response.body) {
        parser.feed(decoder.decode(chunk, { stream: true }));
    }

    if (responseError) {
        throw new Error(JSON.stringify(responseError));
    }

    const completedAt = performance.now();
    return {
        sample: sample.name,
        model: configuration.model,
        effort: configuration.effort,
        responseStatus,
        firstTokenMs: Math.round((firstTokenAt || completedAt) - startedAt),
        totalMs: Math.round(completedAt - startedAt),
        inputTokens: usage?.input_tokens,
        outputTokens: usage?.output_tokens,
        reasoningTokens: usage?.output_tokens_details?.reasoning_tokens || 0,
        estimatedCostUsd: Number(
            estimateCost(configuration.model, usage).toFixed(6),
        ),
        format: evaluateFormat(output, sample.novelist),
    };
}

const results = [];
for (const configuration of configurations) {
    for (const sample of samples) {
        process.stderr.write(
            `${configuration.model} (${configuration.effort}) / ${sample.name} を評価中...\n`,
        );
        results.push(await runEvaluation(configuration, sample));
    }
}

const summary = Object.values(
    results.reduce((groups, result) => {
        const key = `${result.model}:${result.effort}`;
        groups[key] ??= {
            model: result.model,
            effort: result.effort,
            runs: 0,
            firstTokenMs: 0,
            totalMs: 0,
            inputTokens: 0,
            outputTokens: 0,
            reasoningTokens: 0,
            estimatedCostUsd: 0,
            formatPasses: 0,
            completedRuns: 0,
        };
        const group = groups[key];
        group.runs += 1;
        group.firstTokenMs += result.firstTokenMs;
        group.totalMs += result.totalMs;
        group.inputTokens += result.inputTokens || 0;
        group.outputTokens += result.outputTokens || 0;
        group.reasoningTokens += result.reasoningTokens || 0;
        group.estimatedCostUsd += result.estimatedCostUsd;
        group.formatPasses += result.format.passed ? 1 : 0;
        group.completedRuns += result.responseStatus === 'completed' ? 1 : 0;
        return groups;
    }, {}),
).map((group) => ({
    model: group.model,
    effort: group.effort,
    runs: group.runs,
    averageFirstTokenMs: Math.round(group.firstTokenMs / group.runs),
    averageTotalMs: Math.round(group.totalMs / group.runs),
    averageInputTokens: Math.round(group.inputTokens / group.runs),
    averageOutputTokens: Math.round(group.outputTokens / group.runs),
    averageReasoningTokens: Math.round(group.reasoningTokens / group.runs),
    totalEstimatedCostUsd: Number(group.estimatedCostUsd.toFixed(6)),
    completionRate: `${group.completedRuns}/${group.runs}`,
    formatPassRate: `${group.formatPasses}/${group.runs}`,
}));

console.log(JSON.stringify({ summary, results }, null, 2));
