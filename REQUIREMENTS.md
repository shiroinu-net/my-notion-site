# プロジェクト要件定義

## 1. プロジェクト概要
NotionをCMS（コンテンツ管理システム）として利用した個人のポートフォリオ/ブログサイト。
Next.jsを用いた静的サイト生成（SSG）を行い、GitHub Pagesへのデプロイを想定。
テスト用のgithub pages: https://shiroinu-net.github.io/my-notion-site/

## 2. 実装済み/想定機能
### フロントエンド (Landing Page)
- **Hero & Profile**: 自己紹介セクション
- **Events**: イベント情報（Notionデータベース連動？）
- **Music**: 音楽活動の紹介
- **Contact**: コンタクトフォームまたは連絡先表示

### ブログ/コンテンツ (Notion CMS)
- Notion上のページをブログ記事としてレンダリング (`react-notion-x` 使用)
- `posts/[id]` による個別記事ページ

## 3. 技術スタック
- **Framework**: Next.js (App Router) v14.2.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Alpha)
- **CMS**: Notion API (`@notionhq/client`, `react-notion-x`)
- **Syntax Highlighting**: PrismJS / Highlight.js
- **Deploy**: GitHub Pages

## 4. 今後の要件・TODO
- [ ] Notionデータベースと各セクション（Events, Music）の連携確認
- [ ] デザインのブラッシュアップ
- [ ] SEO設定 (Metadata)
- [ ] 
