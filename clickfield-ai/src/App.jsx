import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Zap, ShieldCheck, ChevronRight, Hash } from 'lucide-react';
import Beams from './Beams';
import { ShaderAnimation } from './components/ui/ShaderAnimation';
import { FallingPattern } from './components/ui/FallingPattern';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const heroRef = useRef(null);
  const fluidBlob1 = useRef(null);
  const fluidBlob2 = useRef(null);
  const horizontalSectionRef = useRef(null);
  const horizontalScrollRef = useRef(null);
  const trustRef = useRef(null);
  const headerRef = useRef(null);

  // Refs for elements that track the mouse
  const heroTextRef = useRef(null);
  const heroSubtextRef = useRef(null);
  const heroWaveRef = useRef(null);

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
    gsap.to(fluidBlob1.current, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    gsap.to(fluidBlob2.current, {
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
    // Smooth quickTo animations for near-instant rendering
    const xToHeroText = gsap.quickTo(heroTextRef.current, "x", { duration: 0.8, ease: "power3" });
    const yToHeroText = gsap.quickTo(heroTextRef.current, "y", { duration: 0.8, ease: "power3" });

    const xToHeroSubtext = gsap.quickTo(heroSubtextRef.current, "x", { duration: 1.2, ease: "power3" });
    const yToHeroSubtext = gsap.quickTo(heroSubtextRef.current, "y", { duration: 1.2, ease: "power3" });

    const xToHeroWave = gsap.quickTo(heroWaveRef.current, "x", { duration: 1.5, ease: "power2" });
    const yToHeroWave = gsap.quickTo(heroWaveRef.current, "y", { duration: 1.5, ease: "power2" });

    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();

      // Calculate mouse position relative to center of the hero section (-1 to 1)
      const x = (e.clientX - left - width / 2) / (width / 2);
      const y = (e.clientY - top - height / 2) / (height / 2);

      // Apply subtle movement based on position. Different elements move at different speeds for depth
      xToHeroText(x * 30);
      yToHeroText(y * 30);

      xToHeroSubtext(x * 15);
      yToHeroSubtext(y * 15);

      if (heroWaveRef.current) {
        xToHeroWave(-x * 40); // Parallax opposite to mouse
        yToHeroWave(-y * 20);
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);

      // Reset position when mouse leaves the section
      heroElement.addEventListener('mouseleave', () => {
        xToHeroText(0); yToHeroText(0);
        xToHeroSubtext(0); yToHeroSubtext(0);
        xToHeroWave(0); yToHeroWave(0);
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
        <div ref={fluidBlob1} className="absolute blur-[120px] rounded-full w-[40vw] h-[40vw] bg-[#00f0ff] opacity-20 -top-[10%] -left-[10%] mix-blend-screen"></div>
        <div ref={fluidBlob2} className="absolute blur-[120px] rounded-full w-[50vw] h-[50vw] bg-[#0055ff] opacity-20 top-[40%] -right-[10%] mix-blend-screen"></div>
      </div>

      {/* Floating Header */}
      <header className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-4 mix-blend-difference pointer-events-none">
        <nav ref={headerRef} className="glass-panel rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl backdrop-blur-xl pointer-events-auto">
          <div className="flex items-center cursor-pointer">
            <span className="font-display font-bold tracking-tight text-white whitespace-nowrap">CLICKFIELDAI</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#888888]">
            <a href="#platform" className="hover:text-white transition-colors">Platform</a>
            <a href="#case-studies" className="hover:text-white transition-colors">Case Studies</a>
            <a href="#customers" className="hover:text-white transition-colors">Customers</a>
          </div>

          <a href="https://cal.com/kishore-clickfieldai/30min" target="_blank" rel="noopener noreferrer" className="hidden sm:flex text-sm font-semibold bg-white text-black px-5 py-2 rounded-full hover:bg-gray-200 transition-colors">
            Init Pipeline
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <main id="platform" ref={heroRef} className="relative z-10 min-h-[85vh] flex flex-col justify-end pb-20 px-6 md:px-12 lg:px-24 overflow-hidden bg-black">

        {/* Colorful Glow Blobs matching site theme */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50 mix-blend-screen">
          <div ref={fluidBlob1} className="blob blob-1 mix-blend-screen"></div>
          <div ref={fluidBlob2} className="blob blob-2 mix-blend-screen"></div>
        </div>

        {/* Cinematic Curtain Background */}
        <div 
          className="absolute top-0 left-0 w-full h-[65vh] flex overflow-hidden opacity-30 pointer-events-none" 
          style={{ maskImage: 'linear-gradient(to bottom, #000000 0%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, #000000 0%, transparent 100%)' }}
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <div 
              key={i} 
              className="flex-1 h-full" 
              style={{ background: 'linear-gradient(90deg, #111 0%, #aaa 50%, #111 100%)' }} 
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full flex flex-col items-start mt-24">
          <h1 
            ref={heroTextRef} 
            className="hero-anim text-[10vw] md:text-[6vw] lg:text-[5.5vw] font-sans font-bold tracking-tight leading-[1.05] mb-12 text-gradient drop-shadow-2xl will-change-transform flex flex-col"
          >
            <span className="mb-2 pb-2">The definitive AI infrastructure</span>
            <span className="text-white/80 pb-4">for high-performing B2B teams.</span>
          </h1>

          <div className="hero-anim flex items-center">
            {/* Minimal Pill Button */}
            <a 
              href="https://cal.com/kishore-clickfieldai/30min" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex items-center gap-4 bg-white hover:bg-white/90 transition-colors text-black rounded-full pl-6 pr-1.5 py-1.5 border border-white/20"
            >
              <span className="font-sans font-medium text-sm tracking-wide">Let's talk</span>
              <div className="flex items-center justify-center bg-black text-white rounded-full w-8 h-8 group-hover:translate-x-1 transition-transform">
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
            <div className="animate-marquee gap-16 px-4">
              {/* Paid Media Lab */}
              <h3 className="font-sans font-black text-xl uppercase tracking-widest shrink-0 flex items-center gap-2">
                <span className="text-[11px] border border-current px-1 py-0.5 font-bold">&lt;/&gt;</span> PAID MEDIA LAB
              </h3>
              {/* Blush & Hush */}
              <h3 className="font-serif font-semibold text-2xl tracking-tight shrink-0 italic">Blush &amp; Hush</h3>
              {/* SLAM Fitness */}
              <h3 className="font-sans font-black text-3xl tracking-tighter shrink-0">
                SL<span className="text-red-500">A</span>M
              </h3>
              {/* Phill K */}
              <h3 className="font-display font-medium text-xl tracking-[0.3em] uppercase shrink-0">PHILL K</h3>
              {/* T-mark brand */}
              <h3 className="font-display font-black text-3xl tracking-tighter shrink-0">T▾</h3>
              {/* California Business Journal */}
              <h3 className="font-serif font-black text-xl tracking-tight uppercase shrink-0">California Business Journal</h3>
              {/* Hyundai */}
              <h3 className="font-sans font-bold text-2xl tracking-[0.15em] uppercase shrink-0">HYUNDAI</h3>

              {/* Loop 2 */}
              <h3 className="font-sans font-black text-xl uppercase tracking-widest shrink-0 flex items-center gap-2 ml-8">
                <span className="text-[11px] border border-current px-1 py-0.5 font-bold">&lt;/&gt;</span> PAID MEDIA LAB
              </h3>
              <h3 className="font-serif font-semibold text-2xl tracking-tight shrink-0 italic">Blush &amp; Hush</h3>
              <h3 className="font-sans font-black text-3xl tracking-tighter shrink-0">
                SL<span className="text-red-500">A</span>M
              </h3>
              <h3 className="font-display font-medium text-xl tracking-[0.3em] uppercase shrink-0">PHILL K</h3>
              <h3 className="font-display font-black text-3xl tracking-tighter shrink-0">T▾</h3>
              <h3 className="font-serif font-black text-xl tracking-tight uppercase shrink-0">California Business Journal</h3>
              <h3 className="font-sans font-bold text-2xl tracking-[0.15em] uppercase shrink-0">HYUNDAI</h3>
            </div>
          </div>
        </div>
      </section>


      {/* Automatic Marquee Section: Case Studies */}
      <section id="case-studies" className="relative z-10 w-full overflow-hidden py-32 bg-gradient-to-b from-transparent to-white/5">
        <div className="mb-20 px-6 max-w-7xl mx-auto text-center md:text-left">
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight">AI Case Studies.</h2>
          <p className="text-xl text-[#888888] mb-10 w-full md:w-3/5 leading-relaxed">
            Explore how high-growth organizations deploy our Neural Engine to rewrite their revenue architecture and crush their acquisition targets natively.
          </p>
        </div>

        <div className="animate-marquee slow hover:[animation-play-state:paused] items-center cursor-ew-resize">
          {[1, 2].map((loop) => (
            <div key={loop} className="flex gap-8 shrink-0 px-4 items-center">

              {/* AdRadar Case Study */}
              <div className="w-[85vw] md:w-[45vw] xl:w-[32vw] h-[65vh] shrink-0 glass-panel p-10 lg:p-14 rounded-[2.5rem] flex flex-col justify-between group hover:border-[#00f0ff]/70 transition-all duration-500 overflow-hidden relative border-[#00f0ff]/30">
                {/* Background Image Layer */}
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" alt="Data Analytics Visualization" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-opacity duration-700 mix-blend-luminosity grayscale pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none"></div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00f0ff]/40 bg-[#00f0ff]/10 text-xs font-semibold uppercase tracking-widest text-[#00f0ff] backdrop-blur-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse"></span>
                      Intent Lead Outbound System
                    </div>
                    <span className="text-[10px] font-mono text-[#555] tracking-widest uppercase">ADradar</span>
                  </div>

                  <h3 className="text-3xl lg:text-4xl font-display font-bold mb-3 tracking-tight leading-snug text-white">
                    4 Qualified Meetings<br />Every Week.
                  </h3>
                  <p className="text-[#888888] leading-relaxed mb-4 text-base flex-1">
                    A fractional paid media consultancy with zero outbound pipeline — transformed into a predictable, automated meeting machine using AdRadar's AI-driven lead intelligence system.
                  </p>

                  <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-5 mb-6">
                    <div>
                      <div className="text-3xl font-display font-bold text-[#00f0ff] mb-1">4×</div>
                      <div className="text-[10px] text-[#888888] font-medium uppercase tracking-wider">Meetings/Wk</div>
                    </div>
                    <div>
                      <div className="text-3xl font-display font-bold text-white mb-1">0h</div>
                      <div className="text-[10px] text-[#888888] font-medium uppercase tracking-wider">Research Time</div>
                    </div>
                    <div>
                      <div className="text-3xl font-display font-bold text-white mb-1">48h</div>
                      <div className="text-[10px] text-[#888888] font-medium uppercase tracking-wider">To First Lead</div>
                    </div>
                  </div>
                </div>
                {/* Abstract geometry block in background */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-br from-[#00f0ff]/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
              </div>

              {/* Case Study 1 */}
              <div className="w-[85vw] md:w-[45vw] xl:w-[32vw] h-[65vh] shrink-0 glass-panel p-10 lg:p-14 rounded-[2.5rem] flex flex-col justify-between group hover:border-[#00f0ff]/50 transition-all duration-500 overflow-hidden relative">
                {/* Background Image Layer */}
                <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80" alt="Real Estate Property Architecture" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-opacity duration-700 mix-blend-luminosity grayscale pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-black/50 text-xs font-semibold uppercase tracking-widest text-[#00f0ff] mb-8 group-hover:bg-[#00f0ff]/10 transition-colors backdrop-blur-md">
                    AI Inbox Intelligence System
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-display font-bold mb-4 tracking-tight leading-snug text-white">Inbox to viewing in 30 seconds.</h3>
                  <p className="text-[#888888] leading-relaxed mb-6 text-lg">
                    The average agent takes hours to reply. We install an intelligent system straight into your email that instantly qualifies buyers and books 24/7 viewings without you touching your phone.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-8 mt-6 relative z-10">
                  <div>
                    <div className="text-4xl lg:text-5xl font-display font-bold text-white mb-2">&lt;30s</div>
                    <div className="text-sm text-[#888888] font-medium uppercase tracking-wider">Response Time</div>
                  </div>
                  <div>
                    <div className="text-4xl lg:text-5xl font-display font-bold text-white mb-2">21x</div>
                    <div className="text-sm text-[#888888] font-medium uppercase tracking-wider">Conversion Rate</div>
                  </div>
                </div>
                {/* Abstract geometry block in background */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-br from-[#00f0ff]/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
              </div>

              {/* Case Study 2 */}
              <div className="w-[85vw] md:w-[45vw] xl:w-[32vw] h-[65vh] shrink-0 glass-panel p-10 lg:p-14 rounded-[2.5rem] flex flex-col justify-between group hover:border-[#0055ff]/50 transition-all duration-500 overflow-hidden relative">
                {/* Background Image Layer */}
                <img src="https://images.unsplash.com/photo-1639322537231-2f206e06af84?auto=format&fit=crop&w=800&q=80" alt="Abstract 3D Structures" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-opacity duration-700 mix-blend-luminosity grayscale pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-black/50 text-xs font-semibold uppercase tracking-widest text-[#0055ff] mb-8 group-hover:bg-[#0055ff]/10 transition-colors backdrop-blur-md">
                    FinTech Series B
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-display font-bold mb-4 tracking-tight leading-snug text-white">Zero-Touch SDR Automation</h3>
                  <p className="text-[#888888] leading-relaxed mb-6 text-lg">
                    Replaced an underperforming 5-person outbound team with our Neural Architecture. Booked 48 qualified meetings in the first 30 days without manual intervention.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-8 mt-6 relative z-10">
                  <div>
                    <div className="text-4xl lg:text-5xl font-display font-bold text-white mb-2">48</div>
                    <div className="text-sm text-[#888888] font-medium uppercase tracking-wider">Net New Meetings</div>
                  </div>
                  <div>
                    <div className="text-4xl lg:text-5xl font-display font-bold text-white mb-2">0</div>
                    <div className="text-sm text-[#888888] font-medium uppercase tracking-wider">Manual SDRs</div>
                  </div>
                </div>
                {/* Abstract geometry block in background */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-bl from-[#0055ff]/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
              </div>

              {/* Case Study 3 */}
              <div className="w-[85vw] md:w-[45vw] xl:w-[32vw] h-[65vh] shrink-0 glass-panel p-10 lg:p-14 rounded-[2.5rem] flex flex-col justify-between group hover:border-white/40 transition-all duration-500 overflow-hidden relative">
                {/* Background Image Layer */}
                <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80" alt="Abstract Network Architecture" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-opacity duration-700 mix-blend-luminosity grayscale pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-black/50 text-xs font-semibold uppercase tracking-widest text-white mb-8 group-hover:bg-white/10 transition-colors backdrop-blur-md">
                    Enterprise Operations
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-display font-bold mb-4 tracking-tight leading-snug text-white">E2E Client Onboarding System</h3>
                  <p className="text-[#888888] leading-relaxed mb-6 text-lg">
                    Replaced a fragmented 3-week manual setup with a continuous AI workflow. The intelligent system automatically generates contracts, collects client assets, and provisions project spaces.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-8 mt-6 relative z-10">
                  <div>
                    <div className="text-4xl lg:text-5xl font-display font-bold text-white mb-2">0 Days</div>
                    <div className="text-sm text-[#888888] font-medium uppercase tracking-wider">Time to Onboard</div>
                  </div>
                  <div>
                    <div className="text-4xl lg:text-5xl font-display font-bold text-white mb-2">100%</div>
                    <div className="text-sm text-[#888888] font-medium uppercase tracking-wider">Admin Eliminated</div>
                  </div>
                </div>
                {/* Abstract geometry block in background */}
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
              </div>

            </div>
          ))}
        </div>
      </section>
      {/* AI Systems Services Section */}
      <section id="services" className="relative z-10 w-full py-20 px-6 bg-black overflow-hidden">

        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[50vw] h-[40vw] rounded-full bg-[#0055ff]/5 blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[40vw] h-[30vw] rounded-full bg-[#00f0ff]/4 blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">

          {/* Heading block */}
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-white mb-6 leading-[1.1]">
              AI Systems Built for<br />
              <span className="text-gradient">Revenue & Operational Scale</span>
            </h2>
            <p className="text-[#888] text-lg font-sans max-w-2xl mx-auto leading-relaxed">
              We design and deploy AI infrastructure that removes operational bottlenecks, unlocks new growth channels, and creates measurable business leverage.
            </p>
          </div>

          {/* Two-column cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Card 1 — Service Businesses */}
            <div className="group relative bg-[#0a0a0a] border border-white/[0.07] hover:border-[#00f0ff]/25 rounded-2xl p-10 flex flex-col transition-all duration-500 cursor-pointer hover:shadow-[0_0_60px_-15px_rgba(0,240,255,0.2)]">
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
            <div className="group relative bg-[#0a0a0a] border border-white/[0.07] hover:border-[#4488ff]/25 rounded-2xl p-10 flex flex-col transition-all duration-500 cursor-pointer hover:shadow-[0_0_60px_-15px_rgba(0,85,255,0.25)]">
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
      <section id="how-it-works" className="relative z-10 w-full py-20 px-6 bg-black overflow-hidden">

        <div className="max-w-6xl mx-auto relative z-10">

          {/* Heading */}
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-8xl font-display font-bold tracking-tight mb-5">
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

        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">

          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-0 left-1/3 w-[40vw] h-[20vw] rounded-full bg-[#00f0ff]/4 blur-[120px]" />
          </div>
          {/* LET'S TALK display heading */}
          <div className="relative z-10 mb-16 md:mb-20">
            <p className="text-[11px] font-mono text-[#00f0ff]/50 tracking-[0.35em] uppercase mb-4">// Ready to begin?</p>
            <h2 className="text-[14vw] md:text-[8vw] font-display font-black leading-none tracking-tighter">
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
                <div key={i} className={`flex items-start gap-5 py-7 ${i < 3 ? 'border-b border-white/8' : ''}`}>
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
              <div className="h-px bg-white/8" />

              {/* Stat row */}
              <div className="flex gap-8">
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
                className="group/btn self-start flex items-center gap-4 px-8 py-4 rounded-2xl bg-white text-black font-bold text-base tracking-wide hover:bg-[#00f0ff] transition-all duration-300 hover:shadow-[0_0_40px_-8px_rgba(0,240,255,0.7)]"
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
      <footer className="relative z-10 border-t border-white/10 pt-32 pb-10 overflow-hidden bg-black text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center mb-24 relative z-10">
          <div className="flex items-center justify-center mb-8 w-full">
            <h2 className="text-6xl md:text-[10vw] font-display font-bold tracking-tighter leading-none text-white">CLICKFIELDAI</h2>
          </div>


          <button className="hidden sm:flex w-14 h-14 rounded-full border border-white/20 items-center justify-center text-[#888888] hover:text-white hover:border-white transition-colors cursor-pointer z-50 pointer-events-auto" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            ↑
          </button>
        </div>
        <div className="text-center text-[#555] text-xs font-mono">
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
    <section id="faq" className="relative z-10 w-full py-20 px-6 bg-black overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[30vw] rounded-full bg-[#00f0ff]/3 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-white mb-5">
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
                  className="w-full flex items-center justify-between gap-6 px-8 py-6 text-left cursor-pointer"
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
                  <div className={`px-8 pb-7 border-l-2 ml-8 ${isOpen ? 'border-[#00f0ff]/30' : 'border-transparent'} transition-colors duration-300`}>
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
