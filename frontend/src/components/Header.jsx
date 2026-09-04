import { useState } from "react";
import { api } from "../api.js";

export default function Header({ token, onLogin, onLogout }) {
  const [showAuth, setShowAuth] = useState("");

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <h1 className="header-title">Task API</h1>
          {token && (
            <span className="header-badge">Authenticated</span>
          )}
        </div>
        <div className="header-actions">
          {token ? (
            <>
              <button className="btn btn-ghost" onClick={onLogout}>
                Logout
              </button>
              <span className="header-user">Logged in</span>
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
          {showAuth === "signup" && <SignupForm onSubmit={onLogin} onClose={() => setShowAuth("")} />}
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
      await api.login(email, password);
      onSubmit();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
      <h2>Login</h2>
      <label>
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
        />
      </label>
      <label>
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
      </label>
      {error && <div className="error-msg">{error}</div>}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

function SignupForm({ onSubmit, onClose }) {
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
      onSubmit();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
      <h2>Sign Up</h2>
      <label>
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
        />
      </label>
      <label>
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
      </label>
      {error && <div className="error-msg">{error}</div>}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}
