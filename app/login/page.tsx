"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
    };

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
                    flex: "0 0 45%",
                    background: "linear-gradient(145deg, #0F5132 0%, #0d3d26 40%, #0a2d3d 70%, #0d4a6e 100%)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    padding: "60px 48px", position: "relative", overflow: "hidden",
                }}
            >
                {/* Background grid */}
                <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: "linear-gradient(rgba(155,229,100,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(155,229,100,0.05) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }} />

                {/* Floating orbs */}
                <motion.div
                    animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    style={{ position: "absolute", top: "10%", right: "10%", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(155,229,100,0.15), transparent 70%)", borderRadius: "50%" }}
                />
                <motion.div
                    animate={{ y: [0, 15, 0], scale: [1, 1.08, 1] }}
                    transition={{ duration: 10, repeat: Infinity, delay: 2 }}
                    style={{ position: "absolute", bottom: "15%", left: "5%", width: "250px", height: "250px", background: "radial-gradient(circle, rgba(77,168,218,0.12), transparent 70%)", borderRadius: "50%" }}
                />

                <div style={{ position: "relative", textAlign: "center", zIndex: 2 }}>
                    {/* Logo */}
                    <motion.div
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "40px" }}
                    >
                        <div style={{
                            width: "52px", height: "52px",
                            background: "rgba(255,255,255,0.1)",
                            border: "2px solid rgba(155,229,100,0.4)",
                            borderRadius: "15px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "28px", backdropFilter: "blur(8px)",
                        }}>🌿</div>
                        <span style={{ fontSize: "26px", fontWeight: 900, color: "white" }}>AgriSense</span>
                    </motion.div>

                    {/* Illustration – decorative SVG circles */}
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        style={{ marginBottom: "40px" }}
                    >
                        <div style={{ position: "relative", width: "200px", height: "200px", margin: "0 auto" }}>
                            <div style={{ position: "absolute", inset: 0, border: "1px solid rgba(155,229,100,0.2)", borderRadius: "50%" }} />
                            <div style={{ position: "absolute", inset: "20px", border: "1px solid rgba(77,168,218,0.2)", borderRadius: "50%" }} />
                            <div style={{ position: "absolute", inset: "40px", border: "1px solid rgba(155,229,100,0.15)", borderRadius: "50%", background: "rgba(15,81,50,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "64px" }}>
                                🌾
                            </div>
                            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20 + i * 2, repeat: Infinity, ease: "linear" }}
                                    style={{
                                        position: "absolute", inset: 0, display: "flex", alignItems: "flex-start", justifyContent: "center",
                                        transform: `rotate(${deg}deg)`,
                                    }}
                                >
                                    <div style={{ width: "8px", height: "8px", background: i % 2 === 0 ? "#9BE564" : "#4DA8DA", borderRadius: "50%", marginTop: "4px", opacity: 0.7 }} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <h2 style={{ fontSize: "28px", fontWeight: 800, color: "white", marginBottom: "16px", lineHeight: 1.2 }}>
                        Welcome Back to<br />Climate Intelligence
                    </h2>
                    <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "15px", lineHeight: 1.7, maxWidth: "280px" }}>
                        Sign in to access your personalized farm dashboard, weather alerts, and crop recommendations.
                    </p>

                    {/* Feature bullets */}
                    <div style={{ marginTop: "36px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        {["Real-time weather monitoring", "AI crop recommendations", "Irrigation scheduling", "Early risk alerts"].map((f) => (
                            <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: "20px", height: "20px", background: "rgba(155,229,100,0.2)", border: "1px solid rgba(155,229,100,0.4)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", flexShrink: 0 }}>✓</div>
                                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>{f}</span>
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
                    flex: 1,
                    background: "#fdfdfd",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "48px 32px",
                }}
            >
                <div style={{ width: "100%", maxWidth: "420px" }}>
                    {/* Back link */}
                    <Link href="/" style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        color: "#667a70", textDecoration: "none", fontSize: "13px", fontWeight: 500,
                        marginBottom: "36px",
                        transition: "color 0.2s",
                    }}
                        onMouseEnter={e => e.currentTarget.style.color = "#0F5132"}
                        onMouseLeave={e => e.currentTarget.style.color = "#667a70"}
                    >← Back to home</Link>

                    {/* Form header */}
                    <div style={{ marginBottom: "36px" }}>
                        <h1 style={{
                            fontSize: "32px", fontWeight: 900, color: "#0a1a0d",
                            letterSpacing: "-0.8px", marginBottom: "8px",
                            fontFamily: "Plus Jakarta Sans, sans-serif",
                        }}>Sign In</h1>
                        <p style={{ color: "#8a9a90", fontSize: "15px" }}>
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" style={{ color: "#0F5132", fontWeight: 700, textDecoration: "none" }}>
                                Create one →
                            </Link>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                        {/* Email */}
                        <div>
                            <label style={{ fontSize: "13px", fontWeight: 600, color: "#2d4a35", display: "block", marginBottom: "8px" }}>
                                Email Address
                            </label>
                            <div style={{ position: "relative" }}>
                                <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", pointerEvents: "none" }}>📧</span>
                                <input
                                    type="email"
                                    id="login-email"
                                    required
                                    placeholder="you@farm.com"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    style={{
                                        width: "100%", padding: "13px 16px 13px 44px",
                                        border: "1.5px solid #e2e8e4", borderRadius: "12px",
                                        fontSize: "15px", outline: "none",
                                        background: "#f8faf8", color: "#0a1a0d",
                                        transition: "all 0.2s ease",
                                        boxSizing: "border-box",
                                    }}
                                    onFocus={e => { e.target.style.borderColor = "#0F5132"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(15,81,50,0.1)"; }}
                                    onBlur={e => { e.target.style.borderColor = "#e2e8e4"; e.target.style.background = "#f8faf8"; e.target.style.boxShadow = "none"; }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                <label style={{ fontSize: "13px", fontWeight: 600, color: "#2d4a35" }}>Password</label>
                                <a href="#" style={{ fontSize: "12px", color: "#4DA8DA", textDecoration: "none", fontWeight: 600 }}>Forgot password?</a>
                            </div>
                            <div style={{ position: "relative" }}>
                                <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", pointerEvents: "none" }}>🔒</span>
                                <input
                                    type={showPass ? "text" : "password"}
                                    id="login-password"
                                    required
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    style={{
                                        width: "100%", padding: "13px 46px 13px 44px",
                                        border: "1.5px solid #e2e8e4", borderRadius: "12px",
                                        fontSize: "15px", outline: "none",
                                        background: "#f8faf8", color: "#0a1a0d",
                                        transition: "all 0.2s ease",
                                        boxSizing: "border-box",
                                    }}
                                    onFocus={e => { e.target.style.borderColor = "#0F5132"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(15,81,50,0.1)"; }}
                                    onBlur={e => { e.target.style.borderColor = "#e2e8e4"; e.target.style.background = "#f8faf8"; e.target.style.boxShadow = "none"; }}
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                                    position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                                    background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#8a9a90",
                                }}>{showPass ? "🙈" : "👁️"}</button>
                            </div>
                        </div>

                        {/* Remember me */}
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <input type="checkbox" id="remember" style={{ accentColor: "#0F5132", width: "16px", height: "16px" }} />
                            <label htmlFor="remember" style={{ fontSize: "13px", color: "#667a70" }}>Keep me signed in</label>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            style={{
                                padding: "14px",
                                background: loading ? "#8fcea8" : "linear-gradient(135deg, #0F5132 0%, #1a7a4a 100%)",
                                color: "white", border: "none", borderRadius: "12px",
                                fontSize: "15px", fontWeight: 700, cursor: loading ? "default" : "pointer",
                                boxShadow: "0 6px 24px rgba(15,81,50,0.3)",
                                transition: "background 0.3s",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                            }}
                        >
                            {loading ? (
                                <>
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}>⟳</motion.div>
                                    Signing in...
                                </>
                            ) : "Sign In →"}
                        </motion.button>

                        {/* Divider */}
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ flex: 1, height: "1px", background: "#e2e8e4" }} />
                            <span style={{ fontSize: "12px", color: "#aab8b2", fontWeight: 500 }}>or continue with</span>
                            <div style={{ flex: 1, height: "1px", background: "#e2e8e4" }} />
                        </div>

                        {/* Social buttons */}
                        <div style={{ display: "flex", gap: "12px" }}>
                            {[{ icon: "🔵", label: "Google" }, { icon: "⚫", label: "GitHub" }].map(s => (
                                <motion.button
                                    key={s.label}
                                    type="button"
                                    whileHover={{ scale: 1.02, y: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        flex: 1, padding: "11px",
                                        border: "1.5px solid #e2e8e4",
                                        borderRadius: "12px", background: "white",
                                        fontSize: "14px", fontWeight: 600, color: "#2d4a35",
                                        cursor: "pointer", display: "flex", alignItems: "center",
                                        justifyContent: "center", gap: "8px",
                                        transition: "border-color 0.2s",
                                    }}
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
