import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import matter from 'gray-matter';
import { globSync } from 'glob';
import { generateSitemapXml } from './generate-sitemap.js';

const SITE_URL = 'https://bivol.xyz';
const SITE_NAME = 'Bivol';
const CONTENT_DIR = path.resolve(process.cwd(), 'content');
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const CACHE_DIR = path.resolve(process.cwd(), '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'build-index.json');

// Ensure required output directories exist
[PUBLIC_DIR, CACHE_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Calculates SHA-256 hash of a file's content for cache invalidation.
 */
function getFileHash(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Computes word count from raw markdown body.
 */
function computeWordCount(body) {
  if (!body) return 0;
  const cleanText = body
    .replace(/```[\s\S]*?```/g, '') // remove code blocks
    .replace(/#+\s+/g, '') // remove headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // remove links
    .replace(/[*_~`]/g, ''); // remove formatting
  const words = cleanText.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

/**
 * Computes estimated reading time in minutes (200 words per minute baseline).
 */
function computeReadingTime(wordCount) {
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Generates an excerpt from body if metaDescription is missing.
 */
function computeExcerpt(body, metaDescription) {
  if (metaDescription) return metaDescription;
  const cleanText = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/#+\s+/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~`]/g, '')
    .trim();
  return cleanText.slice(0, 160) + (cleanText.length > 160 ? '...' : '');
}

/**
 * Generates JSON-LD Structured Data array for an article.
 */
function generateJsonLdSchema(article) {
  const articleUrl = `${SITE_URL}/${article.lang}/${article.category}/${article.slug}`;
  const schemaList = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: article.category, item: `${SITE_URL}/${article.lang}/${article.category}` },
        { '@type': 'ListItem', position: 3, name: article.title, item: articleUrl }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': article.schemaType || 'TechArticle',
      headline: article.title,
      description: article.metaDescription,
      inLanguage: article.lang,
      mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
      author: { '@type': 'Organization', name: article.author || SITE_NAME },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` }
      },
      datePublished: article.publishDate,
      dateModified: article.lastmod,
      image: article.coverImage || article.ogImage || `${SITE_URL}/og-default.jpg`
    }
  ];

  if (Array.isArray(article.dynamicFAQs) && article.dynamicFAQs.length > 0) {
    schemaList.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: article.dynamicFAQs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    });
  }

  return schemaList;
}

/**
 * Calculates weighted internal link scores between articles.
 * +50 Category match, +20 per Tag match, +15 Target Keyword match, +5 Author match.
 */
function computeRelatedPosts(articles) {
  for (const article of articles) {
    const scores = [];

    for (const target of articles) {
      if (article.slug === target.slug && article.lang === target.lang) continue;
      if (article.lang !== target.lang) continue; // Keep internal recommendations within same language

      let score = 0;

      // Category match (+50)
      if (article.category && article.category === target.category) {
        score += 50;
      }

      // Tag match (+20 per tag)
      if (Array.isArray(article.tags) && Array.isArray(target.tags)) {
        const commonTags = article.tags.filter((t) => target.tags.includes(t));
        score += commonTags.length * 20;
      }

      // Target Keyword match in title/description (+15)
      if (article.targetKeyword) {
        const kw = article.targetKeyword.toLowerCase();
        if (
          target.title.toLowerCase().includes(kw) ||
          target.metaDescription.toLowerCase().includes(kw)
        ) {
          score += 15;
        }
      }

      // Author match (+5)
      if (article.author && article.author === target.author) {
        score += 5;
      }

      if (score > 0) {
        scores.push({
          slug: target.slug,
          title: target.title,
          category: target.category,
          lang: target.lang,
          score,
          path: target.path
        });
      }
    }

    // Sort descending by score and pick top 5
    scores.sort((a, b) => b.score - a.score);
    article.relatedPosts = scores.slice(0, 5);
  }
}

/**
 * Generates public/sitemap.xml using the unified sitemap engine
 */
function generateSitemap() {
  generateSitemapXml();
}

/**
 * Generates public/rss.xml
 */
function generateRssFeed(articles) {
  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  let rss = '<?xml version="1.0" encoding="UTF-8" ?>\n';
  rss += '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n';
  rss += '<channel>\n';
  rss += `  <title>Bivol Technical Guides & Email Deliverability</title>\n`;
  rss += `  <link>${SITE_URL}</link>\n`;
  rss += `  <description>In-depth engineering documentation on SMTP, DNS authentication, and validation frameworks.</description>\n`;
  rss += `  <language>en-us</language>\n`;
  rss += `  <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />\n`;

  for (const article of sortedArticles) {
    const link = `${SITE_URL}/${article.lang}/${article.category}/${article.slug}`;
    const pubDate = new Date(article.publishDate).toUTCString();
    rss += '  <item>\n';
    rss += `    <title><![CDATA[${article.title}]]></title>\n`;
    rss += `    <link>${link}</link>\n`;
    rss += `    <guid isPermaLink="true">${link}</guid>\n`;
    rss += `    <pubDate>${pubDate}</pubDate>\n`;
    rss += `    <description><![CDATA[${article.metaDescription}]]></description>\n`;
    rss += '  </item>\n';
  }

  rss += '</channel>\n</rss>';
  fs.writeFileSync(path.join(PUBLIC_DIR, 'rss.xml'), rss, 'utf-8');
}

/**
 * Generates public/robots.txt
 */
function generateRobotsTxt() {
  const content = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), content, 'utf-8');
}

/**
 * Generates public/llms.txt for AI crawlers (Perplexity, ChatGPT, Claude)
 */
function generateLlmsTxt(articles) {
  let content = `# ${SITE_NAME} Technical Engineering & Email Architecture Documentation\n\n`;
  content += `> High-performance technical articles and guides on email deliverability, DNS security (SPF, DKIM, DMARC), and programmatic verification infrastructure.\n\n`;

  content += `## Technical Knowledge Index\n\n`;
  for (const article of articles) {
    const url = `${SITE_URL}/${article.lang}/${article.category}/${article.slug}`;
    content += `### [${article.title}](${url})\n`;
    content += `- **Category:** ${article.category}\n`;
    content += `- **Summary:** ${article.metaDescription}\n`;
    content += `- **Target Keyword:** ${article.targetKeyword}\n`;
    content += `- **Published:** ${article.publishDate}\n\n`;
  }

  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), content, 'utf-8');
}

/**
 * Generates public/_redirects for Cloudflare Pages
 */
function generateRedirects(articles) {
  const redirectLines = [];

  for (const article of articles) {
    const targetUrl = `/${article.lang}/${article.category}/${article.slug}`;
    if (Array.isArray(article.redirects)) {
      for (const oldPath of article.redirects) {
        if (oldPath && oldPath !== targetUrl) {
          redirectLines.push(`${oldPath} ${targetUrl} 301`);
        }
      }
    }
  }

  fs.writeFileSync(path.join(PUBLIC_DIR, '_redirects'), redirectLines.join('\n') + '\n', 'utf-8');
}

/**
 * Main build engine execution logic
 */
export function buildSEOEngine() {
  console.log('🚀 [SEO Build Engine] Starting scanning and metadata build...');

  // Load existing build cache if available
  let cache = {};
  if (fs.existsSync(CACHE_FILE)) {
    try {
      cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    } catch {
      cache = {};
    }
  }

  const updatedCache = {};
  const articles = [];
  const categoryStats = {};
  const tagStats = {};

  // Find all .md files in content directory recursively
  const mdFiles = globSync('**/*.md', { cwd: CONTENT_DIR });
  console.log(`📁 Found ${mdFiles.length} markdown source file(s) in /content`);

  for (const relativePath of mdFiles) {
    const fullPath = path.join(CONTENT_DIR, relativePath);
    const stats = fs.statSync(fullPath);
    const fileHash = getFileHash(fullPath);
    const mtimeIso = stats.mtime.toISOString();

    let articleData;

    // Check if cache entry is still valid
    if (cache[relativePath] && cache[relativePath].hash === fileHash) {
      articleData = cache[relativePath].data;
    } else {
      // Parse Markdown and extract Frontmatter
      const rawContent = fs.readFileSync(fullPath, 'utf-8');
      const { data: frontmatter, content: body } = matter(rawContent);

      // Extract route info from relative path: /content/[lang]/[category]/...
      const pathSegments = relativePath.split(path.sep);
      const lang = pathSegments[0] || 'en';
      const categoryFromPath = pathSegments[1] || 'uncategorized';
      const subcategoryFromPath = pathSegments.length > 3 ? pathSegments[2] : null;

      const wordCount = computeWordCount(body);
      const readingTime = computeReadingTime(wordCount);
      const excerpt = computeExcerpt(body, frontmatter.metaDescription);
      const slug = frontmatter.slug || path.basename(relativePath, '.md');

      articleData = {
        path: `/content/${relativePath.replace(/\\/g, '/')}`,
        lang: frontmatter.lang || lang,
        category: frontmatter.category || categoryFromPath,
        subcategory: subcategoryFromPath,
        slug,
        title: frontmatter.title || 'Untitled Article',
        metaDescription: frontmatter.metaDescription || excerpt,
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        targetKeyword: frontmatter.targetKeyword || '',
        author: frontmatter.author || 'Anonymous',
        publishDate: frontmatter.publishDate || mtimeIso.split('T')[0],
        lastmod: mtimeIso,
        wordCount,
        readingTime,
        excerpt,
        ogImage: frontmatter.ogImage || '',
        coverImage: frontmatter.coverImage || '',
        imageAlt: frontmatter.imageAlt || '',
        dynamicFAQs: Array.isArray(frontmatter.dynamicFAQs) ? frontmatter.dynamicFAQs : [],
        schemaType: frontmatter.schemaType || 'TechArticle',
        redirects: Array.isArray(frontmatter.redirects) ? frontmatter.redirects : [],
        canonicalUrl: `${SITE_URL}/${frontmatter.lang || lang}/${frontmatter.category || categoryFromPath}/${slug}`,
        ogTags: {
          'og:title': frontmatter.title || 'Untitled Article',
          'og:description': frontmatter.metaDescription || excerpt,
          'og:type': 'article',
          'og:url': `${SITE_URL}/${frontmatter.lang || lang}/${frontmatter.category || categoryFromPath}/${slug}`,
          'og:image': frontmatter.ogImage || `${SITE_URL}/og-default.jpg`,
          'twitter:card': 'summary_large_image',
          'twitter:title': frontmatter.title || 'Untitled Article',
          'twitter:description': frontmatter.metaDescription || excerpt
        }
      };

      // Generate structured JSON-LD schema
      articleData.jsonLdSchema = generateJsonLdSchema(articleData);
    }

    // Save to updated cache
    updatedCache[relativePath] = {
      hash: fileHash,
      mtime: mtimeIso,
      data: articleData,
    };

    articles.push(articleData);

    // Aggregate category metrics
    const cat = articleData.category;
    if (!categoryStats[cat]) {
      categoryStats[cat] = { name: cat, count: 0, posts: [] };
    }
    categoryStats[cat].count += 1;
    categoryStats[cat].posts.push(articleData.slug);

    // Aggregate tag metrics
    for (const tag of articleData.tags) {
      if (!tagStats[tag]) {
        tagStats[tag] = { name: tag, count: 0, posts: [] };
      }
      tagStats[tag].count += 1;
      tagStats[tag].posts.push(articleData.slug);
    }
  }

  // Compute weighted internal link scoring across all articles
  computeRelatedPosts(articles);

  // Re-update cache with relatedPosts
  for (const relativePath of mdFiles) {
    const article = articles.find(
      (a) => a.path === `/content/${relativePath.replace(/\\/g, '/')}`
    );
    if (article && updatedCache[relativePath]) {
      updatedCache[relativePath].data = article;
    }
  }

  // Write updated cache to disk
  fs.writeFileSync(CACHE_FILE, JSON.stringify(updatedCache, null, 2), 'utf-8');

  // 1. Generate Global Manifest: public/content-manifest.json
  const manifestArticles = articles.map((article) => ({
    slug: article.slug,
    title: article.title,
    metaDescription: article.metaDescription,
    publishDate: article.publishDate,
    category: article.category,
    lang: article.lang,
    route: `/${article.lang}/${article.category}/${article.slug}`,
  }));

  const manifest = {
    generatedAt: new Date().toISOString(),
    totalArticles: articles.length,
    articles: manifestArticles,
  };
  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'content-manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf-8'
  );

  // 2. Generate Category Index: public/categories.json
  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'categories.json'),
    JSON.stringify(categoryStats, null, 2),
    'utf-8'
  );

  // 3. Generate Tag Index: public/tags.json
  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'tags.json'),
    JSON.stringify(tagStats, null, 2),
    'utf-8'
  );

  // 4. Generate pre-built SEO artifacts
  generateSitemap();
  generateRssFeed(articles);
  generateRobotsTxt();
  generateLlmsTxt(articles);
  generateRedirects(articles);

  console.log(`✅ [SEO Build Engine] Successfully compiled manifest and SEO artifacts for ${articles.length} article(s).`);
  console.log(`📦 Artifacts output to:
  - public/content-manifest.json
  - public/categories.json
  - public/tags.json
  - public/sitemap.xml
  - public/rss.xml
  - public/robots.txt
  - public/llms.txt
  - public/_redirects
  - .cache/build-index.json`);

  return { manifest, categoryStats, tagStats };
}

// Auto-run when executed directly via Node CLI
if (process.argv[1] && process.argv[1].endsWith('build-seo.js')) {
  buildSEOEngine();
}
