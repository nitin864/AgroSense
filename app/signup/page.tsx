"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SignupPage() {
    const [form, setForm] = useState({
        name: "", email: "", farmName: "", password: "", confirmPassword: "",
    });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
    };

    const passwordStrength = (() => {
        const p = form.password;
        if (!p) return 0;
        let score = 0;
        if (p.length >= 8) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;
        return score;
    })();

    const strengthColor = ["#e2e8e4", "#FF6B6B", "#FFB347", "#4DA8DA", "#9BE564"][passwordStrength];
    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][passwordStrength];

    return (
        <div style={{
            minHeight: "100vh", display: "flex",
            fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
        }}>
            {/* Left Panel */}
            <motion.div
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
                className="auth-left-panel"
                style={{
                    flex: "0 0 42%",
                    background: "linear-gradient(145deg, #071628 0%, #0a2d3d 40%, #0d3d26 70%, #0F5132 100%)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    padding: "60px 48px", position: "relative", overflow: "hidden",
                }}
            >
                <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(77,168,218,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(77,168,218,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <motion.div animate={{ y: [0, -18, 0], scale: [1, 1.08, 1] }} transition={{ duration: 9, repeat: Infinity }} style={{ position: "absolute", top: "8%", right: "8%", width: "220px", height: "220px", background: "radial-gradient(circle, rgba(77,168,218,0.15), transparent 70%)", borderRadius: "50%" }} />
                <motion.div animate={{ y: [0, 14, 0] }} transition={{ duration: 11, repeat: Infinity, delay: 1.5 }} style={{ position: "absolute", bottom: "10%", left: "5%", width: "260px", height: "260px", background: "radial-gradient(circle, rgba(155,229,100,0.1), transparent 70%)", borderRadius: "50%" }} />

                <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
                    {/* Logo */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "44px" }}
                    >
                        <div style={{ width: "52px", height: "52px", background: "rgba(255,255,255,0.08)", border: "2px solid rgba(155,229,100,0.4)", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>🌿</div>
                        <span style={{ fontSize: "26px", fontWeight: 900, color: "white" }}>AgriSense</span>
                    </motion.div>

                    {/* Step progress visual */}
                    <div style={{ marginBottom: "40px" }}>
                        <div style={{ position: "relative", width: "160px", height: "160px", margin: "0 auto" }}>
                            <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
                                <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                                <motion.circle
                                    cx="80" cy="80" r="68"
                                    fill="none"
                                    stroke="url(#progressGrad)"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 68}`}
                                    initial={{ strokeDashoffset: 2 * Math.PI * 68 }}
                                    animate={{ strokeDashoffset: 2 * Math.PI * 68 * (1 - step / 3) }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                />
                                <defs>
                                    <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#9BE564" />
                                        <stop offset="100%" stopColor="#4DA8DA" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ fontSize: "36px", fontWeight: 900, color: "white", lineHeight: 1 }}>{step}/3</span>
                                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>Steps</span>
                            </div>
                        </div>
                    </div>

                    <h2 style={{ fontSize: "26px", fontWeight: 800, color: "white", marginBottom: "14px", lineHeight: 1.2 }}>
                        Join 10,000+<br />Climate-Smart Farmers
                    </h2>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", lineHeight: 1.7, maxWidth: "270px" }}>
                        Create your account and start receiving personalized climate insights for your farm in minutes.
                    </p>

                    {/* Benefits */}
                    <div style={{ marginTop: "36px", display: "flex", flexDirection: "column", gap: "14px", textAlign: "left" }}>
                        {[
                            { icon: "🆓", text: "Free to get started, no credit card" },
                            { icon: "⚡", text: "Live in under 5 minutes" },
                            { icon: "📱", text: "Mobile app included" },
                            { icon: "🌍", text: "Supports all agro-climatic zones" },
                        ].map(b => (
                            <div key={b.text} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={{ width: "32px", height: "32px", background: "rgba(155,229,100,0.1)", border: "1px solid rgba(155,229,100,0.25)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>{b.icon}</div>
                                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>{b.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Right Panel – Form */}
            <motion.div
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
                style={{
                    flex: 1, background: "#fdfdfd",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "48px 32px", overflowY: "auto",
                }}
            >
                <div style={{ width: "100%", maxWidth: "440px" }}>
                    {/* Back link */}
                    <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#667a70", textDecoration: "none", fontSize: "13px", fontWeight: 500, marginBottom: "36px", transition: "color 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#0F5132"}
                        onMouseLeave={e => e.currentTarget.style.color = "#667a70"}>
                        ← Back to home
                    </Link>

                    {/* Header */}
                    <div style={{ marginBottom: "32px" }}>
                        <h1 style={{ fontSize: "30px", fontWeight: 900, color: "#0a1a0d", letterSpacing: "-0.8px", marginBottom: "8px", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                            Create Account
                        </h1>
                        <p style={{ color: "#8a9a90", fontSize: "15px" }}>
                            Already have an account?{" "}
                            <Link href="/login" style={{ color: "#0F5132", fontWeight: 700, textDecoration: "none" }}>Sign in →</Link>
                        </p>
                    </div>

                    {/* Step indicator */}
                    <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
                        {[1, 2, 3].map(s => (
                            <div key={s} style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                                <motion.div
                                    animate={step >= s ? { background: "#0F5132", scale: 1.1 } : { background: "#e2e8e4", scale: 1 }}
                                    style={{ width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: step >= s ? "white" : "#aab8b2", flexShrink: 0 }}
                                >{s}</motion.div>
                                <div style={{ fontSize: "11px", color: step >= s ? "#0F5132" : "#aab8b2", fontWeight: 600 }}>
                                    {s === 1 ? "Personal" : s === 2 ? "Farm Info" : "Security"}
                                </div>
                                {s < 3 && <div style={{ flex: 1, height: "1px", background: step > s ? "#0F5132" : "#e2e8e4" }} />}
                            </div>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                        {/* Step 1: Personal */}
                        {step >= 1 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                <div>
                                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#2d4a35", display: "block", marginBottom: "8px" }}>Full Name</label>
                                    <div style={{ position: "relative" }}>
                                        <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>👤</span>
                                        <input type="text" id="signup-name" required placeholder="Rajesh Kumar" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                            style={{ width: "100%", padding: "13px 16px 13px 44px", border: "1.5px solid #e2e8e4", borderRadius: "12px", fontSize: "15px", outline: "none", background: "#f8faf8", color: "#0a1a0d", transition: "all 0.2s", boxSizing: "border-box" }}
                                            onFocus={e => { e.target.style.borderColor = "#0F5132"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(15,81,50,0.1)"; }}
                                            onBlur={e => { e.target.style.borderColor = "#e2e8e4"; e.target.style.background = "#f8faf8"; e.target.style.boxShadow = "none"; }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#2d4a35", display: "block", marginBottom: "8px" }}>Email Address</label>
                                    <div style={{ position: "relative" }}>
                                        <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>📧</span>
                                        <input type="email" id="signup-email" required placeholder="you@farm.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                            style={{ width: "100%", padding: "13px 16px 13px 44px", border: "1.5px solid #e2e8e4", borderRadius: "12px", fontSize: "15px", outline: "none", background: "#f8faf8", color: "#0a1a0d", transition: "all 0.2s", boxSizing: "border-box" }}
                                            onFocus={e => { e.target.style.borderColor = "#0F5132"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(15,81,50,0.1)"; }}
                                            onBlur={e => { e.target.style.borderColor = "#e2e8e4"; e.target.style.background = "#f8faf8"; e.target.style.boxShadow = "none"; }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Farm Info */}
                        <div>
                            <label style={{ fontSize: "13px", fontWeight: 600, color: "#2d4a35", display: "block", marginBottom: "8px" }}>Farm Name <span style={{ color: "#aab8b2", fontWeight: 400 }}>(optional)</span></label>
                            <div style={{ position: "relative" }}>
                                <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🌾</span>
                                <input type="text" id="signup-farmname" placeholder="e.g. Green Valley Farm" value={form.farmName} onChange={e => setForm({ ...form, farmName: e.target.value })}
                                    style={{ width: "100%", padding: "13px 16px 13px 44px", border: "1.5px solid #e2e8e4", borderRadius: "12px", fontSize: "15px", outline: "none", background: "#f8faf8", color: "#0a1a0d", transition: "all 0.2s", boxSizing: "border-box" }}
                                    onFocus={e => { e.target.style.borderColor = "#0F5132"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(15,81,50,0.1)"; }}
                                    onBlur={e => { e.target.style.borderColor = "#e2e8e4"; e.target.style.background = "#f8faf8"; e.target.style.boxShadow = "none"; }}
                                />
                            </div>
                        </div>

                        {/* Step 3: Security */}
                        <div>
                            <label style={{ fontSize: "13px", fontWeight: 600, color: "#2d4a35", display: "block", marginBottom: "8px" }}>Password</label>
                            <div style={{ position: "relative" }}>
                                <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔒</span>
                                <input type={showPass ? "text" : "password"} id="signup-password" required placeholder="Create a strong password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                                    style={{ width: "100%", padding: "13px 46px 13px 44px", border: "1.5px solid #e2e8e4", borderRadius: "12px", fontSize: "15px", outline: "none", background: "#f8faf8", color: "#0a1a0d", transition: "all 0.2s", boxSizing: "border-box" }}
                                    onFocus={e => { e.target.style.borderColor = "#0F5132"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(15,81,50,0.1)"; }}
                                    onBlur={e => { e.target.style.borderColor = "#e2e8e4"; e.target.style.background = "#f8faf8"; e.target.style.boxShadow = "none"; }}
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#8a9a90" }}>{showPass ? "🙈" : "👁️"}</button>
                            </div>
                            {/* Strength bar */}
                            {form.password && (
                                <div style={{ marginTop: "8px" }}>
                                    <div style={{ height: "4px", background: "#e2e8e4", borderRadius: "2px", overflow: "hidden" }}>
                                        <motion.div animate={{ width: `${(passwordStrength / 4) * 100}%`, background: strengthColor }} transition={{ duration: 0.3 }} style={{ height: "100%", borderRadius: "2px" }} />
                                    </div>
                                    <div style={{ fontSize: "11px", color: strengthColor, marginTop: "4px", fontWeight: 600 }}>{strengthLabel} password</div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label style={{ fontSize: "13px", fontWeight: 600, color: "#2d4a35", display: "block", marginBottom: "8px" }}>Confirm Password</label>
                            <div style={{ position: "relative" }}>
                                <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>
                                    {form.confirmPassword && (form.confirmPassword === form.password ? "✅" : "❌")}
                                    {!form.confirmPassword && "🔑"}
                                </span>
                                <input type="password" id="signup-confirm" required placeholder="Repeat your password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                    style={{ width: "100%", padding: "13px 16px 13px 44px", border: `1.5px solid ${form.confirmPassword && form.confirmPassword !== form.password ? "#FF6B6B" : "#e2e8e4"}`, borderRadius: "12px", fontSize: "15px", outline: "none", background: "#f8faf8", color: "#0a1a0d", transition: "all 0.2s", boxSizing: "border-box" }}
                                    onFocus={e => { e.target.style.borderColor = "#0F5132"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(15,81,50,0.1)"; }}
                                    onBlur={e => { e.target.style.borderColor = "#e2e8e4"; e.target.style.background = "#f8faf8"; e.target.style.boxShadow = "none"; }}
                                />
                            </div>
                        </div>

                        {/* Terms */}
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                            <input type="checkbox" id="terms" required style={{ accentColor: "#0F5132", width: "16px", height: "16px", marginTop: "2px", flexShrink: 0 }} />
                            <label htmlFor="terms" style={{ fontSize: "13px", color: "#667a70", lineHeight: 1.5 }}>
                                I agree to the{" "}
                                <a href="#" style={{ color: "#0F5132", fontWeight: 600, textDecoration: "none" }}>Terms of Service</a>
                                {" "}and{" "}
                                <a href="#" style={{ color: "#0F5132", fontWeight: 600, textDecoration: "none" }}>Privacy Policy</a>
                            </label>
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            onClick={() => { if (step < 3) setStep(Math.min(step + 1, 3)); }}
                            style={{
                                padding: "14px",
                                background: loading ? "#8fcea8" : "linear-gradient(135deg, #0F5132 0%, #1a7a4a 100%)",
                                color: "white", border: "none", borderRadius: "12px",
                                fontSize: "15px", fontWeight: 700, cursor: loading ? "default" : "pointer",
                                boxShadow: "0 6px 24px rgba(15,81,50,0.3)",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                            }}
                        >
                            {loading ? (
                                <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}>⟳</motion.div> Creating account...</>
                            ) : "Create My Farm Account 🌿"}
                        </motion.button>

                        {/* Divider + social */}
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ flex: 1, height: "1px", background: "#e2e8e4" }} />
                            <span style={{ fontSize: "12px", color: "#aab8b2", fontWeight: 500 }}>or sign up with</span>
                            <div style={{ flex: 1, height: "1px", background: "#e2e8e4" }} />
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            {[{ icon: "🔵", label: "Google" }, { icon: "⚫", label: "GitHub" }].map(s => (
                                <motion.button key={s.label} type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    style={{ flex: 1, padding: "11px", border: "1.5px solid #e2e8e4", borderRadius: "12px", background: "white", fontSize: "14px", fontWeight: 600, color: "#2d4a35", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                                    onMouseEnter={e => (e.currentTarget.style.borderColor = "#0F5132")}
                                    onMouseLeave={e => (e.currentTarget.style.borderColor = "#e2e8e4")}
                                >{s.icon} {s.label}</motion.button>
                            ))}
                        </div>
                    </form>
                </div>
            </motion.div>

            <style>{`
        @media (max-width: 768px) {
          .auth-left-panel { display: none !important; }
        }
      `}</style>
        </div>
    );
}
