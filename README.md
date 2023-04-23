# AIプロットメーカー
ChatGPTで、起承転結の物語のプロットをお手軽作成するWebサービス

# 利用方法

## 環境変数の設定
`.env.local` ファイルに
```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
このようにOpneAIのAPIキーを設定。

## デプロイ
[Firebaseでのデプロイ](https://firebase.google.com/docs/hosting/nextjs?hl=ja)を想定。プランは従量制のBlaze以上である必要がある。

Windowsでのログイン時の注意。

```
PowerShell -ExecutionPolicy RemoteSigned firebase login
```

のように、`PowerShell -ExecutionPolicy RemoteSigned`を付けないとログインやデプロイできない。
```
PowerShell -ExecutionPolicy RemoteSigned firebase experiments:enable webframeworks
PowerShell -ExecutionPolicy RemoteSigned firebase deploy
```

これで静的サイトをデプロイする。デプロイは、ローカルですることを前提。


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
