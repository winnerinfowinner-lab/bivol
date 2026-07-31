import React, { useState } from 'react';
import { 
  ChevronRight, 
  Clock, 
  User, 
  Calendar, 
  BookOpen, 
  HelpCircle, 
  Tag, 
  ArrowRight,
  ChevronDown,
  List
} from 'lucide-react';
import { Link } from 'react-router-dom';

export interface RelatedPost {
  slug: string;
  title: string;
  category: string;
  lang: string;
  score: number;
  path: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FrontmatterSchema {
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
  relatedPosts?: RelatedPost[];
  jsonLdSchema?: any;
}

interface ArticleTemplateProps {
  frontmatter: FrontmatterSchema;
  content: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export const ArticleTemplate: React.FC<ArticleTemplateProps> = ({ frontmatter, content }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Extract Table of Contents headings (H2 and H3) from raw content/HTML
  const headings: TocItem[] = React.useMemo(() => {
    const items: TocItem[] = [];
    const regex = /<h([23])(?:\s+id="([^"]+)")?[^>]*>(.*?)<\/h[23]>/gi;
    let match;
    let index = 0;
    
    // Also try matching markdown headers if raw markdown is passed
    const mdRegex = /^(#{2,3})\s+(.+)$/gm;
    if (content.includes('#')) {
      while ((match = mdRegex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        items.push({ id: id || `heading-${index++}`, text, level });
      }
    } else {
      while ((match = regex.exec(content)) !== null) {
        const level = parseInt(match[1], 10);
        const id = match[2] || match[3].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const text = match[3].replace(/<[^>]+>/g, '').trim();
        items.push({ id: id || `heading-${index++}`, text, level });
      }
    }
    return items;
  }, [content]);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-gold selection:text-black">
      {/* Inject Dynamic JSON-LD Structured Data */}
      {frontmatter.jsonLdSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(frontmatter.jsonLdSchema) }}
        />
      )}

      {/* Main Container */}
      <main className="pt-24 pb-20 px-6 max-w-5xl mx-auto">
        {/* Dynamic Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center flex-wrap gap-2 text-xs font-mono text-white/50">
            <li>
              <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-white/30" />
              <span className="capitalize text-white/70">{frontmatter.category || 'Guides'}</span>
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-white/30" />
              <span className="text-gold truncate max-w-[200px] sm:max-w-[400px]">{frontmatter.title}</span>
            </li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="border-b border-white/10 pb-10 mb-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-mono uppercase tracking-widest">
            <Tag className="w-3.5 h-3.5" />
            {frontmatter.category}
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
            {frontmatter.title}
          </h1>

          {frontmatter.metaDescription && (
            <p className="text-lg md:text-xl text-white/70 leading-relaxed font-sans max-w-3xl">
              {frontmatter.metaDescription}
            </p>
          )}

          {/* Metadata Meta Bar */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-white/50 font-mono pt-4 border-t border-white/5">
            {frontmatter.author && (
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-gold" />
                <span>By {frontmatter.author}</span>
              </div>
            )}
            {frontmatter.publishDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gold" />
                <time dateTime={frontmatter.publishDate}>{frontmatter.publishDate}</time>
              </div>
            )}
            {frontmatter.readingTime && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gold" />
                <span>{frontmatter.readingTime} min read</span>
              </div>
            )}
            {frontmatter.wordCount && (
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-gold" />
                <span>{frontmatter.wordCount} words</span>
              </div>
            )}
          </div>
        </header>

        {/* Cover Image */}
        {frontmatter.coverImage && (
          <div className="mb-12 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
            <img
              src={frontmatter.coverImage}
              alt={frontmatter.imageAlt || frontmatter.title}
              className="w-full h-auto max-h-[480px] object-cover"
              loading="eager"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-12">
            {/* Table of Contents for Mobile / Compact */}
            {headings.length > 0 && (
              <div className="lg:hidden p-6 bg-white/[0.02] border border-white/10 rounded-xl space-y-4">
                <h2 className="text-sm font-serif font-bold text-gold uppercase tracking-wider flex items-center gap-2">
                  <List className="w-4 h-4" />
                  Table of Contents
                </h2>
                <ul className="space-y-2 text-sm text-white/70">
                  {headings.map((item, idx) => (
                    <li key={idx} style={{ paddingLeft: `${(item.level - 2) * 12}px` }}>
                      <a href={`#${item.id}`} className="hover:text-gold transition-colors">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Article Body Container */}
            <div 
              className="prose prose-invert max-w-none text-white/80 leading-relaxed text-[16px] space-y-6"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Tags Badges */}
            {frontmatter.tags && frontmatter.tags.length > 0 && (
              <div className="pt-8 border-t border-white/10">
                <h3 className="text-xs font-mono uppercase text-white/40 mb-3 tracking-widest">Article Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {frontmatter.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white/[0.04] border border-white/10 rounded-full text-xs text-white/70 font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic FAQs Accordion */}
            {frontmatter.dynamicFAQs && frontmatter.dynamicFAQs.length > 0 && (
              <section className="pt-10 border-t border-white/10 space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <HelpCircle className="w-6 h-6 text-gold shrink-0" />
                  <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
                    Frequently Asked Questions
                  </h2>
                </div>

                <div className="space-y-3">
                  {frontmatter.dynamicFAQs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="border border-white/10 rounded-xl bg-white/[0.01] overflow-hidden transition-colors"
                      >
                        <button
                          onClick={() => toggleFaq(idx)}
                          className="w-full text-left px-6 py-4 font-serif font-semibold text-white flex items-center justify-between gap-4 hover:text-gold transition-colors"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-gold shrink-0 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-5 pt-1 text-white/70 text-sm leading-relaxed border-t border-white/5 bg-white/[0.01]">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Column */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Desktop Table of Contents Sticky Box */}
            {headings.length > 0 && (
              <div className="hidden lg:block sticky top-28 p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4 shadow-xl">
                <h2 className="text-xs font-serif font-bold text-gold uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-3">
                  <List className="w-4 h-4 text-gold" />
                  Table of Contents
                </h2>
                <ul className="space-y-2 text-xs font-mono text-white/60">
                  {headings.map((item, idx) => (
                    <li key={idx} style={{ paddingLeft: `${(item.level - 2) * 10}px` }}>
                      <a href={`#${item.id}`} className="hover:text-gold transition-colors block py-0.5 truncate">
                        • {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pre-Scored Related Articles */}
            {frontmatter.relatedPosts && frontmatter.relatedPosts.length > 0 && (
              <div className="p-6 bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl space-y-5 shadow-xl">
                <h2 className="text-xs font-serif font-bold text-gold uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-3">
                  <ArrowRight className="w-4 h-4 text-gold" />
                  Related Architecture Guides
                </h2>

                <div className="space-y-4">
                  {frontmatter.relatedPosts.map((related, idx) => (
                    <div
                      key={idx}
                      className="group p-3 rounded-lg border border-white/5 hover:border-gold/30 bg-white/[0.01] hover:bg-gold/[0.02] transition-all"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mb-1">
                        <span className="uppercase text-gold">{related.category}</span>
                        <span className="px-1.5 py-0.5 rounded bg-gold/10 text-gold font-bold">
                          +{related.score} pts
                        </span>
                      </div>
                      <Link
                        to={`/${related.lang}/${related.category}/${related.slug}`}
                        className="font-serif font-bold text-sm text-white group-hover:text-gold transition-colors line-clamp-2"
                      >
                        {related.title}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ArticleTemplate;
