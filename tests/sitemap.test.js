import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { generateSitemapXml, collectSitemapUrls } from '../scripts/generate-sitemap.js';

describe('Unified Sitemap Architecture', () => {
  const publicDir = path.resolve(process.cwd(), 'public');
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  const robotsPath = path.join(publicDir, 'robots.txt');

  it('should collect valid URLs from content source of truth and static routes', () => {
    const urls = collectSitemapUrls();
    expect(Array.isArray(urls)).toBe(true);
    expect(urls.length).toBeGreaterThanOrEqual(25);

    // Verify all URLs are absolute https://bivol.xyz URLs
    for (const item of urls) {
      expect(item.loc).toMatch(/^https:\/\/bivol\.xyz\//);
      expect(item.loc).not.toContain('#');
      expect(item.loc).not.toContain('localhost');
      expect(item.loc).not.toContain('//en'); // no double slashes
    }

    // Verify core static pages are included
    const locs = urls.map((u) => u.loc);
    expect(locs).toContain('https://bivol.xyz/');
    expect(locs).toContain('https://bivol.xyz/articles');
    expect(locs).toContain('https://bivol.xyz/faq');
    expect(locs).toContain('https://bivol.xyz/email-verification-guide');
    expect(locs).toContain('https://bivol.xyz/catch-all-email-guide');
    expect(locs).toContain('https://bivol.xyz/bivol-vs-automated-tools');
    expect(locs).toContain('https://bivol.xyz/privacy');
    expect(locs).toContain('https://bivol.xyz/terms');
    expect(locs).toContain('https://bivol.xyz/disclaimer');

    // Verify article URLs from content directory are included
    expect(locs).toContain('https://bivol.xyz/en/email-verification/spam-trap-email-detector-software');
    expect(locs).toContain('https://bivol.xyz/en/email-verification/verify-email-address-without-sending-email');
    expect(locs).toContain('https://bivol.xyz/en/email-verification/high-volume-email-verifier-for-enterprise');
    expect(locs).toContain('https://bivol.xyz/en/email-verification/shopify-guide');
  });

  it('should generate valid sitemap.xml with XML header and urlset', () => {
    const result = generateSitemapXml();
    expect(result.count).toBeGreaterThanOrEqual(25);
    expect(fs.existsSync(sitemapPath)).toBe(true);

    const content = fs.readFileSync(sitemapPath, 'utf-8');
    expect(content.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(content).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(content).toContain('</urlset>');
  });

  it('should ensure robots.txt references the sitemap and does not block crawlers', () => {
    expect(fs.existsSync(robotsPath)).toBe(true);
    const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
    expect(robotsContent).toContain('User-agent: *');
    expect(robotsContent).toContain('Allow: /');
    expect(robotsContent).toContain('Sitemap: https://bivol.xyz/sitemap.xml');
  });
});
