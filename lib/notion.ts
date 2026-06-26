import { Client } from '@notionhq/client';
import { BlockObjectResponse, PageObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const WORKS_DATABASE_ID = process.env.NOTION_WORKS_DATABASE_ID;

if (!DATABASE_ID) {
  throw new Error('NOTION_DATABASE_ID is not defined in environment variables.');
}

if (!WORKS_DATABASE_ID) {
  throw new Error('NOTION_WORKS_DATABASE_ID is not defined in environment variables.');
}

// データベースからすべてのページを取得する関数
export async function getDatabasePages(pageSize?: number) {
  const response = await notion.databases.query({
    database_id: DATABASE_ID!,
    // ここでフィルターやソートを追加することも可能
    // filter: {
    //   property: 'Published',
    //   checkbox: {
    //     equals: true,
    //   },
    // },
    sorts: [
      {
        property: 'Date',
        direction: 'descending',
      },
    ],
    page_size: pageSize,
  });
  // ページオブジェクトのみをフィルタリング (型安全のため)
  return response.results.filter((page): page is PageObjectResponse => 'properties' in page);
}

// Works データベースからすべてのページを取得する関数
export async function getWorksPages(pageSize?: number) {
  const response = await notion.databases.query({
    database_id: WORKS_DATABASE_ID!,
    sorts: [
      {
        property: 'Date',
        direction: 'descending',
      },
    ],
    page_size: pageSize,
  });
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

// Works ページの各プロパティを安全に取り出してまとめる
export type WorkData = {
  id: string;
  title: string;
  romaji: string;
  type: string;
  date: string; // ISO 文字列（無ければ ''）
  label: string;
  links: { spotify: string; appleMusic: string; bandcamp: string; youtube: string };
  hasCover: boolean;
};

export function getWorkData(page: PageObjectResponse): WorkData {
  const props = page.properties;

  const rich = (name: string) => {
    const p = props[name];
    return p && 'rich_text' in p ? getRichTextContent(p.rich_text) : '';
  };
  const url = (name: string) => {
    const p = props[name];
    return p && 'url' in p ? p.url || '' : '';
  };

  const titleProp = props.Title;
  const title = titleProp && 'title' in titleProp ? getRichTextContent(titleProp.title) : 'Untitled';

  const dateProp = props.Date;
  const date = dateProp && 'date' in dateProp && dateProp.date ? dateProp.date.start : '';

  const coverProp = props.Cover;
  const hasCover = !!(coverProp && 'files' in coverProp && coverProp.files.length > 0);

  return {
    id: page.id,
    title,
    romaji: rich('Romaji'),
    type: rich('Type'),
    date,
    label: rich('Label'),
    links: {
      spotify: url('Spotify'),
      appleMusic: url('AppleMusic'),
      bandcamp: url('Bandcamp'),
      youtube: url('YouTube'),
    },
    hasCover,
  };
}

// 公開フラグ(check)が ON のものだけを残し、日付の新しい順に並べる
export function publishedSortedWorks(pages: PageObjectResponse[]): PageObjectResponse[] {
  const dateOf = (page: PageObjectResponse) => {
    const p = page.properties.Date;
    return p && 'date' in p && p.date ? p.date.start : '';
  };
  return pages
    .filter((page) => {
      const checkProp = page.properties.check;
      if (checkProp && 'checkbox' in checkProp && !checkProp.checkbox) return false;
      return true;
    })
    .sort((a, b) => dateOf(b).localeCompare(dateOf(a)));
}

// Cover 画像のローカルパス（fetch-images.mjs が cover-<pageId>.webp で保存）
export function coverImagePath(pageId: string): string {
  return `/notion-images/cover-${pageId}.webp`;
}
