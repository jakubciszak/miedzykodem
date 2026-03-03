import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const POSTS_DATA_PATH = path.join(ROOT, 'src', 'generated', 'posts-data.js');

const SITE_URL = 'https://miedzykodem.dev';
const SITE_TITLE = 'Między kodem, a kulturą';
const SITE_DESCRIPTION = 'Myśli o architekturze, kulturze i ewolucji oprogramowania. Blog Jakuba Ciszaka.';
const AUTHOR_NAME = 'Jakub Ciszak';

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function main() {
  const module = await import(POSTS_DATA_PATH);
  const { posts } = module.default;

  const now = new Date().toISOString();
  const lastPostDate = posts.length > 0
    ? new Date(posts[0].dateISO).toISOString()
    : now;

  const entries = posts.map((post) => {
    const url = `${SITE_URL}/blog/${post.slug}`;
    const published = new Date(post.dateISO).toISOString();
    return `  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${url}" rel="alternate" type="text/html"/>
    <id>${url}</id>
    <published>${published}</published>
    <updated>${published}</updated>
    <author><name>${escapeXml(AUTHOR_NAME)}</name></author>
    <summary>${escapeXml(post.excerpt)}</summary>
    <content type="html">${escapeXml(post.htmlContent)}</content>
  </entry>`;
  });

  const atom = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(SITE_TITLE)}</title>
  <subtitle>${escapeXml(SITE_DESCRIPTION)}</subtitle>
  <link href="${SITE_URL}/feed.xml" rel="self" type="application/atom+xml"/>
  <link href="${SITE_URL}" rel="alternate" type="text/html"/>
  <id>${SITE_URL}/</id>
  <updated>${lastPostDate}</updated>
  <author><name>${escapeXml(AUTHOR_NAME)}</name></author>
${entries.join('\n')}
</feed>
`;

  fs.writeFileSync(path.join(DIST, 'feed.xml'), atom, 'utf-8');
  console.log(`[rss] Generated feed.xml with ${posts.length} entries`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
