import { useState } from "react";
import { api } from "../api.js";

function LogoIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M3 9h18"/>
      <path d="M9 21V9"/>
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

export default function Header({ token, onLogin, onLogout }) {
  const [showAuth, setShowAuth] = useState("");

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <span className="header-logo"><LogoIcon /></span>
          <h1 className="header-title">Task Manager</h1>
          {token && <span className="header-badge">Authenticated</span>}
        </div>
        <div className="header-actions">
          {token ? (
            <>
              <button className="btn btn-primary" onClick={() => window.dispatchEvent(new CustomEvent("toggle-form"))}>
                <PlusIcon /> New Task
              </button>
              <button className="btn btn-ghost" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <div className="auth-tabs">
              <button
                className={`btn btn-ghost ${showAuth === "login" ? "active" : ""}`}
                onClick={() => setShowAuth(showAuth === "login" ? "" : "login")}
              >
                Login
              </button>
              <button
                className={`btn btn-ghost ${showAuth === "signup" ? "active" : ""}`}
                onClick={() => setShowAuth(showAuth === "signup" ? "" : "signup")}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
      {token && showAuth && <div className="header-overlay" onClick={() => setShowAuth("")} />}
      {!token && (
        <div className="auth-dropdown">
          {showAuth === "login" && <LoginForm onSubmit={onLogin} onClose={() => setShowAuth("")} />}
          {showAuth === "signup" && <SignupForm onClose={() => setShowAuth("")} />}
        </div>
      )}
    </header>
  );
}

function LoginForm({ onSubmit, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.login(email, password);
      onSubmit(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
      <h2>Welcome Back</h2>
      <p className="auth-subtitle">Sign in to manage your tasks</p>
      <label>
        <span>Email</span>
        <div className="input-wrapper">
          <span className="input-icon"><EmailIcon /></span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </div>
      </label>
      <label>
        <span>Password</span>
        <div className="input-wrapper">
          <span className="input-icon"><LockIcon /></span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
      </label>
      {error && <div className="error-msg">{error}</div>}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

function SignupForm({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.signup(email, password);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
      <h2>Create Account</h2>
      <p className="auth-subtitle">Start organizing your tasks today</p>
      <label>
        <span>Email</span>
        <div className="input-wrapper">
          <span className="input-icon"><EmailIcon /></span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </div>
      </label>
      <label>
        <span>Password</span>
        <div className="input-wrapper">
          <span className="input-icon"><LockIcon /></span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
      </label>
      {error && <div className="error-msg">{error}</div>}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}
