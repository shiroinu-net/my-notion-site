'use client';

import { NotionRenderer } from 'react-notion-x';
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

// NotionRendererのCSSもインポート
import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'highlight.js/styles/atom-one-dark.css';

type Props = {
  blocks: BlockObjectResponse[];
};

export default function PostRenderer({ blocks }: Props) {
  if (!blocks) {
    return null;
  }

  // react-notion-xが期待するデータ形式に変換
  const recordMap: any = {
    block: blocks.reduce((acc, block) => {
      acc[block.id] = { value: block };
      return acc;
    }, {} as Record<string, { value: BlockObjectResponse }>),
    collection: {},
    collection_view: {},
    notion_user: {},
    collection_query: {},
    signed_urls: {},
  };

  return (
    <NotionRenderer
      recordMap={recordMap}
      fullPage={false}
      darkMode={false} // 必要に応じてダークモードを切り替え
    />
  );
}
