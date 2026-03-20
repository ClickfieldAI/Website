import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const heroRef = useRef(null);
  const backgroundBlob1Ref = useRef(null);
  const backgroundBlob2Ref = useRef(null);
  const trustRef = useRef(null);
  const headerRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const heroTextRef = useRef(null);

  useEffect(() => {
    // Reveal Navigation
    gsap.fromTo(headerRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.2 }
    );

    // Hero Text Stagger
    const heroTexts = heroRef.current.querySelectorAll('.hero-anim');
    gsap.fromTo(heroTexts,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power4.out", delay: 0.4 }
    );

    // Parallax Blobs
    gsap.to(backgroundBlob1Ref.current, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    gsap.to(backgroundBlob2Ref.current, {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Trust Row Fade
    if (trustRef.current) {
      gsap.fromTo(trustRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: trustRef.current, start: "top 85%" } }
      );
    }

    // How It Works Cards Stagger
    const howItWorksCards = document.querySelectorAll('.how-it-works-card');
    if (howItWorksCards.length) {
      gsap.fromTo(howItWorksCards,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.9, stagger: 0.18, ease: "power3.out",
          scrollTrigger: { trigger: '.how-it-works-cards', start: "top 80%" }
        }
      );
    }

    // --- Interactive Mouse Parallax (Hero Section) ---
    const xToHeroText = gsap.quickTo(heroTextRef.current, "x", { duration: 0.8, ease: "power3" });
    const yToHeroText = gsap.quickTo(heroTextRef.current, "y", { duration: 0.8, ease: "power3" });

    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / (width / 2);
      const y = (e.clientY - top - height / 2) / (height / 2);
      xToHeroText(x * 30);
      yToHeroText(y * 30);
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      heroElement.addEventListener('mouseleave', () => {
        xToHeroText(0); yToHeroText(0);
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      if (heroElement) {
        heroElement.removeEventListener('mousemove', handleMouseMove);
        heroElement.removeEventListener('mouseleave', handleMouseMove);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#00f0ff] selection:text-black font-sans relative overflow-x-hidden">

      {/* Background Blobs for specific sections */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div ref={backgroundBlob1Ref} className="absolute blur-[140px] rounded-full w-[45vw] h-[45vw] bg-[#00f0ff] opacity-[0.35] -top-[10%] -left-[10%] mix-blend-screen"></div>
        <div ref={backgroundBlob2Ref} className="absolute blur-[140px] rounded-full w-[55vw] h-[55vw] bg-[#0055ff] opacity-[0.35] top-[30%] -right-[10%] mix-blend-screen"></div>
      </div>

      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] pointer-events-none safe-top">
        {/* Nav pill row */}
        <div className="flex justify-center px-4 pt-4 md:pt-5">
          <nav
            ref={headerRef}
            className="glass-panel rounded-full p-1.5 flex items-center gap-0.5 shadow-2xl backdrop-blur-xl pointer-events-auto"
          >
            {/* Logo */}
            <span className="font-display font-bold tracking-tight text-white whitespace-nowrap text-sm select-none px-4 py-1.5">
              CLICKFIELDAI
            </span>

            {/* Desktop nav links — hidden below lg to avoid crowding */}
            <div className="hidden lg:flex items-center gap-0.5">
              <a href="#platform"     className="text-[#888] hover:text-white hover:bg-white/[0.06] active:bg-white/10 transition-all text-sm font-medium whitespace-nowrap px-3.5 py-2 rounded-full">Platform</a>
              <a href="#case-studies" className="text-[#888] hover:text-white hover:bg-white/[0.06] active:bg-white/10 transition-all text-sm font-medium whitespace-nowrap px-3.5 py-2 rounded-full">Case Studies</a>
              <a href="#customers"    className="text-[#888] hover:text-white hover:bg-white/[0.06] active:bg-white/10 transition-all text-sm font-medium whitespace-nowrap px-3.5 py-2 rounded-full">Customers</a>
            </div>

            {/* Divider — desktop only */}
            <div className="hidden lg:block w-px h-4 bg-white/10 mx-1" />

            {/* CTA button */}
            <a
              href="https://cal.com/kishore-clickfieldai/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold bg-white text-black px-5 py-2 rounded-full hover:bg-[#e8e8e8] active:scale-95 transition-all whitespace-nowrap min-h-[44px] flex items-center"
            >
              Book a Call
            </a>

            {/* Hamburger — hidden on lg+ */}
            <button
              className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/[0.08] active:bg-white/[0.12] transition-colors ml-0.5"
              onClick={() => setMobileMenuOpen(o => !o)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                {mobileMenuOpen ? (
                  <path d="M1.5 1.5l12 12M13.5 1.5l-12 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                ) : (
                  <path d="M1.5 3.5h12M1.5 7.5h12M1.5 11.5h12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </nav>
        </div>

        {/* Mobile / tablet dropdown — hidden on lg+ */}
        <div
          className={`lg:hidden mx-4 mt-2 glass-panel rounded-2xl overflow-hidden pointer-events-auto transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-[30rem] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <nav className="flex flex-col p-4 gap-0.5" aria-label="Mobile navigation">
            {[
              { href: '#platform',     label: 'Platform' },
              { href: '#case-studies', label: 'Case Studies' },
              { href: '#customers',    label: 'Customers' },
              { href: '#services',     label: 'Services' },
              { href: '#how-it-works', label: 'How It Works' },
              { href: '#faq',          label: 'FAQ' },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#bbb] hover:text-white active:text-white font-medium text-base px-4 py-3 rounded-xl hover:bg-white/[0.05] active:bg-white/[0.08] transition-colors min-h-[48px] flex items-center"
              >
                {label}
              </a>
            ))}
            <div className="h-px bg-white/[0.06] my-1" />
            <a
              href="https://cal.com/kishore-clickfieldai/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 rounded-xl bg-white text-black text-center font-bold text-sm active:scale-95 transition-transform min-h-[48px] flex items-center justify-center"
            >
              Book a Growth Call →
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main id="platform" ref={heroRef} className="hero-section relative z-10 flex flex-col justify-end pb-[clamp(3rem,6vw,5rem)] px-[clamp(1.25rem,4vw,6rem)] overflow-hidden" style={{ background: 'radial-gradient(ellipse 100% 80% at 10% 100%, rgba(0,240,255,0.22) 0%, transparent 55%), radial-gradient(ellipse 80% 70% at 90% 5%, rgba(0,85,255,0.20) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,85,255,0.06) 0%, transparent 70%), #000' }}>

        {/* Subtle grid texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>

        {/* Decorative glow orbs inside hero */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[8%] right-[6%] w-[min(50vw,420px)] h-[min(50vw,420px)] rounded-full bg-[#0055ff]/20 blur-[90px]"></div>
          <div className="absolute top-[14%] right-[14%] w-[min(30vw,240px)] h-[min(30vw,240px)] rounded-full bg-[#00f0ff]/10 blur-[60px]"></div>
          <div className="absolute top-[5%] left-[35%] w-[min(18vw,140px)] h-[min(18vw,140px)] rounded-full bg-[#00f0ff]/8 blur-[50px]"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full flex flex-col items-start mt-[clamp(6rem,14vw,8rem)]">

          {/* Live badge */}
          <div className="hero-anim mb-5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.12] bg-white/[0.04] text-xs font-medium text-[#aaa] tracking-wide backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse shrink-0"></span>
              AI Revenue Infrastructure · Built for B2B
            </span>
          </div>

          <h1
            ref={heroTextRef}
            className="hero-anim text-[clamp(1.875rem,8.5vw,5rem)] font-sans font-bold tracking-tight leading-[1.05] mb-10 sm:mb-12 text-white drop-shadow-2xl will-change-transform flex flex-col"
          >
            <span className="mb-2 pb-2">The definitive AI infrastructure</span>
            <span className="text-white/75 pb-4">for high-performing B2B teams.</span>
          </h1>

          <div className="hero-anim flex items-center">
            {/* Pill CTA — min 44px touch target per iOS HIG */}
            <a
              href="https://cal.com/kishore-clickfieldai/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center flex-wrap bg-white hover:bg-white/90 active:scale-95 transition-all text-black rounded-full pl-5 sm:pl-6 pr-1.5 py-2 sm:py-1.5 border border-white/20 min-h-[44px]" style={{ gap: 'clamp(0.5rem, 2vw, 1rem)' }}
            >
              <span className="font-sans font-medium text-sm tracking-wide">Let's talk</span>
              <div className="flex items-center justify-center bg-black text-white rounded-full w-8 h-8 sm:w-8 sm:h-8 group-hover:translate-x-1 transition-transform shrink-0">
                <ChevronRight size={16} strokeWidth={2.5} />
              </div>
            </a>
          </div>
        </div>
      </main>

      {/* Trust & Client Bar */}
      <section id="customers" ref={trustRef} className="relative z-10 w-full py-12 border-y border-white/5 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 overflow-hidden">
          <p className="text-center text-xs font-semibold text-[#555] tracking-widest uppercase mb-8">
            Generated $250k+ in client revenue
          </p>
          <div className="flex items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500 overflow-hidden relative">
            <div className="animate-marquee gap-16 px-4 items-center">
              {/* Paid Media Lab */}
              <h3 className="font-sans font-black text-xl uppercase tracking-widest shrink-0 flex items-center gap-2 leading-none">
                <span className="text-[11px] border border-current px-1 py-0.5 font-bold">&lt;/&gt;</span> PAID MEDIA LAB
              </h3>
              {/* Blush & Hush */}
              <h3 className="font-serif font-semibold text-xl tracking-tight shrink-0 italic leading-none">Blush &amp; Hush</h3>
              {/* SLAM Fitness */}
              <h3 className="font-sans font-black text-xl tracking-tighter shrink-0 leading-none">
                SL<span className="text-red-500">A</span>M
              </h3>
              {/* Phill K */}
              <h3 className="font-display font-medium text-xl tracking-[0.3em] uppercase shrink-0 leading-none">PHILL K</h3>
              {/* T-mark brand */}
              <h3 className="font-display font-black text-xl tracking-tighter shrink-0 leading-none">T▾</h3>
              {/* California Business Journal */}
              <h3 className="font-serif font-black text-xl tracking-tight uppercase shrink-0 leading-none">California Business Journal</h3>
              {/* Hyundai */}
              <h3 className="font-sans font-bold text-xl tracking-[0.15em] uppercase shrink-0 leading-none">HYUNDAI</h3>

              {/* Loop 2 */}
              <h3 className="font-sans font-black text-xl uppercase tracking-widest shrink-0 flex items-center gap-2 leading-none">
                <span className="text-[11px] border border-current px-1 py-0.5 font-bold">&lt;/&gt;</span> PAID MEDIA LAB
              </h3>
              <h3 className="font-serif font-semibold text-xl tracking-tight shrink-0 italic leading-none">Blush &amp; Hush</h3>
              <h3 className="font-sans font-black text-xl tracking-tighter shrink-0 leading-none">
                SL<span className="text-red-500">A</span>M
              </h3>
              <h3 className="font-display font-medium text-xl tracking-[0.3em] uppercase shrink-0 leading-none">PHILL K</h3>
              <h3 className="font-display font-black text-xl tracking-tighter shrink-0 leading-none">T▾</h3>
              <h3 className="font-serif font-black text-xl tracking-tight uppercase shrink-0 leading-none">California Business Journal</h3>
              <h3 className="font-sans font-bold text-xl tracking-[0.15em] uppercase shrink-0 leading-none">HYUNDAI</h3>
            </div>
          </div>
        </div>
      </section>


      {/* Automatic Marquee Section: Case Studies */}
      <section id="case-studies" className="relative z-10 w-full md:overflow-hidden py-[clamp(3rem,6vw,8rem)] bg-gradient-to-b from-transparent to-white/5">
        <div className="mb-[clamp(3rem,5vw,5rem)] px-6 max-w-7xl mx-auto text-center md:text-left">
          <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-display font-bold mb-6 tracking-tight">AI Case Studies.</h2>
          <p className="text-[clamp(1rem,2vw,1.25rem)] text-[#888888] mb-10 w-full md:w-3/5 leading-relaxed">
            Explore how high-growth organizations deploy our Neural Engine to rewrite their revenue architecture and crush their acquisition targets natively.
          </p>
        </div>

        <div className="animate-marquee slow hover:[animation-play-state:paused] items-center cursor-ew-resize">
          {[1, 2].map((loop) => (
            <div key={loop} className="flex gap-8 shrink-0 px-4 items-center">

              {/* AdRadar Case Study */}
              <div className="w-[78vw] sm:w-[55vw] md:w-[38vw] xl:w-[26vw] shrink-0 glass-panel p-5 sm:p-6 lg:p-8 rounded-2xl flex flex-col justify-between group hover:border-[#00f0ff]/70 transition-all duration-500 overflow-hidden relative border-[#00f0ff]/30">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" alt="Data Analytics Visualization" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-50 transition-opacity duration-700 mix-blend-luminosity grayscale pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none"></div>

                <div className="relative z-10 flex flex-col gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#00f0ff]/40 bg-[#00f0ff]/10 text-[10px] font-semibold uppercase tracking-widest text-[#00f0ff] backdrop-blur-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse"></span>
                      Intent Lead Outbound
                    </div>
                    <span className="text-[10px] font-mono text-[#555] tracking-widest uppercase">ADradar</span>
                  </div>
                  <h3 className="text-[clamp(1.1rem,2.2vw,1.5rem)] font-display font-bold tracking-tight leading-snug text-white">
                    4 Qualified Meetings Every Week.
                  </h3>
                  <p className="text-[#888888] text-[clamp(0.75rem,1.2vw,0.875rem)] leading-relaxed">
                    A fractional paid media consultancy transformed into a predictable, automated meeting machine using AI-driven lead intelligence.
                  </p>
                  <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4 mt-1">
                    <div>
                      <div className="text-[clamp(1.25rem,2.5vw,1.75rem)] font-display font-bold text-[#00f0ff] mb-0.5">4×</div>
                      <div className="text-[10px] text-[#888888] font-medium uppercase tracking-wider leading-tight">Meetings/Wk</div>
                    </div>
                    <div>
                      <div className="text-[clamp(1.25rem,2.5vw,1.75rem)] font-display font-bold text-white mb-0.5">0h</div>
                      <div className="text-[10px] text-[#888888] font-medium uppercase tracking-wider leading-tight">Research Time</div>
                    </div>
                    <div>
                      <div className="text-[clamp(1.25rem,2.5vw,1.75rem)] font-display font-bold text-white mb-0.5">48h</div>
                      <div className="text-[10px] text-[#888888] font-medium uppercase tracking-wider leading-tight">First Lead</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-gradient-to-br from-[#00f0ff]/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
              </div>

              {/* Case Study 1 */}
              <div className="w-[78vw] sm:w-[55vw] md:w-[38vw] xl:w-[26vw] shrink-0 glass-panel p-5 sm:p-6 lg:p-8 rounded-2xl flex flex-col justify-between group hover:border-[#00f0ff]/50 transition-all duration-500 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80" alt="Real Estate Property Architecture" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-50 transition-opacity duration-700 mix-blend-luminosity grayscale pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none"></div>

                <div className="relative z-10 flex flex-col gap-3">
                  <div className="inline-block px-3 py-1 rounded-full border border-white/10 bg-black/50 text-[10px] font-semibold uppercase tracking-widest text-[#00f0ff] group-hover:bg-[#00f0ff]/10 transition-colors backdrop-blur-md w-fit">
                    AI Inbox Intelligence System
                  </div>
                  <h3 className="text-[clamp(1.1rem,2.2vw,1.5rem)] font-display font-bold tracking-tight leading-snug text-white">Inbox to viewing in 30 seconds.</h3>
                  <p className="text-[#888888] text-[clamp(0.75rem,1.2vw,0.875rem)] leading-relaxed">
                    We install an intelligent system into your email that instantly qualifies buyers and books viewings 24/7 without you touching your phone.
                  </p>
                  <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4 mt-1">
                    <div>
                      <div className="text-[clamp(1.4rem,2.8vw,2rem)] font-display font-bold text-white mb-0.5">&lt;30s</div>
                      <div className="text-[10px] text-[#888888] font-medium uppercase tracking-wider leading-tight">Response Time</div>
                    </div>
                    <div>
                      <div className="text-[clamp(1.4rem,2.8vw,2rem)] font-display font-bold text-white mb-0.5">21x</div>
                      <div className="text-[10px] text-[#888888] font-medium uppercase tracking-wider leading-tight">Conversion Rate</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-gradient-to-br from-[#00f0ff]/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
              </div>

              {/* Case Study 2 */}
              <div className="w-[78vw] sm:w-[55vw] md:w-[38vw] xl:w-[26vw] shrink-0 glass-panel p-5 sm:p-6 lg:p-8 rounded-2xl flex flex-col justify-between group hover:border-[#0055ff]/50 transition-all duration-500 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1639322537231-2f206e06af84?auto=format&fit=crop&w=800&q=80" alt="Abstract 3D Structures" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-50 transition-opacity duration-700 mix-blend-luminosity grayscale pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none"></div>

                <div className="relative z-10 flex flex-col gap-3">
                  <div className="inline-block px-3 py-1 rounded-full border border-white/10 bg-black/50 text-[10px] font-semibold uppercase tracking-widest text-[#0055ff] group-hover:bg-[#0055ff]/10 transition-colors backdrop-blur-md w-fit">
                    FinTech Series B
                  </div>
                  <h3 className="text-[clamp(1.1rem,2.2vw,1.5rem)] font-display font-bold tracking-tight leading-snug text-white">Zero-Touch SDR Automation</h3>
                  <p className="text-[#888888] text-[clamp(0.75rem,1.2vw,0.875rem)] leading-relaxed">
                    Replaced an underperforming 5-person outbound team with our Neural Architecture. 48 qualified meetings in the first 30 days.
                  </p>
                  <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4 mt-1">
                    <div>
                      <div className="text-[clamp(1.4rem,2.8vw,2rem)] font-display font-bold text-white mb-0.5">48</div>
                      <div className="text-[10px] text-[#888888] font-medium uppercase tracking-wider leading-tight">Net New Meetings</div>
                    </div>
                    <div>
                      <div className="text-[clamp(1.4rem,2.8vw,2rem)] font-display font-bold text-white mb-0.5">0</div>
                      <div className="text-[10px] text-[#888888] font-medium uppercase tracking-wider leading-tight">Manual SDRs</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-bl from-[#0055ff]/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
              </div>

              {/* Case Study 3 */}
              <div className="w-[78vw] sm:w-[55vw] md:w-[38vw] xl:w-[26vw] shrink-0 glass-panel p-5 sm:p-6 lg:p-8 rounded-2xl flex flex-col justify-between group hover:border-white/40 transition-all duration-500 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80" alt="Abstract Network Architecture" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-50 transition-opacity duration-700 mix-blend-luminosity grayscale pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none"></div>

                <div className="relative z-10 flex flex-col gap-3">
                  <div className="inline-block px-3 py-1 rounded-full border border-white/10 bg-black/50 text-[10px] font-semibold uppercase tracking-widest text-white group-hover:bg-white/10 transition-colors backdrop-blur-md w-fit">
                    Enterprise Operations
                  </div>
                  <h3 className="text-[clamp(1.1rem,2.2vw,1.5rem)] font-display font-bold tracking-tight leading-snug text-white">E2E Client Onboarding System</h3>
                  <p className="text-[#888888] text-[clamp(0.75rem,1.2vw,0.875rem)] leading-relaxed">
                    Replaced a fragmented 3-week manual setup with a continuous AI workflow that generates contracts, collects assets, and provisions spaces automatically.
                  </p>
                  <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4 mt-1">
                    <div>
                      <div className="text-[clamp(1.4rem,2.8vw,2rem)] font-display font-bold text-white mb-0.5">0 Days</div>
                      <div className="text-[10px] text-[#888888] font-medium uppercase tracking-wider leading-tight">Time to Onboard</div>
                    </div>
                    <div>
                      <div className="text-[clamp(1.4rem,2.8vw,2rem)] font-display font-bold text-white mb-0.5">100%</div>
                      <div className="text-[10px] text-[#888888] font-medium uppercase tracking-wider leading-tight">Admin Eliminated</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
              </div>

            </div>
          ))}
        </div>
      </section>
      {/* AI Systems Services Section */}
      <section id="services" className="relative z-10 w-full py-16 sm:py-20 px-4 sm:px-6 bg-black overflow-hidden">

        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[50vw] h-[40vw] rounded-full bg-[#0055ff]/5 blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[40vw] h-[30vw] rounded-full bg-[#00f0ff]/4 blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">

          {/* Heading block */}
          <div className="text-center mb-[clamp(2rem,5vw,5rem)]">
            <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-display font-bold tracking-tight text-white mb-6 leading-[1.1]">
              AI Systems Built for<br />
              <span className="text-gradient">Revenue & Operational Scale</span>
            </h2>
            <p className="text-[#888] text-[clamp(0.9rem,1.5vw,1.125rem)] font-sans max-w-2xl mx-auto leading-relaxed">
              We design and deploy AI infrastructure that removes operational bottlenecks, unlocks new growth channels, and creates measurable business leverage.
            </p>
          </div>

          {/* Two-column cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Card 1 — Service Businesses */}
            <div className="group relative bg-[#0a0a0a] border border-white/[0.07] hover:border-[#00f0ff]/25 rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col transition-all duration-500 cursor-pointer hover:shadow-[0_0_60px_-15px_rgba(0,240,255,0.2)]">
              {/* Dot grid */}
              <div className="absolute inset-0 rounded-2xl opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #00f0ff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
              {/* Top glow on hover */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00f0ff]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl" />

              {/* Card header */}
              <div className="mb-2">
                <span className="text-[10px] font-mono text-[#00f0ff]/60 tracking-[0.3em] uppercase">For Service Businesses</span>
              </div>
              <h3 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">
                Revenue & Client<br />Acquisition Systems
              </h3>
              <p className="text-[#555] text-xs font-mono tracking-widest uppercase mb-6">Project-Based Engagement</p>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-[#00f0ff]/20 via-white/5 to-transparent mb-8" />

              {/* Feature list */}
              <ul className="flex flex-col gap-4 mb-10 flex-1">
                {[
                  'AI outbound infrastructure for consistent client acquisition (email, LinkedIn, and multi-channel outreach engines)',
                  'Lead reactivation systems that automatically revive dormant prospects and convert old leads into booked opportunities',
                  'AI inbound qualification agents that analyze inquiries and filter high-intent prospects before they reach your team',
                  'Proposal & sales process automation that generates tailored proposals and follow-ups based on client conversations',
                  'Client onboarding automation systems that handle project kickoff, documentation, and workflow setup',
                  'Operational AI copilots that assist teams in research, content generation, and decision support',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 group/item">
                    <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full border border-[#00f0ff]/30 group-hover:border-[#00f0ff]/80 flex items-center justify-center transition-colors duration-300" style={{ transitionDelay: `${i * 40}ms` }}>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4L3.5 6L6.5 2" stroke="#00f0ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                      </svg>
                    </span>
                    <span className="text-[#aaa] group-hover:text-[#ccc] text-sm leading-[1.7] transition-colors duration-300">{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a href="https://cal.com/kishore-clickfieldai/30min" target="_blank" rel="noopener noreferrer" className="w-full h-14 rounded-xl bg-white/5 hover:bg-[#00f0ff]/10 border border-white/10 hover:border-[#00f0ff]/40 text-white text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all duration-300 group/btn">
                Get Started
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover/btn:translate-x-1 transition-transform duration-300">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            {/* Card 2 — Enterprise */}
            <div className="group relative bg-[#0a0a0a] border border-white/[0.07] hover:border-[#4488ff]/25 rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col transition-all duration-500 cursor-pointer hover:shadow-[0_0_60px_-15px_rgba(0,85,255,0.25)]">
              <div className="absolute inset-0 rounded-2xl opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #4488ff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4488ff]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl" />

              <div className="mb-2">
                <span className="text-[10px] font-mono text-[#4488ff]/60 tracking-[0.3em] uppercase">For Enterprise Businesses</span>
              </div>
              <h3 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">
                Enterprise AI<br />Infrastructure
              </h3>
              <p className="text-[#555] text-xs font-mono tracking-widest uppercase mb-6">Contract-Based Engagement</p>

              <div className="h-px bg-gradient-to-r from-[#4488ff]/20 via-white/5 to-transparent mb-8" />

              <ul className="flex flex-col gap-4 mb-10 flex-1">
                {[
                  'Custom AI agents for operational workflows that execute multi-step business processes across internal tools',
                  'AI knowledge systems trained on company documentation, SOPs, and internal data for instant decision support',
                  'Workflow orchestration infrastructure connecting CRMs, internal systems, and databases into autonomous AI processes',
                  'AI-powered data analysis engines that process large operational datasets and surface strategic insights',
                  'Intelligent process automation replacing repetitive internal operations with AI-driven execution',
                  'Custom AI deployments built around your organization\'s specific operational bottlenecks',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 group/item">
                    <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full border border-[#4488ff]/30 group-hover:border-[#4488ff]/80 flex items-center justify-center transition-colors duration-300" style={{ transitionDelay: `${i * 40}ms` }}>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4L3.5 6L6.5 2" stroke="#4488ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                      </svg>
                    </span>
                    <span className="text-[#aaa] group-hover:text-[#ccc] text-sm leading-[1.7] transition-colors duration-300">{item}</span>
                  </li>
                ))}
              </ul>

              <a href="https://cal.com/kishore-clickfieldai/30min" target="_blank" rel="noopener noreferrer" className="w-full h-14 rounded-xl bg-white/5 hover:bg-[#4488ff]/10 border border-white/10 hover:border-[#4488ff]/40 text-white text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all duration-300 group/btn">
                Get Started
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover/btn:translate-x-1 transition-transform duration-300">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 w-full py-16 sm:py-20 px-4 sm:px-6 bg-black overflow-hidden">

        <div className="max-w-6xl mx-auto relative z-10">

          {/* Heading */}
          <div className="text-center mb-[clamp(3rem,5vw,5rem)]">
            <h2 className="text-[clamp(2.5rem,6vw,6rem)] font-display font-bold tracking-tight mb-5">
              <span className="text-white">How It </span>
              <span className="text-gradient">Works</span>
            </h2>
            <p className="text-[#888] text-base font-sans tracking-widest uppercase font-medium">
              Our Simple 3-Step Implementation Process
            </p>
          </div>

          {/* Roadmap — horizontal */}
          <div className="relative">

            {/* Horizontal connector line (desktop only) */}
            <div className="hidden md:block absolute top-8 left-[calc(16.666%+2rem)] right-[calc(16.666%+2rem)] h-px bg-gradient-to-r from-[#00f0ff]/40 via-[#0055ff]/30 to-white/15" />

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 how-it-works-cards">

              {/* Step 1 */}
              <div className="how-it-works-card flex flex-col items-center group">
                {/* Node */}
                <div className="relative z-10 mb-6 w-16 h-16 rounded-full glass-panel border border-[#00f0ff]/30 group-hover:border-[#00f0ff]/70 flex items-center justify-center transition-all duration-500 group-hover:shadow-[0_0_24px_-4px_rgba(0,240,255,0.5)]">
                  <span className="text-[#00f0ff] font-display font-bold text-lg">01</span>
                </div>
                {/* Card */}
                <div className="w-full flex-1 glass-panel rounded-[2rem] p-8 flex flex-col justify-between group-hover:border-[#00f0ff]/40 transition-all duration-500 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]" />
                  <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-gradient-to-br from-[#00f0ff]/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-black/50 text-xs font-semibold uppercase tracking-widest text-[#00f0ff] mb-5 group-hover:bg-[#00f0ff]/10 transition-colors backdrop-blur-md">
                      Step 01 · Discovery
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-3 tracking-tight leading-snug text-white">Discovery Call</h3>
                    <p className="text-[#888888] leading-relaxed text-sm">
                      A strategic deep-dive into your business operations, workflows, and bottlenecks. We identify high-impact opportunities where AI automation can reduce manual work, increase efficiency, and unlock scalable growth.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6 mt-6 relative z-10">
                    <div>
                      <div className="text-xl font-display font-bold text-white mb-1">60 min</div>
                      <div className="text-xs text-[#888888] font-medium uppercase tracking-wider">Session Length</div>
                    </div>
                    <div>
                      <div className="text-xl font-display font-bold text-white mb-1">Free</div>
                      <div className="text-xs text-[#888888] font-medium uppercase tracking-wider">No Commitment</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="how-it-works-card flex flex-col items-center group">
                <div className="relative z-10 mb-6 w-16 h-16 rounded-full glass-panel border border-[#4488ff]/30 group-hover:border-[#4488ff]/70 flex items-center justify-center transition-all duration-500 group-hover:shadow-[0_0_24px_-4px_rgba(68,136,255,0.5)]">
                  <span className="text-[#4488ff] font-display font-bold text-lg">02</span>
                </div>
                <div className="w-full flex-1 glass-panel rounded-[2rem] p-8 flex flex-col justify-between group-hover:border-[#0055ff]/40 transition-all duration-500 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0055ff]/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]" />
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-bl from-[#0055ff]/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-black/50 text-xs font-semibold uppercase tracking-widest text-[#4488ff] mb-5 group-hover:bg-[#4488ff]/10 transition-colors backdrop-blur-md">
                      Step 02 · Build
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-3 tracking-tight leading-snug text-white">Custom AI Architecture</h3>
                    <p className="text-[#888888] leading-relaxed text-sm">
                      We design a tailored AI automation system based on your business needs — integrating tools, workflows, and intelligent agents that fit seamlessly into your existing operations.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6 mt-6 relative z-10">
                    <div>
                      <div className="text-xl font-display font-bold text-white mb-1">1–2 wks</div>
                      <div className="text-xs text-[#888888] font-medium uppercase tracking-wider">Build Timeline</div>
                    </div>
                    <div>
                      <div className="text-xl font-display font-bold text-white mb-1">100%</div>
                      <div className="text-xs text-[#888888] font-medium uppercase tracking-wider">Custom Built</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="how-it-works-card flex flex-col items-center group">
                <div className="relative z-10 mb-6 w-16 h-16 rounded-full glass-panel border border-white/20 group-hover:border-white/50 flex items-center justify-center transition-all duration-500 group-hover:shadow-[0_0_24px_-4px_rgba(255,255,255,0.25)]">
                  <span className="text-white/70 group-hover:text-white font-display font-bold text-lg transition-colors duration-300">03</span>
                </div>
                <div className="w-full flex-1 glass-panel rounded-[2rem] p-8 flex flex-col justify-between group-hover:border-white/30 transition-all duration-500 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]" />
                  <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-black/50 text-xs font-semibold uppercase tracking-widest text-white mb-5 group-hover:bg-white/10 transition-colors backdrop-blur-md">
                      Step 03 · Launch
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-3 tracking-tight leading-snug text-white">Enterprise Deployment</h3>
                    <p className="text-[#888888] leading-relaxed text-sm">
                      Your automation system is implemented, tested, and deployed into your business environment — delivering reliable, scalable AI infrastructure that works continuously behind the scenes.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6 mt-6 relative z-10">
                    <div>
                      <div className="text-xl font-display font-bold text-white mb-1">24/7</div>
                      <div className="text-xs text-[#888888] font-medium uppercase tracking-wider">Always On</div>
                    </div>
                    <div>
                      <div className="text-xl font-display font-bold text-white mb-1">Ongoing</div>
                      <div className="text-xs text-[#888888] font-medium uppercase tracking-wider">Support Included</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <FAQSection />

      {/* Schedule a Call CTA */}
      <section className="relative z-10 w-full bg-black overflow-hidden">

        {/* Top rule */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-24 md:py-32">

          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-0 left-1/3 w-[40vw] h-[20vw] rounded-full bg-[#00f0ff]/4 blur-[120px]" />
          </div>
          {/* LET'S TALK display heading */}
          <div className="relative z-10 mb-[clamp(2.5rem,5vw,5rem)]">
            <p className="text-[11px] font-mono text-[#00f0ff]/50 tracking-[0.35em] uppercase mb-4">// Ready to begin?</p>
            <h2 className="text-[clamp(2.75rem,12vw,8rem)] font-display font-black leading-none tracking-tighter">
              <span className="text-white">LET'S </span><span className="text-gradient">TALK.</span>
            </h2>
          </div>

          {/* Split layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start relative z-10">

            {/* Left — what you'll get */}
            <div className="flex flex-col gap-0">
              <p className="text-[11px] font-mono text-[#00f0ff]/60 tracking-[0.35em] uppercase mb-8">// What you'll get</p>

              {[
                { title: 'A clear AI roadmap', sub: 'Mapped to your exact business model' },
                { title: 'Bottleneck diagnosis', sub: 'We pinpoint where time and money leak' },
                { title: 'System recommendations', sub: 'Tools and workflows tailored to your ops' },
                { title: 'Zero pressure', sub: 'Just a focused, strategic conversation' },
              ].map(({ title, sub }, i) => (
                <div key={i} className={`flex items-start gap-5 py-7 ${i < 3 ? 'border-b border-white/[0.08]' : ''}`}>
                  <span className="mt-1 text-[#00f0ff] text-xl leading-none shrink-0">✦</span>
                  <div>
                    <div className="text-white font-semibold text-lg font-display mb-1">{title}</div>
                    <div className="text-[#555] text-sm font-mono tracking-wide">{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — heading, body, CTA */}
            <div className="flex flex-col gap-8">
              <div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight leading-snug mb-4">
                  Schedule a Call with Clickfield AI
                </h3>
                <p className="text-[#888] font-sans leading-relaxed text-base">
                  A quick conversation to explore how AI systems and automation infrastructure can help streamline your operations and unlock new growth opportunities.
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/[0.08]" />

              {/* Stat row */}
              <div className="flex flex-wrap" style={{ gap: 'clamp(1rem, 4vw, 2rem)' }}>
                <div>
                  <div className="text-xl font-display font-bold text-white mb-0.5">30 min</div>
                  <div className="text-xs font-mono text-[#555] uppercase tracking-widest">Discovery call</div>
                </div>
                <div>
                  <div className="text-xl font-display font-bold text-white mb-0.5">Free</div>
                  <div className="text-xs font-mono text-[#555] uppercase tracking-widest">No commitment</div>
                </div>
              </div>

              {/* CTA */}
              <a
                href="https://cal.com/kishore-clickfieldai/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn w-full sm:w-auto self-start flex items-center justify-center gap-4 px-8 py-4 rounded-2xl bg-white text-black font-bold text-base tracking-wide hover:bg-[#00f0ff] active:scale-95 transition-all duration-300 hover:shadow-[0_0_40px_-8px_rgba(0,240,255,0.7)] min-h-[52px]"
              >
                Book a Growth Mapping Call
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="group-hover/btn:translate-x-1 transition-transform duration-300">
                  <path d="M3.5 9h11M10 4.5L14.5 9 10 13.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

          </div>
        </div>

        {/* Bottom rule */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>


      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 pt-[clamp(3rem,8vw,8rem)] overflow-hidden bg-black text-center safe-bottom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center mb-16 sm:mb-24 relative z-10">
          <div className="flex items-center justify-center mb-8 w-full">
            <h2 className="text-[clamp(2.5rem,8vw,8rem)] font-display font-bold tracking-tighter leading-none text-white">CLICKFIELDAI</h2>
          </div>

          <button
            className="flex w-14 h-14 rounded-full border border-white/20 items-center justify-center text-[#888888] hover:text-white hover:border-white active:scale-95 transition-all cursor-pointer z-50 pointer-events-auto"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to top"
          >
            ↑
          </button>
        </div>
        <div className="text-center text-[#555] text-xs font-mono pb-4 px-4">
          © {new Date().getFullYear()} ClickfieldAI. Remote global engine.
        </div>
      </footer>

    </div >
  );
}

const faqs = [
  {
    q: 'What kind of businesses do you typically work with?',
    a: 'We work with a wide range of companies, including service businesses, B2B companies, D2C brands, and enterprise organizations looking to integrate AI into their operations. Our focus is on businesses that want to improve client acquisition, streamline workflows, and deploy intelligent systems that support scalable growth. Whether it\'s a growing company seeking automation for sales and operations, or an enterprise team building AI infrastructure across departments, we design solutions tailored to their specific challenges.'
  },
  {
    q: 'What types of AI systems do you build?',
    a: 'We build customized AI systems designed to solve operational and growth challenges. This includes AI-powered client acquisition systems, lead intelligence platforms, workflow automation infrastructure, AI knowledge systems trained on company data, and autonomous AI agents capable of executing multi-step operational tasks across business tools.'
  },
  {
    q: 'Do you use existing tools or build custom solutions?',
    a: 'We use a hybrid approach. Our systems combine proven AI tools, APIs, and automation frameworks with custom architecture designed specifically for your business workflows. The goal is not simply connecting tools, but creating a reliable AI infrastructure layer that supports your operations long-term.'
  },
  {
    q: 'How does the implementation process work?',
    a: 'Our process typically follows three stages: discovery, customization, and deployment. First, we analyze your current workflows and identify high-impact opportunities for AI integration. Next, we design a tailored AI architecture based on your business needs. Finally, we implement and deploy the system within your existing environment.'
  },
  {
    q: 'How long does it take to deploy an AI system?',
    a: 'Deployment timelines depend on the complexity of the system. Smaller operational systems can be implemented within a few weeks, while larger enterprise-level AI infrastructure may require additional time for integrations, testing, and customization.'
  },
  {
    q: 'Will the AI systems integrate with our existing tools?',
    a: 'Yes. Our systems are designed to integrate with common business platforms such as CRMs, databases, communication tools, marketing platforms, and operational software. The goal is to enhance your existing technology stack rather than replace it.'
  },
  {
    q: 'Do you provide support after deployment?',
    a: 'Yes. After deployment, we provide ongoing support to ensure systems remain optimized, reliable, and aligned with your business operations. This includes monitoring performance, making improvements, and expanding automation capabilities as your company grows.'
  },
  {
    q: 'How do you ensure data security and confidentiality?',
    a: 'We prioritize security and confidentiality throughout every implementation. Systems can be deployed within your existing infrastructure or secure environments, and we follow strict data handling practices to ensure sensitive company information remains protected.'
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className="relative z-10 w-full py-16 sm:py-20 px-4 sm:px-6 bg-black overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[30vw] rounded-full bg-[#00f0ff]/3 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Heading */}
        <div className="text-center mb-[clamp(2.5rem,5vw,4rem)]">
          <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-display font-bold tracking-tight text-white mb-5">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-[#888] text-lg font-sans max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about our AI automation systems, implementation process, and how we work with businesses.
          </p>
        </div>

        {/* Accordion container */}
        <div className="bg-[#0a0a0a] border border-white/[0.07] rounded-2xl overflow-hidden divide-y divide-white/[0.06]">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`group transition-colors duration-300 ${isOpen ? 'bg-[#0f0f0f]' : 'hover:bg-[#0d0d0d]'}`}
              >
                {/* Question row */}
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-8 py-5 sm:py-6 text-left cursor-pointer min-h-[56px]"
                >
                  <span className={`text-sm md:text-base font-sans font-medium transition-colors duration-300 ${isOpen ? 'text-white' : 'text-[#bbb] group-hover:text-white'}`}>
                    {faq.q}
                  </span>
                  {/* +/× icon */}
                  <span className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 ${isOpen ? 'border-[#00f0ff]/50 bg-[#00f0ff]/10 rotate-45' : 'border-white/15 group-hover:border-white/30'}`}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1v10M1 6h10" stroke={isOpen ? '#00f0ff' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" className="transition-colors duration-300" />
                    </svg>
                  </span>
                </button>

                {/* Answer — CSS max-height transition */}
                <div
                  className="overflow-hidden transition-all duration-500 ease-in-out"
                  style={{ maxHeight: isOpen ? '500px' : '0px', opacity: isOpen ? 1 : 0 }}
                >
                  <div className={`px-5 sm:px-8 pb-6 sm:pb-7 border-l-2 ml-5 sm:ml-8 ${isOpen ? 'border-[#00f0ff]/30' : 'border-transparent'} transition-colors duration-300`}>
                    <p className="text-[#888] text-sm leading-[1.9] font-sans">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section >
  );
}
