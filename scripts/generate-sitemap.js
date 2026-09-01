import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { globSync } from 'glob';

const SITE_URL = 'https://bivol.xyz';
const CONTENT_DIR = path.resolve(process.cwd(), 'content');
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const SITEMAP_FILE = path.join(PUBLIC_DIR, 'sitemap.xml');
const SITEMAP_MAX_URLS = 45000; // Protocol limit is 50,000, safe headroom

/**
 * Escapes XML special characters for safe XML output.
 */
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Normalizes and validates canonical URLs.
 * Ensures https://bivol.xyz, no double slashes, no # fragments, trims whitespace.
 */
function normalizeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;

  // Reject fragment, javascript, mailto, localhost/dev URLs
  const clean = rawUrl.trim();
  if (
    clean.includes('#') ||
    clean.startsWith('javascript:') ||
    clean.startsWith('mailto:') ||
    clean.includes('localhost') ||
    clean.includes('127.0.0.1') ||
    clean.includes('.run.app')
  ) {
    return null;
  }

  let fullUrl = clean;
  if (fullUrl.startsWith('/')) {
    fullUrl = `${SITE_URL}${fullUrl}`;
  } else if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
    fullUrl = `${SITE_URL}/${fullUrl}`;
  }

  // Force https://bivol.xyz
  fullUrl = fullUrl.replace(/^http:\/\/bivol\.xyz/i, 'https://bivol.xyz');

  try {
    const parsed = new URL(fullUrl);
    if (parsed.hostname !== 'bivol.xyz') {
      return null;
    }
    // Remove query params and hash
    parsed.search = '';
    parsed.hash = '';

    // Normalize path: collapse double slashes
    let pathname = parsed.pathname.replace(/\/+/g, '/');

    // Keep root as '/' and trim trailing slash from other routes
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }

    return `${parsed.protocol}//${parsed.host}${pathname}`;
  } catch {
    return null;
  }
}

/**
 * Parses and formats valid lastmod date string (YYYY-MM-DD or ISO 8601).
 * Returns null if no reliable date exists.
 */
function parseValidDate(dateInput) {
  if (!dateInput) return null;
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().split('T')[0];
  } catch {
    return null;
  }
}

/**
 * Discovers and builds all indexable URLs directly from the existing content and route sources of truth.
 */
export function collectSitemapUrls() {
  const urlMap = new Map();

  function addUrl(rawUrl, meta = {}) {
    const canonical = normalizeUrl(rawUrl);
    if (!canonical) return;

    // Avoid overwriting with empty lastmod if existing entry has a real lastmod
    if (urlMap.has(canonical)) {
      const existing = urlMap.get(canonical);
      if (!existing.lastmod && meta.lastmod) {
        existing.lastmod = meta.lastmod;
      }
      return;
    }

    urlMap.set(canonical, {
      loc: canonical,
      lastmod: parseValidDate(meta.lastmod),
      changefreq: meta.changefreq || null,
      priority: meta.priority || null,
    });
  }

  // 1. Core Public Application Static Pages (from App.tsx)
  addUrl('/', { priority: '1.0' });
  addUrl('/articles', { priority: '0.8' });
  addUrl('/faq', { priority: '0.6' });
  addUrl('/email-verification-guide', { priority: '0.7' });
  addUrl('/catch-all-email-guide', { priority: '0.7' });
  addUrl('/bivol-vs-automated-tools', { priority: '0.7' });
  addUrl('/privacy', { priority: '0.3' });
  addUrl('/terms', { priority: '0.3' });
  addUrl('/disclaimer', { priority: '0.3' });

  // 2. Discover Content Articles from Markdown Files (Single Source of Truth)
  const categoryStats = new Set();
  const tagStats = new Set();

  if (fs.existsSync(CONTENT_DIR)) {
    const mdFiles = globSync('**/*.md', { cwd: CONTENT_DIR });

    for (const relativePath of mdFiles) {
      const fullPath = path.join(CONTENT_DIR, relativePath);
      try {
        const fileContent = fs.readFileSync(fullPath, 'utf-8');
        const { data: frontmatter } = matter(fileContent);

        // Path segments: [lang, category, ...]
        const segments = relativePath.split(path.sep);
        const lang = frontmatter.lang || segments[0] || 'en';
        const category = frontmatter.category || segments[1] || 'email-verification';
        const slug = frontmatter.slug || path.basename(relativePath, '.md');

        if (category) categoryStats.add({ lang, category });

        if (Array.isArray(frontmatter.tags)) {
          frontmatter.tags.forEach((t) => tagStats.add(t));
        }

        // Determine real lastmod from git / file stats or frontmatter
        const fileStat = fs.statSync(fullPath);
        const fileMtime = fileStat.mtime.toISOString().split('T')[0];
        const lastmod = frontmatter.lastmod || frontmatter.publishDate || fileMtime;

        const articleRoute = `/${lang}/${category}/${slug}`;
        addUrl(articleRoute, {
          lastmod,
          priority: '0.9',
        });
      } catch (err) {
        console.warn(`[Sitemap] Warning: could not parse markdown file: ${relativePath}`, err);
      }
    }
  }

  // 3. Category Archive Pages
  for (const { lang, category } of categoryStats) {
    addUrl(`/${lang}/${category}`, { priority: '0.8' });
  }

  // 4. Tag Filter Pages (Preserving existing tag index URLs)
  for (const tag of tagStats) {
    addUrl(`/en/tag/${tag}`, { priority: '0.7' });
  }

  return Array.from(urlMap.values());
}

