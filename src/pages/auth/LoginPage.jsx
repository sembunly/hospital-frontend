import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const FONT_IMPORT =
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500&family=IBM+Plex+Sans:wght@400;500;600&display=swap";

const ECG_PATH =
  "M0,60 L60,60 L80,60 L92,20 L108,100 L124,40 L136,60 L200,60 L220,60 L232,30 L248,90 L264,50 L276,60 L340,60 L360,60 L372,20 L388,100 L404,40 L416,60 L480,60 L500,60 L512,30 L528,90 L544,50 L556,60 L620,60";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const pathRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const len = el.getTotalLength();
    el.style.strokeDasharray = len;
    el.style.strokeDashoffset = len;
    el.getBoundingClientRect(); // force reflow
    el.style.transition = "stroke-dashoffset 2.4s ease-out";
    el.style.strokeDashoffset = "0";
  }, []);

  // ─────────────────────────────────────────────
  // Auth
  // ─────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Cannot connect to auth service.");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <link rel="stylesheet" href={FONT_IMPORT} />

      <div style={styles.hero}>
        <svg
          viewBox="0 0 620 120"
          style={styles.ecgSvg}
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            ref={pathRef}
            d={ECG_PATH}
            fill="none"
            stroke="#E8A33D"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div style={styles.heroText}>
          <div style={styles.wordmark}>Hospital OPD</div>
          <div style={styles.tagline}>Care, coordinated.</div>
          <div style={styles.heroFoot}>Staff and clinical systems portal</div>
        </div>
      </div>

      <div style={styles.formSide}>
        <form style={styles.form} onSubmit={handleLogin} noValidate>
          <h1 style={styles.heading}>Sign in</h1>
          <p style={styles.subheading}>Login to continue</p>

          <label style={styles.label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            autoComplete="username"
            required
          />

          <label style={styles.label} htmlFor="password">
            Password
          </label>
          <div style={styles.passwordRow}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...styles.input, marginBottom: 0, flex: 1 }}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              style={styles.toggleBtn}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && (
            <div role="alert" style={styles.error}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const styles = {
  page: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    minHeight: "100vh",
    fontFamily: "'IBM Plex Sans', sans-serif",
    background: "#F7F9F8",
    color: "#10231F",
  },
  hero: {
    position: "relative",
    background: "#0F4C46",
    color: "#F7F9F8",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "4rem",
    overflow: "hidden",
  },
  ecgSvg: {
    position: "absolute",
    top: "50%",
    left: 0,
    width: "140%",
    transform: "translateY(-50%) rotate(-3deg)",
    opacity: 0.9,
  },
  heroText: {
    position: "relative",
    zIndex: 1,
    maxWidth: "26rem",
  },
  wordmark: {
    fontFamily: "'Fraunces', serif",
    fontWeight: 500,
    fontSize: "2.6rem",
    lineHeight: 1.1,
    letterSpacing: "-0.01em",
  },
  tagline: {
    fontFamily: "'Fraunces', serif",
    fontStyle: "italic",
    fontWeight: 300,
    fontSize: "1.25rem",
    marginTop: "0.75rem",
    color: "#CFE0DB",
  },
  heroFoot: {
    marginTop: "3rem",
    fontSize: "0.85rem",
    color: "#8FAEA6",
    borderTop: "1px solid rgba(247,249,248,0.15)",
    paddingTop: "1rem",
    maxWidth: "14rem",
  },
  formSide: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  form: {
    width: "100%",
    maxWidth: "22rem",
  },
  heading: {
    fontFamily: "'Fraunces', serif",
    fontWeight: 500,
    fontSize: "1.9rem",
    margin: 0,
  },
  subheading: {
    color: "#6B8079",
    marginTop: "0.4rem",
    marginBottom: "2rem",
    fontSize: "0.95rem",
  },
  label: {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 500,
    color: "#3D544D",
    marginBottom: "0.4rem",
    marginTop: "1.1rem",
  },
  input: {
    width: "100%",
    border: "none",
    borderBottom: "1.5px solid #D9E2DE",
    background: "transparent",
    padding: "0.55rem 0.1rem",
    fontSize: "1rem",
    fontFamily: "inherit",
    color: "#10231F",
    outline: "none",
    marginBottom: "0.2rem",
  },
  passwordRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: "0.75rem",
    borderBottom: "1.5px solid #D9E2DE",
  },
  toggleBtn: {
    background: "none",
    border: "none",
    color: "#0F4C46",
    fontSize: "0.85rem",
    fontWeight: 500,
    cursor: "pointer",
    paddingBottom: "0.55rem",
  },
  error: {
    marginTop: "1rem",
    padding: "0.65rem 0.85rem",
    background: "#FBEEE0",
    color: "#8A5A1C",
    borderLeft: "3px solid #E8A33D",
    fontSize: "0.85rem",
  },
  submitBtn: {
    width: "100%",
    marginTop: "1.75rem",
    padding: "0.8rem",
    background: "#0F4C46",
    color: "#F7F9F8",
    border: "none",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.01em",
  },
};
