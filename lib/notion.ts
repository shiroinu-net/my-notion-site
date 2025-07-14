import { Client } from '@notionhq/client';
import { BlockObjectResponse, PageObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID || '';

// データベースからすべてのページを取得する関数
export async function getDatabasePages() {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    // ここでフィルターやソートを追加することも可能
    // filter: {
    //   property: 'Published',
    //   checkbox: {
    //     equals: true,
    //   },
    // },
    // sorts: [
    //   {
    //     property: 'Date',
    //     direction: 'descending',
    //   },
    // ],
  });
  // ページオブジェクトのみをフィルタリング (型安全のため)
  return response.results.filter((page): page is PageObjectResponse => 'properties' in page);
}

// 特定のページのブロックコンテンツを取得する関数
export async function getPageBlocks(blockId: string) {
  const response = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 100, // 取得するブロックの最大数
  });
  // ブロックオブジェクトのみをフィルタリング (型安全のため)
  return response.results.filter((block): block is BlockObjectResponse => 'type' in block);
}

// Notionのプロパティからプレーンテキストを取得するヘルパー関数
export function getRichTextContent(richTextProperty: RichTextItemResponse[]): string {
  return richTextProperty.map((text) => text.plain_text).join('');
}
