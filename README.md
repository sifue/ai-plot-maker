# AIプロットメーカー
ChatGPTで、物語のプロットをお手軽作成するWebサービス。
Vercelで動かすことを前提で、Edge Functionsを利用しています。

[https://ai-plot-maker.vercel.app/](https://ai-plot-maker.vercel.app/) でテスト運用中。

# 利用方法

## 重要なお知らせ（2025-08）
- Node.js 18のVercelサポート終了に伴い、Node.js 22にアップグレードしました。
- 生成AIモデルを gpt-4o から gpt-5 に切り替えました（高速・高品質化）。

### Node.js バージョン要件
- 本プロジェクトは Node.js 22 を前提とします。
- `package.json` の `engines.node` は `22.x` に設定済みです。
- ローカル開発時は Node.js 22 環境で実行してください（例：`nvm use 22`）。

### モデルについて（gpt-5）
- API の呼び出しモデルは `gpt-5` を利用します。
- ストリーミングは従来どおり Server-Sent Events を利用しています。

## 環境変数の設定
`.env.local` ファイルに
```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-xxxxxxxxx
```
このようにOpneAIのAPIキーを設定。 `NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID` はGTMを利用したGoogle Analitics 4の測定方法だが特に設定しなくてもよい([参考](https://zenn.dev/keitakn/articles/nextjs-google-tag-manager))。

## デプロイ
Vercelに通常通りログインして、環境変数に `OPENAI_API_KEY` を設定してください。
また、VercelのProject SettingsでNode.jsのバージョンが22系であることを確認してください（`package.json` の `engines` と揃える）。


# Next.jsプロジェクトの利用方法

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
