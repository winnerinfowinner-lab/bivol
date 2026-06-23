import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink, HelpCircle} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FAQ() {
  // Inject structured data for search engine rich results
  React.useEffect(() => {
    const existingScript = document.getElementById('faq-structured-data');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'faq-structured-data';
      script.type = 'application/ld+json';
      script.text = JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://bivol.xyz"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "FAQ",
              "item": "https://bivol.xyz/faq"
            }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is the difference between email verification and email validation?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Email verification typically refers to checking if a specific mailbox actively exists on a mail server by pinging it. Email validation is a broader process that includes syntax checking, domain analysis, and identifying risk patterns like spam traps, catch-all configurations, and temporary addresses."
              }
            },
            {
              "@type": "Question",
              "name": "What email bounce rate is considered healthy for cold outreach?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "A healthy bounce rate for outbound prospecting should strictly remain below 2%. Anything exceeding this threshold flags your sending infrastructure to internet service providers, which can permanently damage your domain's inbox placement."
              }
            },
            {
              "@type": "Question",
              "name": "Should I verify raw B2B lead generation lists before sending?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. While raw data databases or intelligence platforms are excellent for sourcing prospect data, professional roles change rapidly, causing natural data decay. Verifying these lead lists through a dedicated hygiene service before starting outbound campaigns prevents high bounce rates and safeguards your delivery setup."
              }
            },
            {
              "@type": "Question",
              "name": "Can high-risk catch-all emails hurt cold email campaigns?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Catch-all servers accept all incoming mail initially, making them difficult for automated tools to grade. Sending to unverified catch-alls increases the risk of hidden bounces. However, safely validating them allows you to access leads that your competitors ignore due to tool limitations."
              }
            }
          ]
        }
      ]);
      document.head.appendChild(script);
    }
    return () => {
      const scriptToRemove = document.getElementById('faq-structured-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-gold selection:text-black">
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-serif font-bold text-xl tracking-tight">Bivol<span className="text-gold">.xyz</span></span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Header */}
            <div className="border-b border-white/10 pb-10">
              <h2 className="text-gold font-serif text-xl mb-2">Bivol.xyz</h2>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 tracking-tight">KNOWLEDGE BASE & FAQ</h1>
              <p className="text-white/40 text-xs font-mono uppercase tracking-widest">© 2026–PRESENT GOLD STANDARD VALIDATION. ALL RIGHTS RESERVED.</p>
            </div>

            {/* SEO Intro Banner */}
            <div className="bg-white/[0.02] border-l-4 border-gold p-6 rounded-r-xl text-white/70 leading-relaxed text-[15px] shadow-[inset_1px_1px_1px_rgba(255,255,255,0.02)]">
              Understanding data maintenance frameworks is vital for scaling modern outbound communication. This independent educational center provides transparent answers to common industry questions regarding list hygiene, infrastructure protection, and maximizing technical placement accuracy.
            </div>

            {/* Internal Quick Links */}
            <div className="p-6 bg-white/[0.01] border border-white/5 border-dashed rounded-xl flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-semibold tracking-wide">
              <a href="/#pricing" className="text-gold hover:underline flex items-center gap-1.5 transition-colors">
                View Subscription Plans <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-white/10 hidden sm:inline">|</span>
              <a href="/#contact" className="text-gold hover:underline flex items-center gap-1.5 transition-colors">
                Get 1,000 Free Credits <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-white/10 hidden sm:inline">|</span>
              <a href="mailto:info@bivol.xyz" className="text-gold hover:underline flex items-center gap-1.5 transition-colors">
                Direct Operational Support <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Category 1 */}
            <div className="space-y-6">
              <h2 className="text-lg md:text-xl font-serif font-bold text-gold uppercase tracking-wider border-b border-white/10 pb-3">
                1. Core Industry Concepts
              </h2>

              <div className="grid gap-6">
                <div className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 p-6 rounded-xl transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                  <h3 className="text-lg font-serif font-bold text-white mb-3 flex items-start gap-2.5">
                    <HelpCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    What is the difference between email verification and email validation?
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm pl-7.5">
                    Verification checks the live existence of a specific mailbox by establishing a direct server ping. Validation encompasses a wider suite of structural hygiene checks, looking at domain records, format syntax, and identifying risk profiles like spam traps or temporary addresses within your data collection.
                  </p>
                </div>

                <div className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 p-6 rounded-xl transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                  <h3 className="text-lg font-serif font-bold text-white mb-3 flex items-start gap-2.5">
                    <HelpCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    What email bounce rate is considered healthy?
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm pl-7.5">
                    A sustainable bounce rate should ideally stay below 2%. Moving past this mark alerts filtering algorithms that your list sourcing is unverified, which causes email service providers to route your future outreach sequences away from the primary inbox.
                  </p>
                </div>

                <div className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 p-6 rounded-xl transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                  <h3 className="text-lg font-serif font-bold text-white mb-3 flex items-start gap-2.5">
                    <HelpCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    What are spam traps and how do they affect list hygiene?
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm pl-7.5">
                    Spam traps (or honeypots) are functional email addresses used by security networks to catch unverified scraping operations. They don't belong to real buyers, so sending to them damages your domain reputation. Standard verification helps minimize these potential honeypot risks before deployment.
                  </p>
                </div>

                <div className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 p-6 rounded-xl transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                  <h3 className="text-lg font-serif font-bold text-white mb-3 flex items-start gap-2.5">
                    <HelpCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    What is a role-based email address?
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm pl-7.5">
                    These are generic departmental addresses like admin@, info@, or sales@. While they are often valid mailboxes, they are generally shared by teams rather than individuals, making them less effective for hyper-personalized marketing and prone to generating complaints.
                  </p>
                </div>
              </div>
            </div>

            {/* Category 2 */}
            <div className="space-y-6 pt-6">
              <h2 className="text-lg md:text-xl font-serif font-bold text-gold uppercase tracking-wider border-b border-white/10 pb-3">
                2. Cold Email Outreach FAQ
              </h2>

              <div className="grid gap-6">
                <div className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 p-6 rounded-xl transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                  <h3 className="text-lg font-serif font-bold text-white mb-3 flex items-start gap-2.5">
                    <HelpCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    Should I verify raw B2B lead generation lists before sending?
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm pl-7.5">
                    Yes, checking data sourced from prospect databases is highly recommended. Because professional roles mutate rapidly, corporate lists experience natural decay. Scrubbing your exported lead lists ensures you are only running outreach sequences on active, stable setups.
                  </p>
                </div>

                <div className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 p-6 rounded-xl transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                  <h3 className="text-lg font-serif font-bold text-white mb-3 flex items-start gap-2.5">
                    <HelpCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    Can catch-all emails hurt cold outreach campaigns?
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm pl-7.5">
                    Unverified catch-alls carry hidden risks because their servers hide active mailbox status. Standard automated tools flag them all as unsafe. Processing them through specialized review systems helps identify safe targets, allowing you to salvage valuable pipeline data safely.
                  </p>
                </div>

                <div className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 p-6 rounded-xl transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                  <h3 className="text-lg font-serif font-bold text-white mb-3 flex items-start gap-2.5">
                    <HelpCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    How often should I verify a cold email list?
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm pl-7.5">
                    Outbound prospect lists should be checked every single time you launch a new sequence or monthly if you run continuous flows. Regular cleanups help maintain healthy bounce rates and safeguard the longevity of your secondary domain setups.
                  </p>
                </div>

                <div className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 p-6 rounded-xl transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                  <h3 className="text-lg font-serif font-bold text-white mb-3 flex items-start gap-2.5">
                    <HelpCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    Can verifying data improve actual reply rates?
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm pl-7.5">
                    Indirectly, yes. While cleaning data doesn't alter your offer copy, it ensures your messages land in front of actual human targets instead of bouncing or logging into inactive mailboxes, resulting in higher visibility and conversion opportunities.
                  </p>
                </div>
              </div>
            </div>

            {/* Category 3 */}
            <div className="space-y-6 pt-6">
              <h2 className="text-lg md:text-xl font-serif font-bold text-gold uppercase tracking-wider border-b border-white/10 pb-3">
                3. Operational Approach at Bivol
              </h2>

              <div className="grid gap-6">
                <div className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 p-6 rounded-xl transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                  <h3 className="text-lg font-serif font-bold text-white mb-3 flex items-start gap-2.5">
                    <HelpCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    What makes Bivol different from 100% automated APIs?
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm pl-7.5">
                    Fully automated platforms check syntax and deliver rapid responses, but they miss intricate configuration anomalies. Bivol utilizes a Hybrid Engine framework: high-speed systematic filtering paired with a dedicated Human-In-The-Loop expert audit queue to review edge cases manually.
                  </p>
                </div>

                <div className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 p-6 rounded-xl transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                  <h3 className="text-lg font-serif font-bold text-white mb-3 flex items-start gap-2.5">
                    <HelpCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    Why does the verification process require 24 to 48 hours?
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm pl-7.5">
                    Our operation favors accurate processing stability over sheer velocity. Passing raw lead generation exports through human analysis queues takes time, but it guarantees that your final data set achieves our established Gold Standard quality guidelines.
                  </p>
                </div>

                <div className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 p-6 rounded-xl transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                  <h3 className="text-lg font-serif font-bold text-white mb-3 flex items-start gap-2.5">
                    <HelpCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    What is Bivol's "Safety First" filter setting?
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm pl-7.5">
                    We lean on a conservative data policy. If our technical pings and expert review loops can't certify a destination mailbox with absolute clarity, we remove it from the final dashboard export. Protecting your corporate system infrastructure is always our top priority.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Copy */}
            <div className="pt-10 border-t border-white/10 text-center text-white/30 text-xs">
              <p>© 2026 GOLD STANDARD VALIDATION. <a href="https://bivol.xyz" className="text-gold hover:underline">Bivol.xyz</a></p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
