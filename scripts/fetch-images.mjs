import { Client } from '@notionhq/client';
import fs from 'fs';
import path from 'path';
import https from 'https';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: '.env.local' });

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

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

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                 reject(new Error(`Failed to download: ${response.statusCode}`));
                 return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => {});
            reject(err);
        });
    });
}

async function main() {
  console.log('Fetching pages...');
  const pages = await notion.databases.query({ database_id: DATABASE_ID });
  
  for (const page of pages.results) {
      console.log(`Processing page: ${page.id}`);
      let blocks = [];
      let hasMore = true;
      let cursor = undefined;
      
      while (hasMore) {
          const response = await notion.blocks.children.list({
              block_id: page.id,
              start_cursor: cursor,
          });
          blocks = [...blocks, ...response.results];
          hasMore = response.has_more;
          cursor = response.next_cursor;
      }

      for (const block of blocks) {
          if (block.type === 'image' && block.image.type === 'file') {
              const url = block.image.file.url;
              const blockId = block.id;
              // Extract extension from URL (usually after ? before access params, but signed aws urls are messy)
              // Actually Notion file urls usually contain filename at the end of path before params.
              // Let's rely on parsing the URL path.
              const urlObj = new URL(url);
              const pathname = urlObj.pathname;
              const ext = path.extname(pathname) || '.jpg'; // Fallback
              
              const filename = `${blockId}${ext}`;
              const filepath = path.join(PUBLIC_DIR, filename);

              // Check if already exists (optional: check if newer? Notion URLs change when expired so hard to rely on URL for caching unless we save metadata. 
              // Simplest for now: if file exists, skip. But wait, signed URLs expire, but the image content doesn't change for the same block ID usually unless updated.
              // Block ID is unique. If user updates image in Notion, does Block ID change? 
              // Usually replacing an image in Notion updates the block content. The ID might persist or change.
              // To be safe for updates, we might want to redownload if we can't be sure.
              // But for build speed, let's skip if exists. 
              // User said "deployed site", so local build is fresh or user can clear folder if needed.
              // Actually, since this is for "remote site" (vercel probably), the build env might be ephemeral anyway, so it will always download.
              // locally, we might want to skip to avoid spamming downloads.
              
              if (fs.existsSync(filepath)) {
                  console.log(`Skipping existing image: ${filename}`);
                  continue;
              }

              console.log(`Downloading image: ${filename}`);
              try {
                  await downloadImage(url, filepath);
              } catch (e) {
                  console.error(`Failed to download ${filename}:`, e);
              }
          }
      }
  }
}

main().catch(console.error);
