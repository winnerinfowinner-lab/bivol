import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
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
              <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Privacy Policy</h1>
              <p className="text-white/40 text-sm font-mono uppercase tracking-widest">© 2026–PRESENT GOLD STANDARD VALIDATION. ALL RIGHTS RESERVED.</p>
            </div>

            <section className="space-y-6">
              <h2 className="text-2xl font-serif font-bold flex items-center gap-3">
                <Shield className="text-gold w-6 h-6" /> 1. Introduction
              </h2>
              <p className="text-white/60 leading-relaxed">
                Welcome to Bivol.xyz. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at info@bivol.xyz.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-serif font-bold flex items-center gap-3">
                <Lock className="text-gold w-6 h-6" /> 2. Information We Collect
              </h2>
              <p className="text-white/60 leading-relaxed">
                We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services, such as:
              </p>
              <ul className="list-disc list-inside text-white/50 space-y-2 ml-4">
                <li>Name and Contact Data (via Contact Form)</li>
                <li>Email Lists Uploaded for Verification</li>
                <li>Business Email Addresses for Trial Access</li>
                <li>Payment Information (processed via PayPal)</li>
              </ul>
              <p className="text-white/60 leading-relaxed italic bg-white/5 p-4 rounded-lg border-l-2 border-gold font-medium">
                "User data collected via our contact form and email lists uploaded for verification are handled with strict confidentiality. Our human-in-the-loop audit process is bound by non-disclosure agreements."
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-serif font-bold flex items-center gap-3">
                <Eye className="text-gold w-6 h-6" /> 3. How We Use Your Information
              </h2>
              <p className="text-white/60 leading-relaxed">
                We use the information we collect or receive for:
              </p>
              <ul className="list-disc list-inside text-white/50 space-y-2 ml-4">
                <li>Providing the Email Validation Service.</li>
                <li>Sending the Master Clean List back to you.</li>
                <li>Responding to inquiries via the contact form.</li>
                <li>Improving our hybrid engine and audit patterns.</li>
              </ul>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-serif font-bold flex items-center gap-3">
                <FileText className="text-gold w-6 h-6" /> 4. Data Security
              </h2>
              <p className="text-white/60 leading-relaxed">
                We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-serif font-bold italic">5. GDPR & International Compliance</h2>
              <p className="text-white/60 leading-relaxed">
                We respect the privacy rights of users worldwide. For users in the European Union, we process your data in accordance with the General Data Protection Regulation (GDPR).
              </p>
            </section>

            <div className="pt-10 border-t border-white/10 text-center">
              <p className="text-white/30 text-sm">Questions? Reach out to <span className="text-gold">info@bivol.xyz</span></p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
