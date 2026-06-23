import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink, ShieldCheck, Cpu, Key, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmailVerificationGuide() {
  // Inject structured data for search engine rich results
  React.useEffect(() => {
    const existingScript = document.getElementById('guide-structured-data');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'guide-structured-data';
      script.type = 'application/ld+json';
      script.text = JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bivol.xyz" },
            { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://bivol.xyz/guides" },
            { "@type": "ListItem", "position": 3, "name": "Email Verification Guide", "item": "https://bivol.xyz/email-verification-guide" }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "TechArticle",
          "headline": "The Engineering Behind Email Deliverability & Verification",
          "description": "An academic breakdown of mail server behaviors, infrastructure authentication, and data verification frameworks.",
          "inLanguage": "en",
          "publisher": {
            "@type": "Organization",
            "name": "Bivol",
            "url": "https://bivol.xyz"
          }
        }
      ]);
      document.head.appendChild(script);
    }
    return () => {
      const scriptToRemove = document.getElementById('guide-structured-data');
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
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform animate-pulse" />
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
              <h1 className="text-4xl md:text-5xl lg:text-md font-serif font-bold mb-4 tracking-tight uppercase leading-tight">
                The Engineering Behind Email Deliverability & Verification
              </h1>
              <p className="text-white/40 text-xs font-mono uppercase tracking-widest">
                Technical Architecture Blueprint | Published: 2026
              </p>
            </div>

            {/* Abstract */}
            <div className="bg-white/[0.02] border-l-4 border-gold p-6 rounded-r-xl text-white/70 leading-relaxed text-[15px] shadow-[inset_1px_1px_1px_rgba(255,255,255,0.02)]">
              <strong>Abstract:</strong> Modern enterprise outbound communication demands an exact understanding of transactional and marketing mail server mechanics. This technical guide isolates the core variables of the Simple Mail Transfer Protocol (SMTP), evaluates structural reputation systems managed by receiving ISPs, and unpacks the algorithmic and manual layers required to clean business databases safely without triggering security filters.
            </div>

            {/* Section 1 */}
            <section className="space-y-6">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-gold uppercase tracking-wider border-b border-white/10 pb-3 flex items-center gap-3">
                <Cpu className="w-6 h-6 shrink-0 text-gold" />
                1. How Mail Servers Interact: The SMTP Handshake Blueprint
              </h2>
              <p className="text-white/60 leading-relaxed text-[15px]">
                To understand verification, one must map out how two separate Mail Transfer Agents (MTAs) establish communication. When a sender transmits a payload, the Sender MTA opens a TCP connection to the receiving mail server on port 25, 465, or 587. This initiates the <strong className="text-white">SMTP Handshake</strong>.
              </p>
              <p className="text-white/60 leading-relaxed text-[15px]">
                The sequence functions through standardized numeric response codes issued by the receiving server:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/60 text-[15px] pl-4">
                <li><code className="text-gold bg-white/[0.05] px-2 py-0.5 rounded font-mono text-sm">220</code> - Service ready; the receiving server introduces its hostname.</li>
                <li><code className="text-gold bg-white/[0.05] px-2 py-0.5 rounded font-mono text-sm">EHLO / HELO</code> - The sender identifies its domain identity.</li>
                <li><code className="text-gold bg-white/[0.05] px-2 py-0.5 rounded font-mono text-sm">MAIL FROM</code> - Explicitly states the sender envelope mailbox.</li>
                <li><code className="text-gold bg-white/[0.05] px-2 py-0.5 rounded font-mono text-sm">RCPT TO</code> - Mentions the destination address. <span className="italic text-white/40">(This is the exact node where basic verification scripts attempt to listen)</span>.</li>
                <li><code className="text-gold bg-white/[0.05] px-2 py-0.5 rounded font-mono text-sm">250</code> - Requested mail action okay, completed.</li>
              </ul>

              <div className="bg-white/5 border border-white/10 rounded-xl p-5 overflow-x-auto shadow-inner mt-4 font-mono text-xs md:text-sm text-green-400">
                <pre className="whitespace-pre-wrap">
{`S: 220 mail.destination.com ESMTP Postfix
C: EHLO sender.bivol.xyz
S: 250-mail.destination.com, 250-8BITMIME, 250 STARTTLS
C: MAIL FROM:<verify@bivol.xyz>
S: 250 2.1.0 Ok
C: RCPT TO:<target-prospect@destination.com>
S: 250 2.1.5 Ok --> (Indicates mailbox is structurally alive)
C: QUIT
S: 221 2.0.0 Bye`}
                </pre>
              </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-6 pt-4">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-gold uppercase tracking-wider border-b border-white/10 pb-3 flex items-center gap-3">
                <Key className="w-6 h-6 shrink-0 text-gold" />
                2. Technical Authentication Vectors: SPF, DKIM, and DMARC
              </h2>
              <p className="text-white/60 leading-relaxed text-[15px]">
                Receiving mail servers do not trust incoming packets implicitly. They require strict DNS authentication matching. If these frameworks are misconfigured, delivery metrics collapse instantly.
              </p>
              
              <div className="space-y-4 pt-2">
                <div className="bg-white/[0.02] border border-white/5 p-5 rounded-xl">
                  <h3 className="text-white font-serif font-bold text-md mb-2">Sender Policy Framework (SPF)</h3>
                  <p className="text-white/60 leading-relaxed text-sm">
                    SPF is a simple TXT record added to your DNS zone file. It specifies exactly which server IP addresses are permitted to transmit emails on behalf of your domain name. If a cold email tool uses an unlisted IP, receiving spam filters flag it immediately.
                  </p>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-5 rounded-xl">
                  <h3 className="text-white font-serif font-bold text-md mb-2">DomainKeys Identified Mail (DKIM)</h3>
                  <p className="text-white/60 leading-relaxed text-sm">
                    DKIM appends an invisible cryptographic signature to the header of every outbound message. The receiving MTA uses your domain's public DNS key to verify that the email body and headers were not altered or tampered with mid-transit.
                  </p>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-5 rounded-xl">
                  <h3 className="text-white font-serif font-bold text-md mb-2">DMARC (Domain-based Message Authentication, Reporting, and Conformance)</h3>
                  <p className="text-white/60 leading-relaxed text-sm">
                    DMARC is the governance engine sitting on top of SPF and DKIM. It gives instructions to receiving servers on how to behave if both authentication methods fail. The policy can be set to <code className="text-gold font-mono bg-white/[0.05] px-1.5 py-0.5 rounded text-xs">p=none</code> (monitoring only), <code className="text-gold font-mono bg-white/[0.05] px-1.5 py-0.5 rounded text-xs">p=quarantine</code> (send directly to spam), or <code className="text-gold font-mono bg-white/[0.05] px-1.5 py-0.5 rounded text-xs">p=reject</code> (hard block the delivery completely).
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-6 pt-4">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-gold uppercase tracking-wider border-b border-white/10 pb-3 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 shrink-0 text-gold" />
                3. The Architecture of Inbox Reputation
              </h2>
              <p className="text-white/60 leading-relaxed text-[15px]">
                Internet Service Providers (ISPs and major security-focused mailbox networks) monitor sender metrics across a rolling window. Reputation is split into two independent scores:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-white/60 text-[15px] pl-4">
                <li><strong className="text-white">IP Reputation:</strong> Based on the specific physical machine transmitting the data packets.</li>
                <li><strong className="text-white">Domain Reputation:</strong> Based on the overall historical health of your actual root domain and tracking links.</li>
              </ol>
              <p className="text-white/60 leading-relaxed text-[15px]">
                If your list sourcing is unrefined, you hit invalid mailboxes. This generates an immediate <code className="text-gold font-mono bg-white/[0.05] px-1.5 py-0.5 rounded text-xs">550 User Unknown</code> error response code. Moving beyond a 2% bounce threshold causes automatic placement downgrades, meaning your emails skip the primary inbox entirely and drop into spam folders worldwide.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-6 pt-4">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-gold uppercase tracking-wider border-b border-white/10 pb-3 flex items-center gap-3">
                <HelpCircle className="w-6 h-6 shrink-0 text-gold" />
                4. The Logic of Technical Verification Frameworks
              </h2>
              <p className="text-white/60 leading-relaxed text-[15px]">
                Automated cleaning software processes target directories by running batch scripts across multiple layers:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/60 text-[15px] pl-4">
                <li><strong className="text-white">Syntax Filtering:</strong> Eliminates structural errors based on RFC standards.</li>
                <li><strong className="text-white">MX Record Analysis:</strong> Verifies if the target domain actually points to active Mail Exchange servers.</li>
                <li><strong className="text-white">Systematic Server Pinging:</strong> Initiating the SMTP protocol up to the <code className="text-gold font-mono bg-white/[0.05] px-1.5 py-0.5 rounded text-xs">RCPT TO</code> line to catch 550 codes, then disconnecting before sending actual bytes.</li>
              </ul>
              <p className="text-white/60 leading-relaxed text-[15px]">
                However, automation encounters limitations against modern security walls, grey-listing delays, and intentional catch-all protections, creating data gaps that require specialized hybrid filtering to accurately decipher.
              </p>
            </section>

            {/* Call to Action Banner */}
            <div className="mt-8 p-8 bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl text-center space-y-4 shadow-xl">
              <h3 className="text-xl font-serif font-bold text-white">Need delicate list maintenance?</h3>
              <p className="text-white/50 text-sm max-w-lg mx-auto">
                Explore how our hybrid engine verifies delicate enterprise edge-cases at scale.
              </p>
              <div className="pt-2">
                <a 
                  href="/" 
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-black px-6 py-3 rounded-full font-bold text-sm tracking-wide transition-all hover:scale-105"
                >
                  Learn About Bivol Verification <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Footer Copy */}
            <div className="pt-10 border-t border-white/10 text-center text-white/30 text-xs">
              <p>© 2026 Bivol Framework Documentation. All Technical Rights Reserved.</p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
