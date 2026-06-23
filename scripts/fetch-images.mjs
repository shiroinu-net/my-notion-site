import { Client } from '@notionhq/client';
import fs from 'fs';
import path from 'path';
import https from 'https';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Load environment variables
dotenv.config({ path: '.env.local' });

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const WORKS_DATABASE_ID = process.env.NOTION_WORKS_DATABASE_ID;

if (!NOTION_TOKEN || !DATABASE_ID) {
  console.error('Missing NOTION_TOKEN or NOTION_DATABASE_ID');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '../public/notion-images');

if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

async function downloadAndOptimizeImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: ${response.statusCode}`));
          return;
        }

        const transformer = sharp().resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 80 });
        const fileStream = fs.createWriteStream(filepath);

        response.pipe(transformer).pipe(fileStream);

        fileStream.on('finish', () => resolve());
        fileStream.on('error', (err) => {
          fs.unlink(filepath, () => {});
          reject(err);
        });
        transformer.on('error', (err) => {
          console.error('Sharp transformation error:', err);
          reject(err);
        });
      })
      .on('error', (err) => reject(err));
  });
}

// ページ本文ブロック内の file 画像を <blockId>.webp で保存
async function processPageBlocks(pageId) {
  let blocks = [];
  let hasMore = true;
  let cursor = undefined;

  while (hasMore) {
    const response = await notion.blocks.children.list({ block_id: pageId, start_cursor: cursor });
    blocks = [...blocks, ...response.results];
    hasMore = response.has_more;
    cursor = response.next_cursor;
  }

  for (const block of blocks) {
    if (block.type === 'image' && block.image.type === 'file') {
      const filename = `${block.id}.webp`;
      const filepath = path.join(PUBLIC_DIR, filename);
      if (fs.existsSync(filepath)) {
        console.log(`Skipping existing image: ${filename}`);
        continue;
      }
      console.log(`Downloading block image: ${filename}`);
      try {
        await downloadAndOptimizeImage(block.image.file.url, filepath);
      } catch (e) {
        console.error(`Failed to process ${filename}:`, e);
      }
    }
  }
}

// Works の Cover プロパティを cover-<pageId>.webp で保存
async function processCover(page) {
  const cover = page.properties?.Cover;
  if (!cover || cover.type !== 'files' || cover.files.length === 0) return;

  const file = cover.files[0];
  const url = file.type === 'external' ? file.external?.url : file.file?.url;
  if (!url) return;

  // Cover は毎回上書き（差し替えに追従するため既存スキップしない）
  const filename = `cover-${page.id}.webp`;
  const filepath = path.join(PUBLIC_DIR, filename);
  console.log(`Downloading cover: ${filename}`);
  try {
    await downloadAndOptimizeImage(url, filepath);
  } catch (e) {
    console.error(`Failed to process ${filename}:`, e);
  }
}

async function processDatabase(databaseId, { covers = false } = {}) {
  const pages = await notion.databases.query({ database_id: databaseId });
  for (const page of pages.results) {
    console.log(`Processing page: ${page.id}`);
    if (covers) await processCover(page);
    await processPageBlocks(page.id);
  }
}

async function main() {
  console.log('Fetching Events DB images...');
  await processDatabase(DATABASE_ID);

  if (WORKS_DATABASE_ID) {
    console.log('Fetching Works DB images...');
    await processDatabase(WORKS_DATABASE_ID, { covers: true });
  } else {
    console.warn('NOTION_WORKS_DATABASE_ID not set — skipping Works images.');
  }
}

main().catch(console.error);
