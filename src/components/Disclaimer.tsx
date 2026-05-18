import React from 'react';
import { motion } from 'motion/react';
import { Info, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-gold selection:text-black">
      <nav className="absolute top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-serif font-bold text-xl tracking-tight">Bivol<span className="text-gold">.xyz</span></span>
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="border-b border-white/10 pb-10">
              <h2 className="text-gold font-serif text-xl mb-2">Bivol.xyz</h2>
              <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 uppercase">Disclaimer</h1>
              <p className="text-white/40 text-sm font-mono uppercase tracking-widest">© 2026–PRESENT GOLD STANDARD VALIDATION. ALL RIGHTS RESERVED.</p>
            </div>

            <section className="space-y-6">
              <h2 className="text-2xl font-serif font-bold flex items-center gap-3">
                <Info className="text-gold w-6 h-6" /> Service Performance
              </h2>
              <p className="text-white/60 leading-relaxed">
                The information provided by Bivol.xyz ("we," "us," or "our") on this website is for general informational purposes and the specific provision of email validation services. All services are provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, or completeness of the final verification results in every hypothetical environment.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-serif font-bold flex items-center gap-3 text-red-500/80">
                <AlertCircle className="w-6 h-6" /> Inbox Placement Liability
              </h2>
              <p className="text-white/60 leading-relaxed italic">
                "Our validation service confirms the status and safety of an email address at the time of verification. We do not guarantee that your emails will reach the inbox, as delivery is subject to factors beyond our control, including your content, sender IP reputation, and the recipient's spam filter settings."
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-serif font-bold italic">Verification "Catch-All" Warning</h2>
              <p className="text-white/60 leading-relaxed">
                Some domains use a "Catch-All" configuration where the server accepts all mail initially. While our hybrid audit works to identify these, some may still appear valid. Our "Safety First" filter removes those we deem high-risk, which may result in a slightly smaller but much safer list.
              </p>
            </section>

            <div className="pt-10 border-t border-white/10 text-center">
              <p className="text-white/30 text-sm italic">Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on the service.</p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
