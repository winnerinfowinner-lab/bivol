/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react'; // إضافة useEffect هنا
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import Disclaimer from './components/Disclaimer';
import FAQ from './components/FAQ';
import EmailVerificationGuide from './components/EmailVerificationGuide';
import CatchAllEmailGuide from './components/CatchAllEmailGuide';
import BivolVsAutomatedTools from './components/BivolVsAutomatedTools';
import { 
  ShieldCheck, 
  Users, 
  Zap, 
  Clock, 
  FileText, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Search,
  Check,
  Send,
  Loader2,
  AlertCircle,
  DatabaseZap, // إضافة الأيقونة الجديدة
  CalendarDays // إضافة الأيقونة الجديدة
} from 'lucide-react';

// البنية البيانية للمقالات المولّدة برمجياً
interface GeneratedArticle {
  slug: string;
  route: string;
  frontmatter: {
    title: string;
    targetKeyword: string;
    publishDate: string;
    metaDescription: string;
    category: string;
  };
}

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number; key?: React.Key }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
  >
    {children}
  </motion.div>
);

function LandingPage({ 
  formData, 
  setFormData, 
  status, 
  setStatus, 
  statusMessage, 
  handleSubmit,
  generatedArticles // استلام المقالات كـ Prop
}: any) {
  return (
    <>
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-8 h-8 rounded-full border-2 border-gold flex items-center justify-center"
            >
              <span className="text-gold font-serif font-bold text-lg">B</span>
            </motion.div>
            <Link to="/" className="font-serif font-bold text-xl tracking-tight text-white hover:text-gold transition-colors">Bivol<span className="text-gold">.xyz</span></Link>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-medium tracking-wide uppercase text-white/60">
            <a href="#how-it-works" className="hover:text-gold transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-gold transition-colors">Pricing</a>
            <a href="#audit" className="hover:text-gold transition-colors">Audit Process</a>
            {/* إضافة رابط لقسم المقالات */}
            <a href="#guides" className="hover:text-gold transition-colors">Guides</a>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gold transition-colors"
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get Started
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 lg:pt-60 lg:pb-32 px-6">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gold/5 blur-[120px] rounded-full -z-10" />
        <div className="max-w-5xl mx-auto text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
              <Sparkles className="w-3 h-3" /> The Gold Standard of Email Validation.
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-6xl md:text-8xl font-serif font-black mb-8 leading-[0.9] tracking-tighter">
              Beyond <span className="italic text-white/40">Automation.</span><br />
              Beyond <span className="gold-gradient">Algorithms.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
              Most validation tools are 100% automated. They are fast, but they miss the subtle patterns that lead to bounces and blacklists.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="flex flex-col items-center gap-6">
              <button 
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-10 py-5 bg-gold text-black font-bold text-sm uppercase tracking-[0.2em] rounded-full overflow-hidden hover:pr-12 transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started — 1,000 Free Credits
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">Business Emails Only</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* The Core Difference */}
      <section id="audit" className="py-24 px-6 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <FadeIn>
              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
                  The <span className="text-gold">Human-In-The-Loop</span> Audit
                </h2>
                <p className="text-white/60 text-lg leading-relaxed">
                  Our tech pings the servers; our experts review the results. We manually identify bot-generated patterns and high-risk "catch-all" addresses that automated APIs often ignore.
                </p>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <p className="text-gold font-mono text-xl font-bold italic">Hybrid Engine</p>
                    <p className="text-white/40 text-sm">Automated high-speed verification at scale.</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gold font-mono text-xl font-bold italic">Expert Audit</p>
                    <p className="text-white/40 text-sm">Manual verification of edge cases and patterns.</p>
                  </div>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="relative glass-card p-8 aspect-video flex flex-col justify-center">
                <div className="absolute inset-0 bg-gold/5 animate-pulse rounded-2xl" />
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-[0.2em] text-white/40 italic">
                    <Search className="w-4 h-4 text-gold" /> Analyzing List Data...
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`h-4 rounded bg-white/${i * 5} w-full`} />
                    ))}
                    <div className="flex items-center gap-3 pt-4">
                      <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center border border-gold/50">
                        <Users className="w-5 h-5 text-gold" />
                      </div>
                      <div className="text-xs">
                        <p className="text-gold font-bold uppercase tracking-widest">Manual Audit Triggered</p>
                        <p className="text-white/30 italic uppercase tracking-tighter mt-1">Detecting high-risk patterns...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <ShieldCheck className="w-8 h-8 text-gold" />,
              title: "The Safety First Filter",
              desc: "We are intentionally conservative. If we aren’t 100% sure an email is safe, we remove it. We’d rather you lose 1% of a list than 100% of your sender reputation."
            },
            {
              icon: <Zap className="w-8 h-8 text-gold" />,
              title: "Zero-Friction Delivery",
              desc: "No complex reports or confusing categories. You send us your data; we return one single, ultra-clean file ready for your favorite sending tool."
            },
            {
              icon: <Clock className="w-8 h-8 text-gold" />,
              title: "Quality Over Velocity",
              desc: "Our typical turnaround is 24 to 48 hours. Why the wait? Because your list enters a manual review queue to ensure it meets our Gold Standard."
            }
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="glass-card p-10 h-full hover:scale-[1.02] transition-transform cursor-default">
                <div className="mb-6">{item.icon}</div>
                <h3 className="text-2xl font-serif font-bold mb-4">{item.title}</h3>
                <p className="text-white/50 leading-relaxed font-light">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Sustainable Pricing</h2>
            <p className="text-white/50 mb-16 text-lg max-w-2xl mx-auto">
              We don't believe in $400 bills. At $49, you can afford to clean your lists every single month, keeping your infrastructure healthy for the long term.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.1}>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Monthly Plan */}
              <div className="relative glass-card p-10 overflow-hidden flex flex-col">
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/40 mb-4">Silver Membership</p>
                <div className="mb-8">
                  <span className="text-6xl font-serif font-black tracking-tighter">$49</span>
                  <span className="text-white/40 font-mono text-lg">/mo</span>
                </div>
                <ul className="space-y-4 mb-10 text-left flex-grow">
                  {[
                    "Up to 100,000 Emails Verified",
                    "Human-In-The-Loop Audit Included",
                    "Universal Integration Format",
                    "Priority Email Support",
                    "Bivol Master Clean List"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a 
                  href="https://www.paypal.com/paypalme/AymanYounes783/49usd" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-white/10 border border-white/10 text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all text-center"
                >
                  Get Monthly
                </a>
              </div>

              {/* Annual Plan */}
              <div className="relative glass-card p-10 overflow-hidden border-gold/50 flex flex-col scale-105 shadow-[0_0_50px_rgba(212,175,55,0.1)]">
                <div className="absolute top-0 right-0 p-4">
                  <span className="px-3 py-1 bg-gold text-black text-[10px] font-black uppercase tracking-widest rounded-bl-xl">2 Months Free</span>
                </div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-gold mb-4 text-gold-light">Annual Membership</p>
                <div className="mb-8">
                  <span className="text-6xl font-serif font-black tracking-tighter gold-gradient">$490</span>
                  <span className="text-white/40 font-mono text-lg">/yr</span>
                </div>
                <ul className="space-y-4 mb-10 text-left flex-grow">
                  {[
                    "All Silver Membership Features",
                    "Priority Audit Queueing",
                    "Dedicated Account Manager",
                    "Custom Integration Support",
                    "Save $98 Yearly"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a 
                  href="https://www.paypal.com/paypalme/AymanYounes783/490usd" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-gold text-black font-bold uppercase tracking-widest hover:bg-white transition-all text-center"
                >
                  Get Annual
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-12">
          <FadeIn>
            <h2 className="text-4xl font-serif font-bold mb-16">The Journey to Master Clean</h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-[1.4rem] left-0 w-full h-px bg-white/5 -z-10" />
            {[
              {
                step: "01",
                title: "Upload Your Data",
                desc: "Send us your .txt or .csv list via email or order notes. Business emails only for trial access."
              },
              {
                step: "02",
                title: "Queue & Audit",
                desc: "Your data undergoes our hybrid validation process (Engine + Human Audit) for 24-48 hours."
              },
              {
                step: "03",
                title: "Deployment",
                desc: "Receive your Master Clean List via email as soon as it clears our quality check."
              }
            ].map((step, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="space-y-6 group">
                  <div className="w-12 h-12 rounded-full border border-gold/30 bg-black flex items-center justify-center text-gold font-mono font-bold text-sm transition-all group-hover:scale-110 group-hover:bg-gold group-hover:text-black">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wider">{step.title}</h3>
                  <p className="text-white/40 leading-relaxed font-light">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* قسم عرض المقالات المولّدة برمجياً (تفعيل الـ SEO) */}
      <section id="guides" className="py-24 bg-zinc-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gold mb-16 text-center">
              Technical Guides & B2B Best Practices
            </h2>
          </FadeIn>
          
          {generatedArticles.length === 0 && (
              <div className="text-center py-10 text-white/20 italic">No articles generated by the build engine yet.</div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {generatedArticles.map((page: GeneratedArticle, idx: number) => (
              <FadeIn key={page.slug} delay={idx * 0.05}>
                <div className="glass-card p-8 h-full hover:border-gold/30 group transition-all flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest">
                      <CalendarDays className="size-3.5 text-gold/50"/>
                      {page.frontmatter.publishDate}
                    </div>
                    <span className="bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                        {page.frontmatter.category}
                    </span>
                  </div>
                  
                  {/* رابط المقال الديناميكي الذي تم توليده برمجياً */}
                  <Link to={page.route} className="block group flex-grow mb-4">
                    <h3 className="text-2xl font-serif font-medium text-white group-hover:text-gold transition-colors line-clamp-2">
                      {page.frontmatter.title}
                    </h3>
                  </Link>
                  
                  <p className="text-white/50 text-sm leading-relaxed mb-6 line-clamp-3 font-light">
                    {page.frontmatter.metaDescription}
                  </p>
                  
                  <Link 
                    to={page.route} 
                    className="text-gold group-hover:text-white flex items-center gap-2 font-bold uppercase tracking-widest text-xs mt-auto"
                  >
                    Read Technical Guide <DatabaseZap className="size-4" />
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Free Trial CTA */}
      <section className="py-32 px-6 border-t border-white/5">
        <FadeIn>
          <div className="max-w-5xl mx-auto glass-card p-12 lg:p-20 text-center relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold/10 blur-[100px] rounded-full" />
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8">Test the "Bivol Strength" for Free</h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              Experience the difference a human-eye audit makes. We will clean your first 1,000 emails for free.
              <span className="block mt-4 text-xs font-bold uppercase tracking-[0.2em] text-white/30 italic">Note: Trial requires a Business Email address.</span>
            </p>
            <div className="flex flex-col items-center gap-6">
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-12 py-6 bg-white text-black font-black text-sm uppercase tracking-[0.3em] hover:bg-gold transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
              >
                Claim My 1,000 Free Credits
              </button>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold animate-pulse">
                <Check className="w-3 h-3" /> Subscribers Get Priority Queueing
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20">
            <FadeIn>
              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-serif font-bold">Get In Touch</h2>
                <p className="text-white/50 text-lg leading-relaxed max-w-md">
                  Have questions about our hybrid audit process? Our team is ready to help you hit the inbox.
                </p>
                <div className="space-y-6 pt-8">
                  <div className="flex items-center gap-4 text-white/70">
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Email Us</p>
                      <p className="text-lg">info@bivol.xyz</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-white/70">
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Response Time</p>
                      <p className="text-lg">Typically 24-48 Hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="glass-card p-10 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {status === 'success' ? (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center py-20 space-y-6"
                    >
                      <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto border border-gold/50">
                        <CheckCircle2 className="w-10 h-10 text-gold" />
                      </div>
                      <h3 className="text-2xl font-serif font-bold italic">Message Sent</h3>
                      <p className="text-white/50">{statusMessage}</p>
                      <button 
                        onClick={() => setStatus('idle')}
                        className="text-gold font-bold uppercase tracking-widest text-xs border-b border-gold pb-1 hover:text-white hover:border-white transition-colors"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form 
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit} 
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Full Name</label>
                        <input 
                          type="text" 
                          name="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg focus:outline-none focus:border-gold/50 transition-colors placeholder:text-white/10"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Business Email</label>
                        <input 
                          type="email" 
                          name="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg focus:outline-none focus:border-gold/50 transition-colors placeholder:text-white/10"
                          placeholder="john@company.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Message</label>
                        <textarea 
                          name="message"
                          required
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg focus:outline-none focus:border-gold/50 transition-colors resize-none placeholder:text-white/10"
                          placeholder="How can we help?"
                        />
                      </div>

                      {status === 'error' && (
                        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{statusMessage}</span>
                        </div>
                      )}

                      <button 
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full py-4 bg-gold text-black font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        {status === 'loading' ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            Send Message
                            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center text-gold font-serif text-sm">B</div>
            <span className="font-serif font-bold text-lg">Bivol.xyz</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
            <Link to="/bivol-vs-automated-tools" className="hover:text-gold transition-colors">Bivol vs Automated</Link>
            <Link to="/email-verification-guide" className="hover:text-gold transition-colors">Verification Guide</Link>
            <Link to="/catch-all-email-guide" className="hover:text-gold transition-colors">Catch-All Guide</Link>
            <Link to="/faq" className="hover:text-gold transition-colors">FAQ</Link>
            <Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
            <Link to="/disclaimer" className="hover:text-gold transition-colors">Disclaimer</Link>
          </div>
          <p className="text-white/10 text-[10px] font-bold uppercase tracking-[0.3em]">
            © 2026–PRESENT GOLD STANDARD VALIDATION. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

export default function App() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  
  // حالة جديدة لتخزين المقالات المولّدة برمجياً
  const [generatedArticles, setGeneratedArticles] = useState<GeneratedArticle[]>([]);

  // محرك جلب المقالات المولّدة من الـ Manifest
  useEffect(() => {
    // جلب ملف الـ Manifest الذي ولده محرك الـ SEO برمجياً
    fetch('/content-manifest.json') 
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load content manifest');
        return res.json();
      })
      .then((data: GeneratedArticle[]) => {
        // ترتيب المقالات حسب تاريخ النشر (الأحدث أولاً)
        setGeneratedArticles(data.sort((a, b) => new Date(b.frontmatter.publishDate).getTime() - new Date(a.frontmatter.publishDate).getTime()));
      })
      .catch((err) => console.error('SEO Build Engine Error:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const form = e.currentTarget;
    const formDataObj = new FormData(form);
    formDataObj.append("access_key", "eb12df14-8693-4922-ab09-602a762df0ac");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataObj
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setStatusMessage("Thank you! Your message has been sent successfully.");
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setStatusMessage(data.message || 'Something went wrong.');
      }
    } catch (error) {
      setStatus('error');
      setStatusMessage('Unable to connect to the server.');
    }
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen font-sans bg-black text-white selection:bg-gold selection:text-black overflow-x-hidden">
        <Routes>
          <Route 
            path="/" 
            element={
              <LandingPage 
                formData={formData}
                setFormData={setFormData}
                status={status}
                setStatus={setStatus}
                statusMessage={statusMessage}
                setStatusMessage={setStatusMessage}
                handleSubmit={handleSubmit}
                generatedArticles={generatedArticles} // تمرير المقالات للواجهة
              />
            } 
          />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/email-verification-guide" element={<EmailVerificationGuide />} />
          <Route path="/catch-all-email-guide" element={<CatchAllEmailGuide />} />
          <Route path="/bivol-vs-automated-tools" element={<BivolVsAutomatedTools />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
        </Routes>
      </div>
    </Router>
  );
}
