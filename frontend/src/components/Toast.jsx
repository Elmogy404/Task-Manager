export default function Toast({ msg, type, onDismiss }) {
  const icon = type === "success" ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ) : type === "info" ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
  );

  const colorVar = type === "success" ? "var(--success)" : type === "info" ? "var(--primary-bright)" : "var(--danger)";
  const bgVar = type === "success" ? "rgba(34, 197, 94, 0.1)" : type === "info" ? "rgba(124, 58, 237, 0.1)" : "rgba(239, 68, 68, 0.1)";
  const borderVar = type === "success" ? "rgba(34, 197, 94, 0.3)" : type === "info" ? "rgba(124, 58, 237, 0.3)" : "rgba(239, 68, 68, 0.3)";

  return (
    <div
      className="toast"
      style={{ color: colorVar, borderColor: borderVar, background: bgVar }}
    >
      <span style={{ marginRight: "8px" }}>{icon}</span>
      {msg}
      <button className="toast-dismiss" onClick={onDismiss}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  );
}
