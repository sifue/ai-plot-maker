# リポジトリ運用ガイドライン

## 言語設定 (Language Configuration)
このプロジェクトは日本語環境での動作を前提とする。  
基本的な受け答えは、全て日本語で行うこと。

- **コミュニケーション**: 日本語で対応
- **コメント**: コードコメントは日本語で記述
- **ドキュメント**: 技術文書は日本語で作成
- **エラーメッセージ**: 可能な限り日本語で表示
- **変数名・関数名**: 英語を使用（国際的な慣例に従う）

## プロジェクト状況
本リポジトリは、ChatGPTで、物語のプロットをお手軽作成するWebサービスai-plot-makerを開発するものです。Vercelで動かすことを前提で、Edge Functionsを利用しています。

[https://ai-plot-maker.vercel.app/](https://ai-plot-maker.vercel.app/) でテスト運用中となっています。


### 対応が必要な問題

#### Node.js 24へのアップデート

以下の連絡があり、Node.js 20のサポートが終了するため、Node.js 24へのアップグレードが必要です。この対応を進める必要があります。


```
Hi there,

Please upgrade to Node.js 24 as soon as possible. After October 1st, new builds using Node.js 20 will fail. Node.js 20 has reached end-of-life and no longer receives important security updates.


Your account is associated with the following projects using Node.js 20:

ai-plot-maker
mcq-maker
mcq-maker-z
nextjs-quickstart
otsukaeiji-storymaker
How to upgrade
Team Owners and Members can upgrade all deprecated projects with a single click from the Vercel Dashboard. Alternatively, you can upgrade individual projects on the Build and Deployment page in your Vercel Project Settings.

Note: If you’ve explicitly set your Node.js version in package.json, this will override any dashboard setting so you’ll still need to update that manually to "24.x".

You can additionally check your affected projects via CLI, by running:

$ npm i -g vercel@latest
$ vercel project ls --update-required --scope VERCEL_TEAM_SLUG

For more information, check out the documentation.

Happy shipping,

The Vercel Team

```

#### GPT-5.6対応
gpt-5.6がリリースされました、価格的にも性能的にも向上しているため、
gpt-5.6-lunaを導入してうごくようにしてください。元のモデルから費用面、パフォーマンス面で
劣らないかを調査して組み込んでもらうようお願いします。

切り替えによってパフォーマンスが向上するかどうかを検討し、必要に応じてコードの修正を行ってください。
またREADME.mdの内容も更新し、バージョンをあげてください。
