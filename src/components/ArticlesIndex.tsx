import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, ArrowRight, Tag, Calendar, ChevronRight } from 'lucide-react';
import { ContentManifest, ArticleManifestItem } from '../lib/markdown';

export const ArticlesIndex: React.FC = () => {
  const [manifest, setManifest] = useState<ContentManifest | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/content-manifest.json')
      .then((res) => res.json())
      .then((data: ContentManifest) => {
        setManifest(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load articles manifest:', err);
        setLoading(false);
      });
  }, []);

  const articles = manifest?.articles || [];

  const filteredArticles = articles.filter((article) => {
    const q = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(q) ||
      article.metaDescription.toLowerCase().includes(q) ||
      article.category.toLowerCase().includes(q) ||
      article.slug.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-gold selection:text-black">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-gold flex items-center justify-center font-serif font-bold text-gold text-lg">
              B
            </div>
            <span className="font-serif font-bold text-xl tracking-tight text-white hover:text-gold transition-colors">
              Bivol<span className="text-gold">.xyz</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-xs font-mono uppercase tracking-widest text-white/60 hover:text-gold transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="pt-20 pb-12 px-6 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-mono uppercase tracking-widest">
          <BookOpen className="w-3.5 h-3.5" />
          Technical Engineering Knowledge Base
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-white">
          Architecture Guides & Deliverability Docs
        </h1>
        <p className="text-white/60 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          In-depth technical guides covering email verification APIs, SMTP handshakes, MX record parsing, and deliverability infrastructure.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative pt-4">
          <Search className="w-5 h-5 text-gold absolute left-4 top-8 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guides by keyword, protocol, or API..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white/[0.03] border border-white/15 focus:border-gold text-white text-sm focus:outline-none transition-colors"
          />
        </div>
      </header>

      {/* Articles Grid */}
      <main className="max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="py-20 text-center text-white/40 font-mono text-xs uppercase tracking-widest">
            Loading Articles Catalog...
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <p className="text-white/60 text-lg">No articles matched your query "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-gold text-xs font-mono uppercase tracking-wider underline hover:text-white"
            >
              Clear Search Query
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article: ArticleManifestItem) => (
              <article
                key={article.slug}
                className="group flex flex-col justify-between p-6 bg-white/[0.02] border border-white/10 hover:border-gold/40 rounded-2xl hover:bg-gold/[0.02] transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                    <span className="px-2.5 py-0.5 rounded-full bg-gold/10 border border-gold/30 text-gold uppercase tracking-wider">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gold" />
                      {article.publishDate}
                    </span>
                  </div>

                  <h2 className="text-xl font-serif font-bold text-white group-hover:text-gold transition-colors leading-snug">
                    <Link to={article.route || `/${article.lang || 'en'}/${article.category}/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h2>

                  <p className="text-white/60 text-sm line-clamp-3 leading-relaxed font-sans">
                    {article.metaDescription}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
                    {article.lang.toUpperCase()} Documentation
                  </span>
                  <Link
                    to={article.route || `/${article.lang || 'en'}/${article.category}/${article.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-gold uppercase tracking-wider group-hover:translate-x-1 transition-transform"
                  >
                    Read Guide
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-xs text-white/40 font-mono">
        <p>© 2026 Bivol.xyz — Enterprise Email Validation Platform</p>
      </footer>
    </div>
  );
};

export default ArticlesIndex;
