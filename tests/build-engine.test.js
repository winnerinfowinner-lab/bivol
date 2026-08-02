import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { buildSEOEngine } from '../scripts/build-seo.js';

describe('SEO Build Engine (Step 4)', () => {
  let result;
  const manifestPath = path.resolve(process.cwd(), 'public/content-manifest.json');
  const cachePath = path.resolve(process.cwd(), '.cache/build-index.json');
  const categoriesPath = path.resolve(process.cwd(), 'public/categories.json');
  const tagsPath = path.resolve(process.cwd(), 'public/tags.json');
  const sitemapPath = path.resolve(process.cwd(), 'public/sitemap.xml');
  const rssPath = path.resolve(process.cwd(), 'public/rss.xml');
  const robotsPath = path.resolve(process.cwd(), 'public/robots.txt');
  const llmsPath = path.resolve(process.cwd(), 'public/llms.txt');
  const redirectsPath = path.resolve(process.cwd(), 'public/_redirects');
  const promptPath = path.resolve(process.cwd(), 'prompts/batch-content-generator.md');
  const templatePath = path.resolve(process.cwd(), 'src/templates/ArticleTemplate.tsx');

  beforeAll(() => {
    // Run the build engine before tests
    result = buildSEOEngine();
  });

  it('should generate content-manifest.json and cache file', () => {
    expect(fs.existsSync(manifestPath)).toBe(true);
    expect(fs.existsSync(cachePath)).toBe(true);
    expect(fs.existsSync(categoriesPath)).toBe(true);
    expect(fs.existsSync(tagsPath)).toBe(true);
  });

  it('should generate lightweight content-manifest.json containing required fields and route', () => {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    expect(manifest.generatedAt).toBeDefined();
    expect(manifest.totalArticles).toBeGreaterThanOrEqual(2);
    expect(Array.isArray(manifest.articles)).toBe(true);

    const article = manifest.articles.find((a) => a.slug === 'shopify-guide');
    expect(article).toBeDefined();
    expect(article.title).toBe('How to Verify Shopify Customer Emails & Prevent Fake Orders in 2026');
    expect(article.category).toBe('email-verification');
    expect(article.lang).toBe('en');
    expect(article.route).toBe('/en/email-verification/shopify-guide');
    expect(article.metaDescription).toBeDefined();
    expect(article.publishDate).toBeDefined();

    // Verify unneeded fields are omitted from manifest
    expect(article.wordCount).toBeUndefined();
    expect(article.readingTime).toBeUndefined();
    expect(article.jsonLdSchema).toBeUndefined();
    expect(article.relatedPosts).toBeUndefined();
    expect(article.dynamicFAQs).toBeUndefined();
  });

  it('should compute dynamic metrics and metadata in build cache', () => {
    const cache = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
    const cacheEntries = Object.values(cache);
    const shopifyEntry = cacheEntries.find((e) => e.data && e.data.slug === 'shopify-guide');
    expect(shopifyEntry).toBeDefined();

    const article = shopifyEntry.data;
    expect(typeof article.wordCount).toBe('number');
    expect(article.wordCount).toBeGreaterThan(50);
    expect(typeof article.readingTime).toBe('number');
    expect(article.readingTime).toBeGreaterThanOrEqual(1);
    expect(article.lastmod).toBeDefined();
    expect(Array.isArray(article.relatedPosts)).toBe(true);
    expect(article.relatedPosts.length).toBeGreaterThan(0);
  });

  it('should generate valid sitemap.xml', () => {
    expect(fs.existsSync(sitemapPath)).toBe(true);
    const content = fs.readFileSync(sitemapPath, 'utf-8');
    expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(content).toContain('<urlset');
    expect(content).toContain('https://bivol.xyz/en/email-verification/shopify-guide');
    expect(content).toContain('https://bivol.xyz/en/email-verification/catch-all-guide');
  });

  it('should generate valid rss.xml', () => {
    expect(fs.existsSync(rssPath)).toBe(true);
    const content = fs.readFileSync(rssPath, 'utf-8');
    expect(content).toContain('<rss version="2.0"');
    expect(content).toContain('How to Verify Shopify Customer Emails');
  });

  it('should generate valid robots.txt', () => {
    expect(fs.existsSync(robotsPath)).toBe(true);
    const content = fs.readFileSync(robotsPath, 'utf-8');
    expect(content).toContain('User-agent: *');
    expect(content).toContain('Sitemap: https://bivol.xyz/sitemap.xml');
  });

  it('should generate valid llms.txt for AI crawlers', () => {
    expect(fs.existsSync(llmsPath)).toBe(true);
    const content = fs.readFileSync(llmsPath, 'utf-8');
    expect(content).toContain('Bivol Technical Engineering');
    expect(content).toContain('shopify-guide');
  });

  it('should generate valid _redirects for Cloudflare Pages', () => {
    expect(fs.existsSync(redirectsPath)).toBe(true);
    const content = fs.readFileSync(redirectsPath, 'utf-8');
    expect(content).toContain('/blog/shopify-verification-guide /en/email-verification/shopify-guide 301');
  });

  it('should verify Step 4 artifacts exist (prompt and ArticleTemplate)', () => {
    expect(fs.existsSync(promptPath)).toBe(true);
    expect(fs.existsSync(templatePath)).toBe(true);
    const promptContent = fs.readFileSync(promptPath, 'utf-8');
    expect(promptContent).toContain('Master Batch Content Generation Prompt');
    expect(promptContent).toContain('dynamicFAQs');
  });
});
