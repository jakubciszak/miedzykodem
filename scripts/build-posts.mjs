import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'posts');
const OUTPUT_FILE = path.join(ROOT, 'src', 'generated', 'posts-data.js');

/* ── Configure marked with highlight.js ── */
const markedInstance = new Marked(
  { gfm: true, breaks: false },
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    },
  })
);

/* Custom renderer for code blocks with language labels.
   `text` is already highlighted by markedHighlight – do NOT re-highlight. */
const renderer = {
  code({ text, lang }) {
    const language = lang || '';
    const label = language
      ? `<span class="code-lang-label">${language}</span>`
      : '';
    return `<pre>${label}<code class="hljs language-${language || 'auto'}">${text}</code></pre>`;
  },
};

markedInstance.use({ renderer });

/* ── Helpers ── */
function parseFilename(filename) {
  const name = filename.replace('.md', '');
  const dateStr = name.substring(0, 8);
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  const slug = name.substring(9);
  return {
    filename,
    slug,
    name,
    date: `${day}.${month}.${year}`,
    dateISO: `${year}-${month}-${day}`,
  };
}

function parseTags(raw) {
  if (!raw) return [];
  return raw.match(/"([^"]+)"/g)?.map((t) => t.replace(/"/g, '')) || [];
}

function parseMdContent(md) {
  const lines = md.split('\n');
  let title = '';
  let tagsRaw = '';
  let bodyStart = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!title && line.startsWith('# ')) {
      title = line.replace(/^#\s+/, '');
      bodyStart = i + 1;
      continue;
    }
    if (title && line.toLowerCase().startsWith('tagi:')) {
      tagsRaw = line.substring(5).trim();
      bodyStart = i + 1;
      break;
    }
    if (title && line !== '') break;
  }

  while (bodyStart < lines.length && lines[bodyStart].trim() === '') bodyStart++;

  const body = lines.slice(bodyStart).join('\n');
  return { title, tags: parseTags(tagsRaw), body };
}

function getExcerpt(body, maxLen = 200) {
  const plain = body.replace(/[#*`\[\]()>_~]/g, '').trim();
  const firstParagraph = plain.split('\n\n')[0].replace(/\n/g, ' ');
  return firstParagraph.length > maxLen
    ? firstParagraph.substring(0, maxLen) + '...'
    : firstParagraph;
}

/* ── Main ── */
function buildPosts() {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
  const allTags = new Set();
  const posts = [];

  for (const filename of files) {
    const filePath = path.join(POSTS_DIR, filename);
    const md = fs.readFileSync(filePath, 'utf-8');
    const meta = parseFilename(filename);
    const parsed = parseMdContent(md);
    const htmlContent = markedInstance.parse(parsed.body);
    const excerpt = getExcerpt(parsed.body);

    parsed.tags.forEach((t) => allTags.add(t));

    posts.push({
      slug: meta.slug,
      name: meta.name,
      filename: meta.filename,
      date: meta.date,
      dateISO: meta.dateISO,
      title: parsed.title,
      tags: parsed.tags,
      excerpt,
      htmlContent,
      /* SEO fields */
      description: excerpt,
    });
  }

  /* Sort by name descending (newest first) */
  posts.sort((a, b) => b.name.localeCompare(a.name));

  const output = {
    posts,
    allTags: Array.from(allTags).sort(),
  };

  /* Ensure output directory exists */
  const outDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  /* Write as ES module */
  const content = `// Auto-generated at build time. Do not edit.\nexport default ${JSON.stringify(output, null, 2)};\n`;
  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');
  console.log(`[build-posts] Generated ${posts.length} posts, ${allTags.size} tags → ${OUTPUT_FILE}`);
}

buildPosts();
