import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const POSTS_DATA_PATH = path.join(ROOT, 'src', 'generated', 'posts-data.js');

const SITE_URL = 'https://miedzykodem.dev';
const SITE_NAME = 'Między kodem, a kulturą';

/* ── Read posts data ── */
async function loadPostsData() {
  const module = await import(POSTS_DATA_PATH);
  return module.default;
}

/* ── Generate individual post HTML pages for SEO ── */
function generatePostPage(post, templateHtml) {
  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const title = `${post.title} — ${SITE_NAME}`;
  const description = post.description || post.excerpt;

  /* Build the SEO-enriched HTML with proper meta tags */
  let html = templateHtml;

  /* Replace title */
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(title)}</title>`
  );

  /* Remove existing meta description and og tags, then add new ones */
  html = html.replace(
    /<meta name="description"[^>]*>/,
    `<meta name="description" content="${escapeAttr(description)}">`
  );
  html = html.replace(
    /<meta property="og:title"[^>]*>/,
    `<meta property="og:title" content="${escapeAttr(title)}">`
  );
  html = html.replace(
    /<meta property="og:description"[^>]*>/,
    `<meta property="og:description" content="${escapeAttr(description)}">`
  );
  html = html.replace(
    /<meta property="og:type"[^>]*>/,
    `<meta property="og:type" content="article">`
  );
  html = html.replace(
    /<meta property="og:url"[^>]*>/,
    `<meta property="og:url" content="${postUrl}">`
  );
  html = html.replace(
    /<link rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${postUrl}">`
  );

  /* Add article-specific meta tags before </head> */
  const articleMeta = [
    `<meta property="article:published_time" content="${post.dateISO}">`,
    ...post.tags.map(
      (t) => `<meta property="article:tag" content="${escapeAttr(t)}">`
    ),
    `<meta name="keywords" content="${escapeAttr(post.tags.join(', '))}">`,
    `<meta property="og:site_name" content="${escapeAttr(SITE_NAME)}">`,
    `<meta name="author" content="Jakub Ciszak">`,
  ].join('\n  ');

  html = html.replace('</head>', `  ${articleMeta}\n</head>`);

  /* Add structured data (JSON-LD) for blog post */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: description,
    datePublished: post.dateISO,
    author: {
      '@type': 'Person',
      name: 'Jakub Ciszak',
      url: 'https://github.com/jakubciszak',
    },
    publisher: {
      '@type': 'Person',
      name: 'Jakub Ciszak',
    },
    url: postUrl,
    keywords: post.tags.join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
  };

  const ldScript = `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
  html = html.replace('</head>', `  ${ldScript}\n</head>`);

  /* Insert pre-rendered content for SEO crawlers (hidden noscript block + visible article) */
  const seoContent = `
    <noscript>
      <article style="max-width:760px;margin:0 auto;padding:4rem 2rem;">
        <h1>${escapeHtml(post.title)}</h1>
        <time datetime="${post.dateISO}">${post.date}</time>
        <div>${post.htmlContent}</div>
      </article>
    </noscript>`;

  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"></div>${seoContent}`
  );

  return html;
}

/* ── Generate blog listing page ── */
function generateBlogListPage(posts, templateHtml) {
  const title = `Blog — ${SITE_NAME}`;
  const description = 'Myśli o architekturze, kulturze i ewolucji oprogramowania.';
  const pageUrl = `${SITE_URL}/blog`;

  let html = templateHtml;

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escapeAttr(description)}">`);
  html = html.replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${escapeAttr(title)}">`);
  html = html.replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${escapeAttr(description)}">`);
  html = html.replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${pageUrl}">`);
  html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${pageUrl}">`);

  /* Add noscript fallback with post links */
  const postLinks = posts
    .map(
      (p) =>
        `<li><a href="/blog/${p.slug}">${escapeHtml(p.title)}</a> — ${p.date}</li>`
    )
    .join('\n          ');

  const seoContent = `
    <noscript>
      <div style="max-width:760px;margin:0 auto;padding:4rem 2rem;">
        <h1>Blog</h1>
        <ul>${postLinks}</ul>
      </div>
    </noscript>`;

  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"></div>${seoContent}`
  );

  return html;
}

/* ── Helpers ── */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  return str.replace(/"/g, '&quot;').replace(/&/g, '&amp;');
}

/* ── Main ── */
async function main() {
  const data = await loadPostsData();
  const { posts } = data;

  const templatePath = path.join(DIST, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('dist/index.html not found. Run vite build first.');
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(templatePath, 'utf-8');

  /* Generate blog listing page */
  const blogDir = path.join(DIST, 'blog');
  fs.mkdirSync(blogDir, { recursive: true });
  const blogListHtml = generateBlogListPage(posts, templateHtml);
  fs.writeFileSync(path.join(blogDir, 'index.html'), blogListHtml, 'utf-8');
  console.log(`[seo] Generated /blog/index.html`);

  /* Generate individual post pages */
  for (const post of posts) {
    const postDir = path.join(blogDir, post.slug);
    fs.mkdirSync(postDir, { recursive: true });

    const postHtml = generatePostPage(post, templateHtml);
    fs.writeFileSync(path.join(postDir, 'index.html'), postHtml, 'utf-8');
    console.log(`[seo] Generated /blog/${post.slug}/index.html`);
  }

  /* Copy index.html as 404.html for SPA fallback on GitHub Pages */
  fs.copyFileSync(templatePath, path.join(DIST, '404.html'));
  console.log(`[seo] Generated 404.html (SPA fallback)`);

  console.log(`[seo] Done! ${posts.length} post pages + blog listing + 404 fallback`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
