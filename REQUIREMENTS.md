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

## 4. デザインガイドライン

### ✦ スパークル装飾

サイト全体で使われる `✦` 記号のアニメーションルール。

#### Hero スパークル（絶対配置・大）
- ファイル: `src/app/components/hero.module.css`
- キーフレーム: `sparkle-right`（lilac系）/ `sparkle-left`（slate4系）
- 効果: opacity(.3→1) + scale(.85→1.05) + カラーシフト
- ピーク色: right → `#CEC7E4`、left → `#A4C0CB`
- PCサイズ: right `36px`、left `22px`（モバイルはright `24px`、left `14px`）

```css
@keyframes sparkle-right {
  0%, 100% { opacity: .3;  transform: scale(.85); color: var(--rs-lilac); }
  50%       { opacity: 1;  transform: scale(1.05); color: #CEC7E4; }
}
```

#### セクションヘッダー / Contact スパークル（インライン・小）
- ファイル: `SectionHeader.module.css`、`contact.module.css`
- 効果: opacity(.3→1) + カラーシフトのみ（scaleは縦ガタつきの原因になるため除外）
- lilac系ピーク色: `#CEC7E4`、rose系ピーク色: `#E8D0D3`

```css
@keyframes sparkle-lilac {
  0%, 100% { opacity: .3;  color: var(--rs-lilac); }
  50%       { opacity: 1;   color: #CEC7E4; }
}
```

> **注意**: キーフレームは各 `.module.css` ファイル内で定義すること。`globals.css` に定義した場合、CSS Modules のスコープ処理でアニメーション名が解決されないケースがある。

---

## 5. 今後の要件・TODO
- [ ] Notionデータベースと各セクション（Events, Music）の連携確認
- [ ] デザインのブラッシュアップ
- [ ] SEO設定 (Metadata)
- [ ] 
