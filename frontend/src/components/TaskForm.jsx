import { useState } from "react";

export default function TaskForm({ onSubmit, initialTitle, initialDone, taskId, onCancel }) {
  const [title, setTitle] = useState(initialTitle || "");
  const [done, setDone] = useState(initialDone || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = { title: title.trim() || undefined, done };
      await onSubmit(taskId ? { ...data, id: taskId } : data);
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
      <h3>{taskId ? "Edit Task" : "Create Task"}</h3>
      {error && <div className="error-msg">{error}</div>}
      <label>
        <span>Title</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title..."
          required
        />
      </label>
      {!taskId && (
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={done}
            onChange={(e) => setDone(e.target.checked)}
          />
          <span>Mark as done</span>
        </label>
      )}
      {taskId && (
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={done}
            onChange={(e) => setDone(e.target.checked)}
          />
          <span>Completed</span>
        </label>
      )}
      <div className="task-form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (taskId ? "Saving..." : "Creating...") : (taskId ? "Save" : "Create")}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
