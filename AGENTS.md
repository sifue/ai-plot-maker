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

#### Node.js 22へのアップデート

以下の連絡があり、Node.js 18のサポートが終了するため、Node.js 22へのアップグレードが必要です。この対応を進める必要があります。


```
Hi sifue,

Starting Monday, September 1st, 2025, Node.js 18 will no longer be supported on Vercel. Please upgrade to Node.js 22 as soon as possible to keep receiving security updates and prevent any errors.

Your account is associated with the following projects using Node.js 18:

- ai-plot-maker
- otsukaeiji-storymaker

You can see which of your projects for a specific team are affected with:

$ npm i -g vercel@latest
$ vercel project ls --update-required --scope VERCEL_TEAM_SLUG
To upgrade:

Update engines in package.json to "22.x" or on the General page in your Vercel Project Settings.
Create a new deployment for the changes to take effect.
In many cases, you will need to update dependencies in package.json as well.

For more information, check out the documentation.

Happy shipping,

The Vercel Team
```

#### GPT-5対応
gpt-5がリリースされました、価格的にも性能的にも向上しているため、gpt-4oからgpt-5に切り替える必要があります。

リリース情報は以下のとおり。

- [gpt-5のリリースノート](https://openai.com/ja-JP/gpt-5/)
- [gpt-5のモデルリファレンス](https://platform.openai.com/docs/models/gpt-5)
- [gpt-5のプロンプトガイド](https://cookbook.openai.com/examples/gpt-5/gpt-5_prompting_guide)
- [gpt-5のFrontend coding with GPT-5](https://cookbook.openai.com/examples/gpt-5/gpt-5_frontend)
- [gpt-5のNew Params and Tools](https://cookbook.openai.com/examples/gpt-5/gpt-5_new_params_and_tools)

切り替えによってパフォーマンスが向上するかどうかを検討し、必要に応じてコードの修正を行ってください。
またREADME.mdの内容も更新し、バージョンをあげてください。