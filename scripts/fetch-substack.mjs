#!/usr/bin/env node
/**
 * Fetches the latest posts from thewhyman.blog RSS feed and writes
 * data/substack_posts.json for use in the static build.
 * Runs as part of the prebuild step.
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dirname, '../data/substack_posts.json');
const FEED_URL = 'https://thewhyman.substack.com/feed';
const MAX_POSTS = 4;

function parseDate(pubDate) {
  try {
    const d = new Date(pubDate);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return pubDate.slice(0, 16);
  }
}

function extractEnclosureUrl(itemXml) {
  const m = itemXml.match(/<enclosure[^>]+url="([^"]+)"/);
  return m ? m[1] : '';
}

function extractContentImage(itemXml) {
  const m = itemXml.match(/src="(https:\/\/[^"]*(?:substack|amazonaws)[^"]+\.(png|jpg|jpeg|webp)[^"]*)"/);
  return m ? m[1] : '';
}

function stripCdata(str) {
  return str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#8212;/g, '—')
    .replace(/&#8211;/g, '–')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8217;/g, '’')
    .trim();
}

function getTagContent(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return m ? stripCdata(m[1]).trim() : '';
}

async function main() {
  console.log(`Fetching Substack feed from ${FEED_URL}...`);

  const res = await fetch(FEED_URL, {
    headers: { 'User-Agent': 'thewhyman-com-build/1.0' },
  });

  if (!res.ok) throw new Error(`Feed fetch failed: ${res.status} ${res.statusText}`);

  const xml = await res.text();

  // Split into individual <item> blocks
  const itemBlocks = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    itemBlocks.push(match[1]);
  }

  const posts = itemBlocks.slice(0, MAX_POSTS).map((block) => {
    const title = getTagContent(block, 'title');
    const link = getTagContent(block, 'link');
    const description = getTagContent(block, 'description');
    const pubDate = getTagContent(block, 'pubDate');
    const image = extractEnclosureUrl(block) || extractContentImage(block);

    return {
      title,
      date: parseDate(pubDate),
      description,
      url: link,
      image,
    };
  });

  writeFileSync(OUTPUT, JSON.stringify(posts, null, 2));
  console.log(`Wrote ${posts.length} posts to data/substack_posts.json`);
  posts.forEach((p) => console.log(`  - ${p.title.slice(0, 60)} [${p.image ? 'img' : 'no img'}]`));
}

main().catch((err) => {
  console.error('fetch-substack failed:', err.message);
  // Non-fatal: build continues with existing data/substack_posts.json
  process.exit(0);
});