/**
 * Formats a single XML <url> block according to Sitemap Protocol 0.9.
 */
function formatUrlEntry(entry) {
  let xml = '  <url>\n';
  xml += `    <loc>${escapeXml(entry.loc)}</loc>\n`;
  if (entry.lastmod) {
    xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
  }
  if (entry.changefreq) {
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
  }
  if (entry.priority) {
    xml += `    <priority>${entry.priority}</priority>\n`;
  }
  xml += '  </url>\n';
  return xml;
}

/**
 * Builds standard urlset sitemap or sitemap index if URLs exceed SITEMAP_MAX_URLS.
 */
export function generateSitemapXml() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  const urls = collectSitemapUrls();
  console.log(`🗺️ [Sitemap Generator] Discovered ${urls.length} indexable URLs from content & routes.`);

  if (urls.length <= SITEMAP_MAX_URLS) {
    // Single standard sitemap
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    for (const u of urls) {
      xml += formatUrlEntry(u);
    }
    xml += '</urlset>\n';

    fs.writeFileSync(SITEMAP_FILE, xml, 'utf-8');
    console.log(`✅ [Sitemap Generator] Wrote ${urls.length} URLs to ${SITEMAP_FILE}`);
    return { type: 'urlset', count: urls.length, file: SITEMAP_FILE };
  } else {
    // Large-scale support: Sitemap Index architecture
    const chunks = [];
    for (let i = 0; i < urls.length; i += SITEMAP_MAX_URLS) {
      chunks.push(urls.slice(i, i + SITEMAP_MAX_URLS));
    }

    const today = new Date().toISOString().split('T')[0];
    let indexXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    indexXml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    chunks.forEach((chunk, idx) => {
      const partFilename = `sitemap-${idx + 1}.xml`;
      const partPath = path.join(PUBLIC_DIR, partFilename);

      let chunkXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      chunkXml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      for (const u of chunk) {
        chunkXml += formatUrlEntry(u);
      }
      chunkXml += '</urlset>\n';

      fs.writeFileSync(partPath, chunkXml, 'utf-8');

      indexXml += '  <sitemap>\n';
      indexXml += `    <loc>${SITE_URL}/${partFilename}</loc>\n`;
      indexXml += `    <lastmod>${today}</lastmod>\n`;
      indexXml += '  </sitemap>\n';
    });

    indexXml += '</sitemapindex>\n';
    fs.writeFileSync(SITEMAP_FILE, indexXml, 'utf-8');
    console.log(`✅ [Sitemap Generator] Wrote sitemapindex with ${chunks.length} parts to ${SITEMAP_FILE}`);
    return { type: 'sitemapindex', count: urls.length, parts: chunks.length, file: SITEMAP_FILE };
  }
}

// Auto-run if executed directly
if (process.argv[1] && process.argv[1].endsWith('generate-sitemap.js')) {
  generateSitemapXml();
}
