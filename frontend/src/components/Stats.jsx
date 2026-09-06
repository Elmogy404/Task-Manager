import { useEffect, useRef, useState } from "react";

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 600;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }, [value]);

  return display;
}

function StatSkeleton() {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <div className="stat-icon skeleton-pulse" />
      </div>
      <div className="stat-value skeleton-pulse" />
      <div className="stat-label skeleton-pulse" />
    </div>
  );
}

export default function Stats({ stats, loading, error }) {
  if (loading) {
    return (
      <div className="stats-grid">
        {[1, 2, 3].map((i) => (
          <StatSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <div className="stats-grid">
        <div className="stat-card error">
          <div className="stat-header">
            <div className="stat-icon" style={{ color: "var(--danger)", background: "rgba(239, 68, 68, 0.1)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>
          </div>
          <div className="stat-value" style={{ color: "var(--danger)" }}>—</div>
          <div className="stat-label">Failed to load</div>
        </div>
      </div>
    );
  }
  if (!stats) return null;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon total">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
          </div>
        </div>
        <span className="stat-value"><AnimatedNumber value={stats.total} /></span>
        <span className="stat-label">Total Tasks</span>
      </div>
      <div className="stat-card stat-completed">
        <div className="stat-header">
          <div className="stat-icon completed">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        </div>
        <span className="stat-value"><AnimatedNumber value={stats.done} /></span>
        <span className="stat-label">Completed</span>
      </div>
      <div className="stat-card stat-pending">
        <div className="stat-header">
          <div className="stat-icon pending">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
        </div>
        <span className="stat-value"><AnimatedNumber value={stats.pending} /></span>
        <span className="stat-label">Pending</span>
      </div>
    </div>
  );
}
