import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',

  // GitHub Pagesでリポジトリ名がパスに含まれる場合（例: your-username.github.io/your-repo-name/）
  // プロジェクトのリポジトリ名が `my-notion-site` なら、`/my-notion-site/` を設定します。
  // もしユーザーページ（your-username.github.io）として公開するなら不要です。
  basePath: process.env.NODE_ENV === 'production' ? '/my-notion-site' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/my-notion-site/' : '',
};

export default nextConfig;
