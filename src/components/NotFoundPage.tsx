import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Search, ShieldAlert } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col selection:bg-gold selection:text-black">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-gold flex items-center justify-center font-serif font-bold text-gold text-lg">
              B
            </div>
            <span className="font-serif font-bold text-xl tracking-tight text-white hover:text-gold transition-colors">
              Bivol<span className="text-gold">.xyz</span>
            </span>
          </Link>
          <Link
            to="/articles"
            className="text-xs font-mono uppercase tracking-widest text-gold hover:text-white transition-colors flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse Guides</span>
          </Link>
        </div>
      </header>

      {/* 404 Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-xl w-full text-center space-y-8 p-8 md:p-12 border border-white/10 bg-white/[0.02] rounded-3xl backdrop-blur-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-gold">404 Error</span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
              Page or Guide Not Found
            </h1>
            <p className="text-white/60 text-sm leading-relaxed max-w-md mx-auto">
              The requested route does not match any existing technical guide, documentation, or landing page in the Bivol content index.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/articles"
              className="w-full sm:w-auto px-6 py-3 bg-gold text-black font-mono font-bold text-xs uppercase tracking-widest rounded-full hover:bg-white transition-all shadow-lg shadow-gold/10 flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore All Articles</span>
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 bg-white/10 border border-white/15 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-full hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 text-center text-xs text-white/40 font-mono">
        <p>© 2026 Bivol.xyz — Enterprise Email Engineering Platform</p>
      </footer>
    </div>
  );
};

export default NotFoundPage;
