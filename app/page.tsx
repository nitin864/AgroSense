"use client";

import { useEffect, useRef, useState } from "react";

 
/* ── inline styles object (no Tailwind needed beyond utilities) ── */
const S: Record<string, React.CSSProperties> = {
  /* reset / base */
  html: { scrollBehavior: "smooth" },
  body: {
    background: "#0d1208",
    color: "#e8edd8",
    fontFamily: "'Syne', sans-serif",
    overflowX: "hidden",
  },
};

/* ── tiny hook: intersection observer for scroll reveals ── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── animated counter ── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const { ref, visible } = useReveal(0.3);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = Math.ceil(to / 60);
    const t = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(t); }
      else setVal(start);
    }, 22);
    return () => clearInterval(t);
  }, [visible, to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ── floating particle canvas ── */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight * 1.2);
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.8 + 0.3,
      dx: (Math.random() - 0.5) * 0.25,
      dy: -Math.random() * 0.4 - 0.1,
      o: Math.random() * 0.5 + 0.1,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(109,179,63,${p.o})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight * 1.2;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}
    />
  );
}

/* ── feature card ── */
function FeatureCard({
  icon, title, desc, delay = 0,
}: { icon: string; title: string; desc: string; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        background: "linear-gradient(145deg, rgba(28,40,16,0.9), rgba(18,28,10,0.95))",
        border: "1px solid rgba(109,179,63,0.15)",
        borderRadius: 20,
        padding: "36px 32px",
        transition: `opacity 0.7s ${delay}ms, transform 0.7s ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(109,179,63,0.45)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 24px 60px rgba(109,179,63,0.12)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(109,179,63,0.15)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* glow corner */}
      <div style={{
        position: "absolute", top: -40, right: -40,
        width: 120, height: 120, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(109,179,63,0.08), transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{ fontSize: 36, marginBottom: 18 }}>{icon}</div>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 22, fontWeight: 700,
        color: "#c8e89a", marginBottom: 12, lineHeight: 1.2,
      }}>{title}</div>
      <div style={{ fontSize: 14, color: "#7a9060", lineHeight: 1.75 }}>{desc}</div>
    </div>
  );
}

/* ── stat pill ── */
function StatPill({ value, suffix, label, delay = 0 }: { value: number; suffix: string; label: string; delay?: number }) {
  const { ref, visible } = useReveal(0.3);
  return (
    <div ref={ref} style={{
      textAlign: "center",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(30px)",
      transition: `opacity 0.6s ${delay}ms, transform 0.6s ${delay}ms`,
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 58, fontWeight: 900, lineHeight: 1,
        color: "#a8d96b",
        textShadow: "0 0 40px rgba(168,217,107,0.3)",
      }}>
        <Counter to={value} suffix={suffix} />
      </div>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 11, color: "#5a7040",
        letterSpacing: "2px", textTransform: "uppercase",
        marginTop: 8,
      }}>{label}</div>
    </div>
  );
}

/* ── step card ── */
function StepCard({ num, title, desc, delay = 0 }: { num: string; title: string; desc: string; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{
      display: "flex", gap: 24, alignItems: "flex-start",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateX(0)" : "translateX(-30px)",
      transition: `opacity 0.7s ${delay}ms, transform 0.7s ${delay}ms`,
    }}>
      <div style={{
        minWidth: 56, height: 56,
        background: "linear-gradient(135deg, #2d5a14, #6db33f)",
        borderRadius: 16,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Mono', monospace",
        fontSize: 18, fontWeight: 500, color: "#fff",
        boxShadow: "0 8px 24px rgba(109,179,63,0.3)",
        flexShrink: 0,
      }}>{num}</div>
      <div>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 20, fontWeight: 700, color: "#c8e89a", marginBottom: 8,
        }}>{title}</div>
        <div style={{ fontSize: 14, color: "#6a8050", lineHeight: 1.7 }}>{desc}</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE COMPONENT
══════════════════════════════════════════ */
export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [navSolid, setNavSolid] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => { setScrollY(window.scrollY); setNavSolid(window.scrollY > 60); };
    const onMouse = (e: MouseEvent) => { setMouseX(e.clientX); setMouseY(e.clientY); };
    window.addEventListener("scroll", onScroll);
    window.addEventListener("mousemove", onMouse);
    return () => { window.removeEventListener("scroll", onMouse); window.removeEventListener("mousemove", onMouse); };
  }, []);

  const parallaxY = scrollY * 0.35;

  /* hero orb follows mouse slightly */
  const orbX = (mouseX / (typeof window !== "undefined" ? window.innerWidth : 1)) * 60 - 30;
  const orbY = (mouseY / (typeof window !== "undefined" ? window.innerHeight : 1)) * 40 - 20;

  return (
    <main style={{ background: "#0d1208", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── GLOBAL STYLES injected ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,900&family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { cursor: none !important; }
        a { text-decoration: none; }

        .cursor-dot {
          width: 8px; height: 8px;
          background: #6db33f;
          border-radius: 50%;
          position: fixed; pointer-events: none; z-index: 9999;
          transform: translate(-50%, -50%);
          transition: width 0.2s, height 0.2s;
          mix-blend-mode: screen;
        }
        .cursor-ring {
          width: 32px; height: 32px;
          border: 1px solid rgba(109,179,63,0.55);
          border-radius: 50%;
          position: fixed; pointer-events: none; z-index: 9998;
          transform: translate(-50%, -50%);
          transition: transform 0.12s ease-out;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-18px) rotate(1.5deg); }
          66% { transform: translateY(-8px) rotate(-1deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(50px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes grain {
          0%, 100% { transform: translate(0,0); }
          10% { transform: translate(-2%,-3%); }
          30% { transform: translate(3%,2%); }
          50% { transform: translate(-1%,4%); }
          70% { transform: translate(2%,-2%); }
          90% { transform: translate(-3%,1%); }
        }
        @keyframes scroll-indicator {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(10px); opacity: 0; }
        }
        @keyframes badge-glow {
          0%, 100% { box-shadow: 0 0 12px rgba(109,179,63,0.3); }
          50% { box-shadow: 0 0 28px rgba(109,179,63,0.7); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .hero-title-word {
          display: inline-block;
          animation: fadeUp 1s both;
        }
        .hero-title-word:nth-child(1) { animation-delay: 0.2s; }
        .hero-title-word:nth-child(2) { animation-delay: 0.4s; }
        .hero-title-word:nth-child(3) { animation-delay: 0.6s; }

        .shimmer-text {
          background: linear-gradient(90deg, #a8d96b, #e8f5b0, #6db33f, #a8d96b);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .grain-overlay {
          position: fixed; inset: 0; z-index: 2;
          pointer-events: none;
          opacity: 0.028;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          animation: grain 0.5s steps(1) infinite;
        }

        .nav-link {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
          color: rgba(168,217,107,0.6);
          transition: color 0.25s;
          cursor: none;
        }
        .nav-link:hover { color: #a8d96b; }

        .cta-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 18px 40px;
          background: linear-gradient(135deg, #2d5a14, #6db33f);
          border: none; border-radius: 14px;
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 700;
          color: #fff; cursor: none;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 8px 32px rgba(109,179,63,0.35);
          position: relative; overflow: hidden;
          text-decoration: none;
        }
        .cta-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0; transition: opacity 0.2s;
        }
        .cta-btn:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(109,179,63,0.5); }
        .cta-btn:hover::before { opacity: 1; }

        .cta-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 18px 40px;
          background: transparent;
          border: 1.5px solid rgba(109,179,63,0.3);
          border-radius: 14px;
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 600;
          color: #a8d96b; cursor: none;
          transition: all 0.25s;
        }
        .cta-ghost:hover {
          border-color: #6db33f;
          background: rgba(109,179,63,0.08);
          transform: translateY(-3px);
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 900px) {
          .feature-grid { grid-template-columns: 1fr; }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
        }
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 32px; }
        }

        .steps-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .steps-layout { grid-template-columns: 1fr; }
        }

        .testimonial-card {
          background: linear-gradient(145deg, rgba(28,40,16,0.8), rgba(15,22,8,0.9));
          border: 1px solid rgba(109,179,63,0.12);
          border-radius: 20px;
          padding: 32px;
          transition: border-color 0.25s, transform 0.25s;
        }
        .testimonial-card:hover {
          border-color: rgba(109,179,63,0.35);
          transform: translateY(-4px);
        }

        .tech-pill {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 18px;
          background: rgba(28,40,16,0.8);
          border: 1px solid rgba(109,179,63,0.2);
          border-radius: 100px;
          font-family: 'DM Mono', monospace;
          font-size: 12px; color: #7a9060;
          transition: all 0.2s;
        }
        .tech-pill:hover {
          border-color: rgba(109,179,63,0.5);
          color: #a8d96b;
          background: rgba(109,179,63,0.08);
        }

        .section-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 4px;
          text-transform: uppercase;
          color: #6db33f;
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 20px;
        }
        .section-label::before {
          content: '';
          display: inline-block;
          width: 28px; height: 1px;
          background: #6db33f;
        }

        .divider {
          width: 100%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(109,179,63,0.2), transparent);
          margin: 0;
        }

        .marquee-track {
          display: flex;
          animation: marquee 22s linear infinite;
          width: max-content;
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0d1208; }
        ::-webkit-scrollbar-thumb { background: rgba(109,179,63,0.3); border-radius: 3px; }

        @media (max-width: 768px) {
          .hero-h1 { font-size: 52px !important; }
          nav { padding: 20px 24px !important; }
          .nav-links { display: none !important; }
          section { padding: 80px 24px !important; }
        }
      `}</style>

      {/* grain */}
      <div className="grain-overlay" />

      {/* cursor */}
      <div className="cursor-dot" style={{ left: mouseX, top: mouseY }} />
      <div className="cursor-ring" style={{ left: mouseX, top: mouseY }} />

      {/* ══ NAV ═══════════════════════════════════════════════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "22px 60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: navSolid ? "rgba(13,18,8,0.92)" : "transparent",
        backdropFilter: navSolid ? "blur(20px)" : "none",
        borderBottom: navSolid ? "1px solid rgba(109,179,63,0.1)" : "none",
        transition: "all 0.4s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38, height: 38,
            background: "linear-gradient(135deg, #2d5a14, #6db33f)",
            borderRadius: 10, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 18,
            boxShadow: "0 0 20px rgba(109,179,63,0.4)",
          }}>🌾</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 900, color: "#c8e89a", letterSpacing: "-0.3px" }}>AgroSense</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#4a6a30", letterSpacing: "2.5px", textTransform: "uppercase" }}>Climate Intelligence</div>
          </div>
        </div>

        <div className="nav-links" style={{ display: "flex", gap: 40 }}>
          {["Features", "How It Works", "Technology", "Team"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="nav-link">{item}</a>
          ))}
        </div>

        <a href="#get-started" className="cta-btn" style={{ padding: "12px 24px", fontSize: 13, borderRadius: 10 }}>
          Launch App →
        </a>
      </nav>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section
        ref={heroRef as React.RefObject<HTMLElement>}
        style={{
          minHeight: "100vh",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "120px 60px 80px",
          position: "relative", overflow: "hidden",
          textAlign: "center",
        }}
      >
        {/* particle bg */}
        <ParticleField />

        {/* giant orb */}
        <div style={{
          position: "absolute",
          width: 800, height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(58,120,20,0.18) 0%, rgba(109,179,63,0.06) 40%, transparent 70%)",
          top: "50%", left: "50%",
          transform: `translate(calc(-50% + ${orbX}px), calc(-50% + ${orbY}px))`,
          transition: "transform 0.8s ease-out",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* ring pulse */}
        {[1, 2, 3].map((i) => (
          <div key={i} style={{
            position: "absolute", width: 500, height: 500, borderRadius: "50%",
            border: "1px solid rgba(109,179,63,0.08)",
            top: "50%", left: "50%",
            transform: `translate(-50%, -50%) scale(${i})`,
            animation: `pulse-ring ${3 + i}s ease-out infinite`,
            animationDelay: `${i * 0.8}s`,
            pointerEvents: "none", zIndex: 0,
          }} />
        ))}

        {/* SDG badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "8px 20px",
          background: "rgba(28,40,16,0.8)",
          border: "1px solid rgba(109,179,63,0.3)",
          borderRadius: 100,
          fontFamily: "'DM Mono', monospace",
          fontSize: 11, color: "#7dc44a",
          letterSpacing: "1.5px",
          marginBottom: 36, zIndex: 2,
          animation: "badge-glow 3s ease-in-out infinite, fadeIn 0.8s both",
          backdropFilter: "blur(8px)",
        }}>
          <span style={{ fontSize: 14 }}>🎯</span>
          SDG 13 · CLIMATE ACTION · PROBLEM STATEMENT 20
        </div>

        {/* main title */}
        <h1
          className="hero-h1"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 88, fontWeight: 900,
            lineHeight: 1.0, letterSpacing: "-2px",
            maxWidth: 900, zIndex: 2,
            marginBottom: 32,
          }}
        >
          <span className="hero-title-word" style={{ display: "block", color: "#c8e89a" }}>Climate-Resilient</span>
          <span className="hero-title-word shimmer-text" style={{ display: "block" }}>Agriculture</span>
          <span className="hero-title-word" style={{ display: "block", color: "rgba(200,232,154,0.4)", fontStyle: "italic", fontSize: 72 }}>Intelligence</span>
        </h1>

        {/* subtitle */}
        <p style={{
          fontSize: 18, color: "#6a8050", lineHeight: 1.8,
          maxWidth: 560, marginBottom: 52, zIndex: 2,
          animation: "fadeUp 1s 0.8s both",
        }}>
          Real-time weather monitoring, AI-powered risk assessment, and climate-adaptive crop recommendations — helping farmers thrive in a changing world.
        </p>

        {/* CTA buttons */}
        <div style={{
          display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center",
          zIndex: 2, animation: "fadeUp 1s 1s both",
        }}>
          <a href="#get-started" className="cta-btn">
            🌱 Start Monitoring
          </a>
          <a href="#how-it-works" className="cta-ghost">
            See How It Works
          </a>
        </div>

        {/* hero dashboard mockup */}
        <div style={{
          marginTop: 80, zIndex: 2, width: "100%", maxWidth: 900,
          animation: "fadeUp 1.2s 1.2s both",
          transform: `translateY(${parallaxY * 0.15}px)`,
        }}>
          <div style={{
            background: "linear-gradient(145deg, rgba(22,36,12,0.95), rgba(14,22,8,0.98))",
            border: "1px solid rgba(109,179,63,0.2)",
            borderRadius: 24, overflow: "hidden",
            boxShadow: "0 60px 120px rgba(0,0,0,0.6), 0 0 80px rgba(109,179,63,0.08)",
          }}>
            {/* mock browser bar */}
            <div style={{
              padding: "14px 20px",
              background: "rgba(10,18,6,0.8)",
              borderBottom: "1px solid rgba(109,179,63,0.08)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.7 }} />
              ))}
              <div style={{
                flex: 1, marginLeft: 16,
                background: "rgba(20,32,12,0.6)",
                borderRadius: 6, padding: "5px 14px",
                fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#4a6a30",
              }}>
                agrosense.app/dashboard
              </div>
            </div>

            {/* mock dashboard content */}
            <div style={{ padding: 28, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {[
                { label: "Temperature", value: "31°C", icon: "🌡️", color: "#f59e0b", status: "Safe Range" },
                { label: "7-Day Rainfall", value: "42mm", icon: "💧", color: "#60a5fa", status: "Adequate" },
                { label: "Risk Level", value: "LOW", icon: "✅", color: "#22c55e", status: "All Clear" },
              ].map((item) => (
                <div key={item.label} style={{
                  background: "rgba(10,18,6,0.6)",
                  borderRadius: 14, padding: "20px",
                  border: "1px solid rgba(109,179,63,0.1)",
                }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#4a6a30", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 900, color: item.color }}>{item.value}</div>
                  <div style={{ fontSize: 11, color: "#5a7040", marginTop: 4 }}>{item.status}</div>
                </div>
              ))}
            </div>

            {/* mock chart bars */}
            <div style={{ padding: "0 28px 28px", display: "flex", gap: 6, alignItems: "flex-end", height: 80 }}>
              {[45, 60, 35, 78, 52, 88, 41].map((h, i) => (
                <div key={i} style={{
                  flex: 1, borderRadius: "4px 4px 0 0",
                  background: i === 5
                    ? "linear-gradient(to top, #3a7a14, #6db33f)"
                    : "rgba(109,179,63,0.15)",
                  height: `${h}%`,
                  transition: "height 0.5s ease",
                  boxShadow: i === 5 ? "0 0 16px rgba(109,179,63,0.4)" : "none",
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* scroll indicator */}
        <div style={{
          position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 2,
          opacity: scrollY > 50 ? 0 : 1, transition: "opacity 0.4s",
        }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#3a5a20", letterSpacing: "2px" }}>SCROLL</div>
          <div style={{
            width: 1, height: 40, background: "linear-gradient(to bottom, #6db33f, transparent)",
            animation: "scroll-indicator 1.5s ease-in-out infinite",
          }} />
        </div>
      </section>

      {/* ══ MARQUEE ═══════════════════════════════════════════ */}
      <div style={{
        overflow: "hidden", padding: "20px 0",
        borderTop: "1px solid rgba(109,179,63,0.06)",
        borderBottom: "1px solid rgba(109,179,63,0.06)",
        background: "rgba(10,18,6,0.4)",
      }}>
        <div className="marquee-track">
          {[...Array(2)].map((_, rep) => (
            <div key={rep} style={{ display: "flex", gap: 0 }}>
              {["🌾 Crop Monitoring", "⚡ Real-Time Alerts", "🌦️ Weather Forecast", "🧠 AI Recommendations", "📊 Risk Assessment", "🌱 Crop Calendar", "💧 Irrigation Guidance", "🪨 Soil Analysis", "🌡️ Heat Stress Detection", "🌊 Flood Risk Alerts"].map((item) => (
                <span key={item} style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12, color: "#4a6a30",
                  letterSpacing: "1.5px", whiteSpace: "nowrap",
                  padding: "0 40px",
                }}>
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ══ FEATURES ══════════════════════════════════════════ */}
      <section id="features" style={{ padding: "120px 60px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="section-label">Core Features</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 52, fontWeight: 900,
          color: "#c8e89a", marginBottom: 16, lineHeight: 1.1,
          maxWidth: 500,
        }}>
          Everything a farmer <em style={{ color: "#6db33f" }}>needs</em>
        </h2>
        <p style={{ color: "#5a7040", fontSize: 16, maxWidth: 460, marginBottom: 64, lineHeight: 1.8 }}>
          Six intelligent modules working together to protect your harvest and maximize yield through climate intelligence.
        </p>

        <div className="feature-grid">
          <FeatureCard delay={0} icon="🌦️" title="Live Weather Intelligence" desc="Real-time 7-day forecasts powered by Open-Meteo API. Temperature trends, rainfall predictions, humidity & wind speed — all without a single API key." />
          <FeatureCard delay={100} icon="🚨" title="Dynamic Risk Assessment" desc="Proprietary scoring engine evaluates flood, drought, heat stress, and cold shock risk based on your specific crop thresholds and local weather patterns." />
          <FeatureCard delay={200} icon="🧠" title="Adaptive Recommendations" desc="Context-aware action plans that factor in crop type, soil composition, and forecast data to deliver precise irrigation, sowing, and protection guidance." />
          <FeatureCard delay={0} icon="📅" title="Crop Growth Calendar" desc="Phase-by-phase timeline for 8 major crops — land prep, sowing, transplanting, fertilizing, irrigation windows, and optimal harvest scheduling." />
          <FeatureCard delay={100} icon="🪨" title="Soil Intelligence" desc="Soil-specific drainage, nutrient levels, pH ranges, and irrigation frequency recommendations that adapt to Clay, Sandy, Loamy, Silty, Peaty, and Chalky soils." />
          <FeatureCard delay={200} icon="⚡" title="Priority Action Engine" desc="One clear action card every morning — the single most important thing to do on your farm today, derived from multi-variable climate analysis." />
        </div>
      </section>

      <div className="divider" />

      {/* ══ STATS ════════════════════════════════════════════ */}
      <section style={{
        padding: "100px 60px",
        background: "linear-gradient(135deg, rgba(18,28,10,0.6), rgba(10,18,6,0.4))",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -100, right: -100,
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(58,120,20,0.12), transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div className="section-label" style={{ justifyContent: "center" }}>Impact</div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 48, fontWeight: 900,
              color: "#c8e89a",
            }}>By the numbers</h2>
          </div>
          <div className="stats-grid">
            <StatPill value={850} suffix="M+" label="Farmers Affected by Climate" delay={0} />
            <StatPill value={40} suffix="%" label="Crop Loss from Weather Events" delay={100} />
            <StatPill value={8} suffix="" label="Crops Supported" delay={200} />
            <StatPill value={6} suffix="" label="Soil Types Analyzed" delay={300} />
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ══ HOW IT WORKS ════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding: "120px 60px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="steps-layout">
          <div>
            <div className="section-label">Process</div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 50, fontWeight: 900,
              color: "#c8e89a", lineHeight: 1.1, marginBottom: 20,
            }}>
              From soil to<br /><em style={{ color: "#6db33f" }}>smart decisions</em><br />in minutes
            </h2>
            <p style={{ color: "#5a7040", fontSize: 15, lineHeight: 1.8, marginBottom: 48, maxWidth: 400 }}>
              AgroSense transforms raw climate data into actionable farm intelligence through a four-step pipeline designed for real farmers.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              <StepCard delay={0} num="01" title="Register Your Farm" desc="Enter your farm name, location, crop type, soil composition, and acreage. Takes under 60 seconds." />
              <StepCard delay={100} num="02" title="Fetch Live Climate Data" desc="We pull real-time 7-day forecasts from Open-Meteo for your exact coordinates — no API key required." />
              <StepCard delay={200} num="03" title="Analyze & Score Risk" desc="Our engine cross-references weather forecasts against crop-specific thresholds to compute your risk score." />
              <StepCard delay={300} num="04" title="Act on Smart Guidance" desc="Receive precise recommendations for irrigation, pest control, harvesting timing, and emergency interventions." />
            </div>
          </div>

          {/* visual side */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { icon: "📍", title: "Location Detected", sub: "Nashik, Maharashtra", color: "#6db33f" },
              { icon: "🌡️", title: "Avg Temperature", sub: "34°C — Above wheat limit", color: "#f59e0b" },
              { icon: "💧", title: "Rainfall Forecast", sub: "18mm over 7 days — Low", color: "#60a5fa" },
              { icon: "🚨", title: "Risk Score", sub: "HIGH — Immediate action needed", color: "#ef4444" },
              { icon: "💡", title: "Priority Action", sub: "Irrigate wheat every 2 days", color: "#22c55e" },
            ].map((item, i) => {
              const { ref, visible } = useReveal();
              return (
                <div key={i} ref={ref} style={{
                  display: "flex", alignItems: "center", gap: 16,
                  background: "rgba(18,28,10,0.8)",
                  border: `1px solid ${item.color}22`,
                  borderLeft: `3px solid ${item.color}`,
                  borderRadius: 14, padding: "18px 22px",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(40px)",
                  transition: `opacity 0.6s ${i * 120}ms, transform 0.6s ${i * 120}ms`,
                }}>
                  <div style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: item.color, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 3 }}>{item.title}</div>
                    <div style={{ fontSize: 14, color: "#b0c890", fontWeight: 600 }}>{item.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ══ TECHNOLOGY ══════════════════════════════════════ */}
      <section id="technology" style={{ padding: "120px 60px", maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
        <div className="section-label" style={{ justifyContent: "center" }}>Tech Stack</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 50, fontWeight: 900, color: "#c8e89a",
          marginBottom: 16,
        }}>Built with modern tools</h2>
        <p style={{ color: "#5a7040", fontSize: 16, maxWidth: 480, margin: "0 auto 56px", lineHeight: 1.8 }}>
          A production-grade stack chosen for speed, reliability, and developer experience.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 80 }}>
          {[
            { icon: "▲", name: "Next.js 14" }, { icon: "⚛", name: "React 18" },
            { icon: "🍃", name: "MongoDB" }, { icon: "🟢", name: "Node.js" },
            { icon: "🚂", name: "Express.js" }, { icon: "📊", name: "Recharts" },
            { icon: "🌤", name: "Open-Meteo API" }, { icon: "🎨", name: "Tailwind CSS" },
            { icon: "🔷", name: "TypeScript" }, { icon: "🔐", name: "JWT Auth" },
          ].map((t) => (
            <span key={t.name} className="tech-pill">
              <span>{t.icon}</span> {t.name}
            </span>
          ))}
        </div>

        {/* architecture visual */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2,
          background: "rgba(109,179,63,0.06)",
          borderRadius: 20, overflow: "hidden",
          border: "1px solid rgba(109,179,63,0.1)",
        }}>
          {[
            { layer: "Frontend", items: ["Next.js Pages", "React Components", "Recharts Viz", "Tailwind UI"], icon: "🖥️" },
            { layer: "Backend API", items: ["Express Routes", "Auth Middleware", "Recommendation Engine", "Weather Proxy"], icon: "⚙️" },
            { layer: "Data Layer", items: ["MongoDB Atlas", "Farm Schemas", "Weather Cache", "Open-Meteo API"], icon: "🗄️" },
          ].map((col) => {
            const { ref, visible } = useReveal();
            return (
              <div key={col.layer} ref={ref} style={{
                padding: "32px 28px",
                background: "rgba(14,22,8,0.8)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.6s, transform 0.6s",
              }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{col.icon}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#c8e89a", marginBottom: 16 }}>{col.layer}</div>
                {col.items.map((item) => (
                  <div key={item} style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 11,
                    color: "#4a6a30", marginBottom: 8,
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <span style={{ color: "#6db33f" }}>→</span> {item}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </section>

      <div className="divider" />

      {/* ══ TESTIMONIALS ════════════════════════════════════ */}
      <section style={{ padding: "100px 60px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="section-label">Why It Matters</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 48, fontWeight: 900, color: "#c8e89a",
          marginBottom: 56, maxWidth: 500,
        }}>
          Designed for<br /><em style={{ color: "#6db33f" }}>real-world</em> impact
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {[
            { quote: "Irregular monsoons have devastated harvests for three consecutive years. A tool that gives advance warning could change everything for us.", name: "Ramesh Patel", role: "Wheat farmer, Madhya Pradesh", icon: "🌾" },
            { quote: "We lose nearly 30% of yield annually to unexpected temperature spikes during flowering. Predictive guidance would let us intervene early.", name: "Sunita Devi", role: "Rice cultivator, Bihar", icon: "🌱" },
            { quote: "Climate-smart agriculture isn't optional anymore — it's survival. Data-driven tools are the only way forward for the next generation of farmers.", name: "Dr. Anand Sharma", role: "Agricultural Extension Officer", icon: "🏛️" },
          ].map((t, i) => {
            const { ref, visible } = useReveal();
            return (
              <div key={i} ref={ref} className="testimonial-card" style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.7s ${i * 150}ms, transform 0.7s ${i * 150}ms`,
              }}>
                <div style={{ fontSize: 28, marginBottom: 16 }}>{t.icon}</div>
                <p style={{ fontSize: 14, color: "#7a9060", lineHeight: 1.8, marginBottom: 24, fontStyle: "italic" }}>
                  "{t.quote}"
                </p>
                <div style={{ fontWeight: 700, color: "#c8e89a", fontSize: 14 }}>{t.name}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#4a6a30", letterSpacing: "1px", marginTop: 4 }}>{t.role}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══ CTA SECTION ════════════════════════════════════ */}
      <section id="get-started" style={{
        padding: "120px 60px",
        textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(58,120,20,0.15), transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* animated rings */}
        {[200, 350, 500].map((size, i) => (
          <div key={i} style={{
            position: "absolute", width: size, height: size, borderRadius: "50%",
            border: "1px solid rgba(109,179,63,0.06)",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }} />
        ))}

        <div style={{ position: "relative", zIndex: 2 }}>
          <div className="section-label" style={{ justifyContent: "center" }}>Get Started</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 64, fontWeight: 900,
            color: "#c8e89a", lineHeight: 1.05,
            marginBottom: 20,
          }}>
            Protect your harvest.<br />
            <span className="shimmer-text">Adapt to the climate.</span>
          </h2>
          <p style={{ color: "#5a7040", fontSize: 17, maxWidth: 440, margin: "0 auto 52px", lineHeight: 1.8 }}>
            Join thousands of farmers using climate intelligence to make better decisions every single day.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#" className="cta-btn" style={{ padding: "20px 52px", fontSize: 16, borderRadius: 16 }}>
              🌾 Launch AgroSense Free
            </a>
            <a href="#features" className="cta-ghost" style={{ padding: "20px 52px", fontSize: 16, borderRadius: 16 }}>
              Explore Features
            </a>
          </div>

          <div style={{
            display: "flex", gap: 32, justifyContent: "center", marginTop: 48,
            flexWrap: "wrap",
          }}>
            {["✓ No API key required", "✓ Works for any location", "✓ 8 crops supported", "✓ Free forever"].map((item) => (
              <span key={item} style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 12, color: "#4a7030",
                letterSpacing: "0.5px",
              }}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════ */}
      <footer style={{
        padding: "48px 60px",
        borderTop: "1px solid rgba(109,179,63,0.08)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 20,
        background: "rgba(8,12,5,0.6)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #2d5a14, #6db33f)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
          }}>🌾</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#c8e89a" }}>AgroSense</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#3a5020", letterSpacing: "2px" }}>CLIMATE INTELLIGENCE PLATFORM</div>
          </div>
        </div>

        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#2a4018", letterSpacing: "1.5px", textAlign: "center" }}>
          SDG 13 · CLIMATE ACTION · PROBLEM STATEMENT 20 · HACKATHON 2026
        </div>

        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#2a4018" }}>
          Built with Next.js · MongoDB · Open-Meteo
        </div>
      </footer>
    </main>
  );
}
