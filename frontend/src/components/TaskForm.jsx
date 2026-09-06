import { useState } from "react";

function CheckIcon({ checked }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: checked ? 1 : 0.3 }}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

export default function TaskForm({ onSubmit, initialTitle, initialDone, taskId, onCancel }) {
  const [title, setTitle] = useState(initialTitle || "");
  const [done, setDone] = useState(initialDone || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(false);
    try {
      await onSubmit(title.trim(), done);
      if (!taskId) {
        setTitle("");
        setDone(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form-header">
        <h3>{taskId ? "Edit Task" : "New Task"}</h3>
        <button type="button" className="btn btn-ghost btn-form-close" onClick={onCancel}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      {error && <div className="error-msg">{error}</div>}
      <label>
        <span>Title</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          required
          autoFocus
        />
      </label>
      <label className="checkbox-label">
        <span className="checkbox-custom" onClick={() => setDone(!done)}>
          <CheckIcon checked={done} />
        </span>
        <span>Mark as done</span>
      </label>
      <button type="submit" className="btn btn-primary" disabled={loading || !title.trim()}>
        {taskId ? "Save" : "Create"}
      </button>
    </form>
  );
}
