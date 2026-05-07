// ============================================================
// FILE: src/pages/AdminLogin.tsx
//
// FIXES APPLIED:
//   BUG 1 — `styles` object typed as `Record<string, React.CSSProperties>`
//            and `getParticleStyle` returns `React.CSSProperties`, but
//            `React` was never imported. TypeScript throws:
//            "Cannot find name 'React'."
//            ADDED: import React from 'react'
//
//   BUG 2 — handleSubmit typed as `(e: React.FormEvent)` — same issue.
//            Fixed by the same React import.
//
//   BUG 3 — styles.cardTitle and styles.cardDesc had no `margin: 0`,
//            causing browser default <h2>/<p> margins to push layout.
//            ADDED margin: 0 to both.
// ============================================================

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAdmin();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPw,   setShowPw]   = useState(false);

  // Redirect immediately if session already exists
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // React.FormEvent now resolves correctly with the import above
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate("/admin/dashboard", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Background radial overlay */}
      <div style={styles.bgOverlay} />

      {/* Floating ambient particles */}
      <div style={styles.particleField}>
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{ ...styles.particle, ...getParticleStyle(i) }} />
        ))}
      </div>

      <div style={styles.container}>
        {/* Brand */}
        <div style={styles.brand}>
          <div style={styles.logoRing}>
            <span style={styles.logoIcon}>🌿</span>
          </div>
          <h1 style={styles.brandTitle}>India Biodiversity</h1>
          <p style={styles.brandSub}>Intelligence Admin Portal</p>
        </div>

        {/* Login Card */}
        <div style={styles.card}>
          <div style={styles.cardInner}>
            <h2 style={styles.cardTitle}>Admin Access</h2>
            <p style={styles.cardDesc}>Sign in to manage biodiversity data</p>

            {error && (
              <div style={styles.errorBox}>
                <span style={{ marginRight: 8 }}>⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Username / Email */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Username or Email</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>👤</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    style={styles.input}
                    autoComplete="username"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>🔒</span>
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={styles.input}
                    autoComplete="current-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    style={styles.togglePw}
                    tabIndex={-1}
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
                disabled={loading}
              >
                {loading ? (
                  <span style={styles.loadingSpinner}>
                    <span style={styles.spinner} />
                    Authenticating...
                  </span>
                ) : (
                  "Enter Dashboard →"
                )}
              </button>
            </form>

            {/* Setup hint for first-time use */}
            <div style={styles.hint}>
              <span style={styles.hintIcon}>💡</span>
              First time? Seed admin via
              <code style={styles.code}>POST /api/admin/auth/seed</code>
            </div>
          </div>
        </div>

        <p style={styles.footer}>
          🌱 India Biodiversity Explorer · Admin Dashboard v1.0
        </p>
      </div>

      <style>{animStyles}</style>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// STYLES
// React.CSSProperties resolves correctly with the React import above
// ══════════════════════════════════════════════════════════════
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0a1628 0%, #0d2818 40%, #1a3a2a 70%, #0a1628 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Georgia', serif",
    position: "relative",
    overflow: "hidden",
  },
  bgOverlay: {
    position: "absolute",
    inset: 0,
    background: `
      radial-gradient(ellipse at 20% 50%, rgba(34,197,94,0.08) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.06) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 80%, rgba(5,150,105,0.05) 0%, transparent 40%)
    `,
    pointerEvents: "none",
  },
  particleField: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
  },
  particle: {
    position: "absolute",
    borderRadius: "50%",
    background: "rgba(34,197,94,0.15)",
    animation: "floatParticle 8s ease-in-out infinite",
  },
  container: {
    width: "100%",
    maxWidth: 440,
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 28,
    position: "relative",
    zIndex: 1,
  },
  brand: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  logoRing: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    border: "2px solid rgba(34,197,94,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(34,197,94,0.08)",
    boxShadow: "0 0 30px rgba(34,197,94,0.2)",
  },
  logoIcon: { fontSize: 32 },
  brandTitle: {
    color: "#e8f5e9",
    fontSize: 24,
    fontWeight: 700,
    margin: 0, // reset browser default
  },
  brandSub: {
    color: "rgba(134,239,172,0.7)",
    fontSize: 13,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    margin: 0, // reset browser default
  },
  card: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    borderRadius: 20,
    border: "1px solid rgba(34,197,94,0.2)",
    backdropFilter: "blur(20px)",
  },
  cardInner: {
    padding: "36px 32px",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  cardTitle: {
    color: "#e8f5e9",
    fontSize: 22,
    fontWeight: 700,
    margin: 0, // FIX: browser default h2 margin caused layout shift
  },
  cardDesc: {
    color: "rgba(167,243,208,0.6)",
    fontSize: 14,
    margin: 0, // FIX: browser default p margin caused layout shift
  },
  errorBox: {
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: 10,
    padding: "10px 14px",
    color: "#fca5a5",
    fontSize: 13,
    display: "flex",
    alignItems: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    color: "rgba(134,239,172,0.8)",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: 14,
    fontSize: 15,
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(34,197,94,0.25)",
    borderRadius: 10,
    padding: "12px 14px 12px 42px",
    color: "#e8f5e9",
    fontSize: 15,
    outline: "none",
  },
  togglePw: {
    position: "absolute",
    right: 12,
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    lineHeight: 1,
  },
  submitBtn: {
    marginTop: 8,
    background: "linear-gradient(135deg,#16a34a,#059669)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "14px 24px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
  },
  loadingSpinner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  spinner: {
    width: 16,
    height: 16,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    display: "inline-block",
  },
  hint: {
    background: "rgba(34,197,94,0.07)",
    border: "1px solid rgba(34,197,94,0.15)",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 12,
    color: "rgba(134,239,172,0.6)",
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
    alignItems: "center",
  },
  hintIcon: { fontSize: 14 },
  code: {
    background: "rgba(0,0,0,0.3)",
    padding: "1px 6px",
    borderRadius: 4,
    fontFamily: "monospace",
    fontSize: 11,
    color: "#86efac",
  },
  footer: {
    color: "rgba(134,239,172,0.3)",
    fontSize: 12,
    textAlign: "center",
    margin: 0,
  },
};

// ──────────────────────────────────────────────────────────────
// PARTICLE POSITIONS
// getParticleStyle returns React.CSSProperties — resolved by import
// ──────────────────────────────────────────────────────────────
const getParticleStyle = (i: number): React.CSSProperties => {
  const sizes     = [4, 6, 8, 5, 7, 3, 9, 4, 6, 8, 5, 7];
  const positions = [
    [10, 20], [80, 10], [30, 70], [70, 40],
    [20, 80], [90, 60], [50, 15], [15, 55],
    [85, 75], [45, 90], [60, 30], [25, 45],
  ];

  return {
    width:             sizes[i],
    height:            sizes[i],
    left:              `${positions[i][0]}%`,
    top:               `${positions[i][1]}%`,
    animationDelay:    `${i * 0.7}s`,
    animationDuration: `${6 + (i % 4) * 1.5}s`,
  };
};

// ──────────────────────────────────────────────────────────────
// ANIMATIONS
// ──────────────────────────────────────────────────────────────
const animStyles = `
  @keyframes floatParticle {
    0%,100% { transform: translateY(0) scale(1);   opacity: 0.3; }
    50%     { transform: translateY(-20px) scale(1.2); opacity: 0.6; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  input:focus {
    border-color: rgba(34,197,94,0.5) !important;
    background:   rgba(255,255,255,0.09) !important;
    box-shadow:   0 0 0 3px rgba(34,197,94,0.1);
  }
`;