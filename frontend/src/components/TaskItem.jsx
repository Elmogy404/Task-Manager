import { useState } from "react";

export default function TaskItem({ task, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    setDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className={`task-item ${task.done ? "task-done" : "task-pending"}`}>
      <div className="task-info">
        <span className="task-id">#{task.id}</span>
        <span className="task-title">{task.title}</span>
      </div>
      <div className="task-meta">
        <span className={`task-status ${task.done ? "status-done" : "status-pending"}`}>
          {task.done ? "Done" : "Pending"}
        </span>
        <span className="task-date">{formatDate(task.created_at)}</span>
        <span className="task-date">{formatDate(task.updated_at)}</span>
      </div>
      <div className="task-actions">
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "..." : "Delete"}
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
