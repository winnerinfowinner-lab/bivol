import matter from 'gray-matter';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ArticleManifestItem {
  slug: string;
  title: string;
  metaDescription: string;
  publishDate: string;
  category: string;
  lang: string;
  route: string;
}

export interface ContentManifest {
  generatedAt: string;
  totalArticles: number;
  articles: ArticleManifestItem[];
}

export interface ParsedArticle {
  frontmatter: {
    title: string;
    metaDescription: string;
    slug: string;
    category: string;
    tags?: string[];
    targetKeyword?: string;
    author?: string;
    publishDate?: string;
    lastmod?: string;
    wordCount?: number;
    readingTime?: number;
    ogImage?: string;
    coverImage?: string;
    imageAlt?: string;
    dynamicFAQs?: FAQItem[];
    schemaType?: string;
    redirects?: string[];
    canonicalUrl?: string;
    relatedPosts?: any[];
    jsonLdSchema?: any;
  };
  contentHtml: string;
  rawBody: string;
}

/**
 * Safely parses raw markdown text containing YAML frontmatter.
 * Provides fallback parsing if gray-matter hits browser environment constraints.
 */
export function parseArticleMarkdown(rawMarkdown: string, fallbackMeta?: Partial<ArticleManifestItem>): ParsedArticle {
  let data: any = {};
  let body = rawMarkdown;

  try {
    const parsed = matter(rawMarkdown);
    data = parsed.data || {};
    body = parsed.content || rawMarkdown;
  } catch (e) {
    // Fallback frontmatter parser for browser compatibility
    const match = rawMarkdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (match) {
      const yamlText = match[1];
      body = match[2];

      // Extract basic string fields
      const extractField = (key: string) => {
        const fieldMatch = yamlText.match(new RegExp(`^${key}:\\s*["']?([^"'\r\n]+)["']?`, 'm'));
        return fieldMatch ? fieldMatch[1].trim() : undefined;
      };

      data.title = extractField('title');
      data.metaDescription = extractField('metaDescription');
      data.slug = extractField('slug');
      data.category = extractField('category');
      data.author = extractField('author');
      data.publishDate = extractField('publishDate');
      data.targetKeyword = extractField('targetKeyword');
      data.coverImage = extractField('coverImage');
      data.imageAlt = extractField('imageAlt');
    }
  }

  // Compute word count and reading time
  const cleanText = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/#+\s+/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~`]/g, '')
    .trim();
  const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Merge with fallback meta if present
  const frontmatter = {
    title: data.title || fallbackMeta?.title || 'Untitled Guide',
    metaDescription: data.metaDescription || fallbackMeta?.metaDescription || '',
    slug: data.slug || fallbackMeta?.slug || '',
    category: data.category || fallbackMeta?.category || 'guides',
    tags: Array.isArray(data.tags) ? data.tags : [],
    targetKeyword: data.targetKeyword || '',
    author: data.author || 'Bivol Engineering Team',
    publishDate: data.publishDate || fallbackMeta?.publishDate || new Date().toISOString().split('T')[0],
    lastmod: data.lastmod || data.publishDate || fallbackMeta?.publishDate,
    coverImage: data.coverImage || '',
    imageAlt: data.imageAlt || data.title || '',
    dynamicFAQs: Array.isArray(data.dynamicFAQs) ? data.dynamicFAQs : [],
    schemaType: data.schemaType || 'TechArticle',
    redirects: Array.isArray(data.redirects) ? data.redirects : [],
    canonicalUrl: data.canonicalUrl || '',
    relatedPosts: Array.isArray(data.relatedPosts) ? data.relatedPosts : [],
    wordCount,
    readingTime,
  };

  // Convert markdown body to HTML
  const contentHtml = renderMarkdownToHtml(body);

  return {
    frontmatter,
    contentHtml,
    rawBody: body,
  };
}

/**
 * Lightweight, robust Markdown to HTML converter.
 */
export function renderMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';

  let html = markdown;

  // 1. Code blocks with language syntax highlighting wrapper
  html = html.replace(/```([a-z0-9_-]*)\r?\n([\s\S]*?)```/g, (_, lang, code) => {
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<div class="my-6 rounded-xl border border-white/10 bg-black/80 overflow-hidden font-mono text-xs">
      <div class="px-4 py-2 bg-white/5 border-b border-white/10 text-gold uppercase tracking-widest text-[10px] font-bold flex justify-between items-center">
        <span>${lang || 'code'}</span>
        <span class="text-white/40">Bivol Snippet</span>
      </div>
      <pre class="p-4 overflow-x-auto text-white/90 leading-relaxed font-mono"><code>${escapedCode}</code></pre>
    </div>`;
  });

  // 2. Tables
  html = html.replace(/\n\|(.+)\|\r?\n\|[-| :]+\|\r?\n((?:\|.+\|\r?\n?)+)/g, (_, header, body) => {
    const headers = header.split('|').filter((h: string) => h.trim() !== '');
    const rows = body.trim().split('\n').map((row: string) => 
      row.split('|').filter((c: string) => c.trim() !== '')
    );

    const thead = `<thead class="bg-white/5 border-b border-white/10 text-gold font-serif"><tr>${headers.map((h: string) => `<th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">${h.trim()}</th>`).join('')}</tr></thead>`;
    const tbody = `<tbody>${rows.map((row: string[]) => `<tr class="border-b border-white/5 hover:bg-white/[0.02]">${row.map((c: string) => `<td class="px-4 py-3 text-sm text-white/80">${c.trim()}</td>`).join('')}</tr>`).join('')}</tbody>`;

    return `<div class="my-6 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.01]"><table class="w-full text-left border-collapse">${thead}${tbody}</table></div>`;
  });

  // 3. Headings with auto IDs for Table of Contents
  html = html.replace(/^### (.*$)/gim, (_, text) => {
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `<h3 id="${id}" class="text-xl md:text-2xl font-serif font-bold text-white mt-8 mb-4 tracking-tight">${text}</h3>`;
  });
  html = html.replace(/^## (.*$)/gim, (_, text) => {
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `<h2 id="${id}" class="text-2xl md:text-3xl font-serif font-bold text-gold mt-12 mb-6 tracking-tight border-b border-white/10 pb-3">${text}</h2>`;
  });
  html = html.replace(/^# (.*$)/gim, (_, text) => {
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `<h1 id="${id}" class="text-3xl md:text-5xl font-serif font-bold text-white mt-10 mb-6 tracking-tight">${text}</h1>`;
  });

  // 4. Blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-2 border-gold pl-4 py-1 my-4 italic text-white/70 bg-gold/5 rounded-r-lg">$1</blockquote>');

  // 5. Lists (unordered)
  html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li class="ml-4 list-disc text-white/80 my-1">$1</li>');

  // 6. Inline styles
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-white/90">$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-white/10 text-gold font-mono text-xs">$1</code>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-gold hover:underline font-medium">$1</a>');

  // 7. Paragraphs - split by double line breaks
  const paragraphs = html.split(/\n\s*\n/);
  html = paragraphs
    .map(p => {
      const trimmed = p.trim();
      if (!trimmed) return '';
      if (
        trimmed.startsWith('<h') ||
        trimmed.startsWith('<div') ||
        trimmed.startsWith('<blockquote') ||
        trimmed.startsWith('<table') ||
        trimmed.startsWith('<li')
      ) {
        return trimmed;
      }
      return `<p class="my-4 text-white/80 leading-relaxed">${trimmed}</p>`;
    })
    .join('\n');

  return html;
}
