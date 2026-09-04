export default function Stats({ stats, loading, error }) {
  if (loading) {
    return <div className="stats-card">Loading stats...</div>;
  }
  if (error) {
    return <div className="stats-card error">Failed to load stats</div>;
  }
  if (!stats) return null;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span className="stat-value">{stats.total}</span>
        <span className="stat-label">Total Tasks</span>
      </div>
      <div className="stat-card stat-completed">
        <span className="stat-value">{stats.done}</span>
        <span className="stat-label">Completed</span>
      </div>
      <div className="stat-card stat-pending">
        <span className="stat-value">{stats.pending}</span>
        <span className="stat-label">Pending</span>
      </div>
    </div>
  );
}
