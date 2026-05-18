import React from 'react';
import { motion } from 'motion/react';
import { Scale, FileCheck, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
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
              <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Terms of Service</h1>
              <p className="text-white/40 text-sm font-mono uppercase tracking-widest">© 2026–PRESENT GOLD STANDARD VALIDATION. ALL RIGHTS RESERVED.</p>
            </div>

            <section className="space-y-6">
              <h2 className="text-2xl font-serif font-bold flex items-center gap-3">
                <Scale className="text-gold w-6 h-6" /> 1. Agreement to Terms
              </h2>
              <p className="text-white/60 leading-relaxed">
                By accessing or using Bivol.xyz, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-serif font-bold flex items-center gap-3">
                <FileCheck className="text-gold w-6 h-6" /> 2. Service Scope
              </h2>
              <p className="text-white/60 leading-relaxed">
                Bivol provides a hybrid email validation service combining automated engine checks with manual human-eye audits. Our turnaround time is typically 24-48 hours.
              </p>
              <ul className="list-disc list-inside text-white/50 space-y-2 ml-4">
                <li>Silver Monthly: $49/mo (Up to 100k emails)</li>
                <li>Annual Membership: $490/yr (Save $98)</li>
                <li>Free Trial: 1,000 Credits (Business Emails Only)</li>
              </ul>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-serif font-bold flex items-center gap-3">
                <AlertTriangle className="text-gold w-6 h-6" /> 3. Data Confidentiality
              </h2>
              <p className="text-white/60 leading-relaxed">
                We treat all uploaded email lists as highly confidential.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-serif font-bold italic">4. Prohibited Uses</h2>
              <p className="text-white/60 leading-relaxed">
                You may not use our service to validate lists obtained through illegal means, or for any purpose that violates international anti-spam laws (CAN-SPAM, CASL, etc.). We reserve the right to terminate service for accounts attempting to clean "bought" or "scraped" data that violates our quality standards.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-serif font-bold italic">5. Limitation of Liability</h2>
              <p className="text-white/60 leading-relaxed">
                Bivol.xyz shall not be liable for any damage to your sender reputation or infrastructure. While our "Safety First" filter removes high-risk emails, final delivery results depend on your sending practices and tool configurations.
              </p>
            </section>

            <div className="pt-10 border-t border-white/10 text-center">
              <p className="text-white/30 text-sm">By using our services, you acknowledge you have read and understood these terms.</p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
