# AIプロットメーカー

生成AIを使って、物語のプロットを手軽に作成するWebサービスです。
Vercelで動かすことを前提に、Edge Functionsを利用しています。

[https://ai-plot-maker.vercel.app/](https://ai-plot-maker.vercel.app/) でテスト運用中。

## 動作要件

- Node.js 24
- npm 11
- OpenAI APIキー

バージョン0.3.0で、VercelのNode.js 20サポート終了に備えてNode.js 24へ更新し、生成モデルを`gpt-5.1`から`gpt-5.6-luna`へ変更しました。

## OpenAIモデル

- 既定モデル: `gpt-5.6-luna`
- API: Responses API
- 配信方式: Server-Sent Eventsによるストリーミング
- Reasoning effort: `none`

GPT-5.6-lunaの既定のreasoning effortは`medium`ですが、このサービスのプロット生成では、GPT-5.1と同じ条件で遅延を抑えられる`none`を明示しています。モデルはVercelの環境変数`OPENAI_MODEL`で上書きできるため、問題発生時は`gpt-5.1`へ戻せます。

### 価格比較

2026年8月17日時点の公式価格です。金額は100万トークンあたりの米ドル価格です。

| モデル | 入力 | キャッシュ入力 | 出力 |
| --- | ---: | ---: | ---: |
| GPT-5.1 | $1.25 | $0.125 | $10.00 |
| GPT-5.6 Luna | $0.20 | $0.02 | $1.20 |

最新価格は[GPT-5.1のモデル情報](https://developers.openai.com/api/docs/models/gpt-5.1)と[GPT-5.6 Lunaのモデル情報](https://developers.openai.com/api/docs/models/gpt-5.6-luna)を確認してください。

### 移行時の比較結果

ミステリー、SF、人間ドラマの3入力を同じプロンプトで1回ずつ生成した結果です。時間はネットワークやAPIの混雑状況で変動するため、相対的な目安として扱ってください。

| モデル・設定 | 初回出力までの平均 | 完了までの平均 | 平均出力トークン | 3回分の推定費用 | 必須形式の充足 |
| --- | ---: | ---: | ---: | ---: | ---: |
| GPT-5.1 / none | 1.31秒 | 86.51秒 | 7,068 | $0.214025 | 3/3 |
| GPT-5.6 Luna / none | 1.16秒 | 34.25秒 | 4,150 | $0.015260 | 3/3 |
| GPT-5.6 Luna / low | 1.86秒 | 37.29秒 | 4,455 | $0.016357 | 3/3 |

`gpt-5.6-luna`の`none`は、GPT-5.1と比べて初回出力が約11%速く、完了までが約60%速く、実測トークンを含む推定費用が約93%低い結果でした。全ケースで起承転結、各シーンの必須項目、作家名を登場人物に含めない条件を満たしたため、この構成を採用しています。

比較は次のコマンドで再実行できます。OpenAI APIの利用料金が発生します。

```bash
npm run evaluate:models
```

特定の構成だけを評価する場合は、`EVALUATION_MODELS`を指定します。

```bash
EVALUATION_MODELS=gpt-5.6-luna:none npm run evaluate:models
```

## ローカル開発

`.nvmrc`を利用する場合は、Node.js 24をインストールして切り替えます。

```bash
nvm install
nvm use
npm ci
npm run dev
```

## 環境変数の設定

`.env.local`ファイルに次の値を設定します。

```dotenv
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-5.6-luna
NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-xxxxxxxxx
```

`OPENAI_MODEL`は省略可能で、省略時は`gpt-5.6-luna`を利用します。`NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID`も任意です。

## デプロイ

Vercelの環境変数に`OPENAI_API_KEY`を設定してください。Project SettingsのNode.js Versionは、`package.json`の`engines`と同じ24系に設定します。Preview Deploymentで生成とストリーミングを確認してからProductionへ反映してください。

## 主なコマンド

```bash
npm run dev              # 開発サーバーを起動
npm run lint             # ESLintを実行
npm run build            # 本番ビルドを作成
npm run start            # 本番ビルドを起動
npm run evaluate:models  # OpenAIモデルを比較評価
```

## 技術構成

- Next.js 13.5.11（Pages Router）
- React 18
- TypeScript
- Tailwind CSS
- Vercel Edge Functions
- OpenAI Responses API

詳細は[Next.jsドキュメント](https://nextjs.org/docs)と[Vercelのデプロイドキュメント](https://vercel.com/docs/deployments)を参照してください。
