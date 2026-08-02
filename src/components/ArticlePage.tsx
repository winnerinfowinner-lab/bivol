import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, BookOpen, Tag, Calendar, ChevronRight } from 'lucide-react';
import ArticleTemplate from '../templates/ArticleTemplate';
import { 
  parseArticleMarkdown, 
  ContentManifest, 
  ArticleManifestItem 
} from '../lib/markdown';

// Vite glob import for all markdown files in /content
const markdownModules = import.meta.glob('/content/*/*/*.md', { query: '?raw', import: 'default' });

export const ArticlePage: React.FC = () => {
  const { lang = 'en', category = 'email-verification', slug = '' } = useParams<{
    lang: string;
    category: string;
    slug: string;
  }>();

  const [manifest, setManifest] = useState<ContentManifest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [articleData, setArticleData] = useState<{
    frontmatter: any;
    contentHtml: string;
  } | null>(null);

  // 1. Fetch lightweight content-manifest.json
  useEffect(() => {
    let isMounted = true;
    fetch('/content-manifest.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load content manifest');
        return res.json();
      })
      .then((data: ContentManifest) => {
        if (isMounted) setManifest(data);
      })
      .catch((err) => {
        console.warn('Could not load content manifest:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Load markdown content dynamically based on route params
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const targetKey = `/content/${lang}/${category}/${slug}.md`;
    const loader = markdownModules[targetKey];

    if (!loader) {
      // Try searching by slug alone if path mismatch
      const matchedKey = Object.keys(markdownModules).find((k) => k.endsWith(`/${slug}.md`));
      if (matchedKey) {
        loadMarkdownKey(matchedKey, isMounted);
      } else {
        if (isMounted) {
          setError(`Article not found: /${lang}/${category}/${slug}`);
          setLoading(false);
        }
      }
      return;
    }

    loadMarkdownKey(targetKey, isMounted);

    async function loadMarkdownKey(key: string, mounted: boolean) {
      try {
        const rawContent = (await markdownModules[key]()) as string;
        
        // Find article meta from manifest if available
        const matchedMeta = manifest?.articles?.find(a => a.slug === slug);

        const parsed = parseArticleMarkdown(rawContent, matchedMeta);

        // Compute related posts if missing
        if (!parsed.frontmatter.relatedPosts || parsed.frontmatter.relatedPosts.length === 0) {
          if (manifest?.articles) {
            parsed.frontmatter.relatedPosts = manifest.articles
              .filter(a => a.slug !== slug)
              .map(a => ({
                slug: a.slug,
                title: a.title,
                category: a.category,
                lang: a.lang || 'en',
                score: a.category === category ? 85 : 50,
                path: a.route || `/${a.lang || 'en'}/${a.category}/${a.slug}`
              }))
              .sort((a, b) => b.score - a.score)
              .slice(0, 5);
          }
        }

        if (mounted) {
          setArticleData({
            frontmatter: parsed.frontmatter,
            contentHtml: parsed.contentHtml,
          });
          setLoading(false);
        }
      } catch (err: any) {
        if (mounted) {
          setError(`Failed to render article: ${err.message || 'Unknown error'}`);
          setLoading(false);
        }
      }
    }
  }, [lang, category, slug, manifest]);

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col selection:bg-gold selection:text-black">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full border-2 border-gold flex items-center justify-center text-gold font-serif font-bold group-hover:scale-105 transition-transform">
                B
              </div>
              <span className="font-serif font-bold text-xl text-white group-hover:text-gold transition-colors">
                Bivol<span className="text-gold">.xyz</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/articles"
              className="hidden sm:flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/70 hover:text-gold transition-colors"
            >
              <BookOpen className="w-4 h-4 text-gold" />
              <span>All Guides ({manifest?.totalArticles || 12})</span>
            </Link>

            <Link
              to="/"
              className="px-4 py-2 bg-white/5 border border-white/10 hover:border-gold/50 rounded-full text-xs font-mono uppercase tracking-widest text-white hover:text-gold transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content View */}
      <div className="flex-1">
        {loading && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-white/50">
            <Loader2 className="w-8 h-8 text-gold animate-spin" />
            <p className="text-xs font-mono uppercase tracking-widest">Loading Article Architecture...</p>
          </div>
        )}

        {error && !loading && (
          <div className="max-w-3xl mx-auto my-20 p-8 border border-red-500/30 bg-red-500/5 rounded-2xl text-center space-y-6">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-serif font-bold text-xl">
              !
            </div>
            <h1 className="text-2xl font-serif font-bold text-white">Guide Not Found</h1>
            <p className="text-white/60 text-sm max-w-lg mx-auto">{error}</p>
            <div className="flex justify-center gap-4 pt-4">
              <Link
                to="/articles"
                className="px-6 py-2.5 bg-gold text-black font-mono font-bold text-xs uppercase tracking-widest rounded-full hover:bg-white transition-colors"
              >
                Browse All Guides
              </Link>
              <Link
                to="/"
                className="px-6 py-2.5 bg-white/10 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-full hover:bg-white/20 transition-colors"
              >
                Return Home
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && articleData && (
          <ArticleTemplate
            frontmatter={articleData.frontmatter}
            content={articleData.contentHtml}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-white/40 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-gold font-serif font-bold">Bivol.xyz</span>
            <span>— Technical Email Engineering Platform</span>
          </div>
          <div className="flex items-center gap-6 uppercase tracking-wider">
            <Link to="/articles" className="hover:text-gold transition-colors">Articles</Link>
            <Link to="/privacy" className="hover:text-gold transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gold transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ArticlePage;
