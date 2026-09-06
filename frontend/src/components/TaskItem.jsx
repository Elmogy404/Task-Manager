import { useState } from "react";

export default function TaskItem({ task, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [deletingAnim, setDeletingAnim] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    setDeletingAnim(true);
    setTimeout(async () => {
      setDeleting(true);
      try {
        await onDelete(task.id);
      } finally {
        setDeleting(false);
        setDeletingAnim(false);
      }
    }, 300);
  }

  const taskIdLetters = task.id.toString(36).toUpperCase();

  return (
    <div
      className={`task-item ${task.done ? "task-done" : "task-pending"}`}
      style={deletingAnim ? { opacity: 0, transform: "translateX(30px) scale(0.95)", height: 0, padding: 0, margin: 0, overflow: "hidden", borderWidth: 0 } : {}}
    >
      <div className="task-id-avatar">{taskIdLetters}</div>
      <div className="task-info">
        <span className="task-title">{task.title}</span>
      </div>
      <div className="task-meta">
        <span className={`task-status ${task.done ? "status-done" : "status-pending"}`}>
          {task.done ? "Done" : "Pending"}
        </span>
        <span className="task-date">{formatDate(task.created_at)}</span>
      </div>
      <div className="task-actions">
        <button className="btn btn-sm btn-secondary" onClick={() => onEdit(task)} title="Edit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button className="btn btn-sm btn-danger" onClick={handleDelete} disabled={deleting} title="Delete">
          {deleting ? (
            <span className="spinner">...</span>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          )}
        </button>
      </div>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
