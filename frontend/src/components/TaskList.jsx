import { useState, useEffect, useMemo } from "react";
import TaskItem from "./TaskItem.jsx";
import TaskForm from "./TaskForm.jsx";

export default function TaskList({ tasks, loading, error, onCreate, onUpdate, onDelete, filter, setFilter, search, setSearch }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    function handleToggle() {
      setShowForm((prev) => {
        if (prev && editing) {
          setEditing(null);
          return false;
        }
        if (prev) return false;
        return true;
      });
    }
    window.addEventListener("toggle-form", handleToggle);
    return () => window.removeEventListener("toggle-form", handleToggle);
  }, [editing]);

  const sortedTasks = useMemo(() => {
    const sorted = [...tasks].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "title-az":
          return a.title.localeCompare(b.title);
        case "title-za":
          return b.title.localeCompare(a.title);
        case "recently-updated":
          return new Date(b.updated_at) - new Date(a.updated_at);
        default:
          return 0;
      }
    });
    return sorted;
  }, [tasks, sortBy]);

  async function handleCreate(title, done) {
    await onCreate(title, done);
    setShowForm(false);
  }

  async function handleUpdate(title, done) {
    await onUpdate({ ...editing, title, done });
    setEditing(null);
  }

  return (
    <section className="task-section">
      <div className="task-section-header">
        <h2>
          Tasks
          {!loading && tasks.length > 0 && (
            <span className="task-count">{tasks.length}</span>
          )}
        </h2>
        <div className="task-actions-row">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-select sort-select"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="title-az">Title A-Z</option>
            <option value="title-za">Title Z-A</option>
            <option value="recently-updated">Recently updated</option>
          </select>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(!showForm); }}>
            {showForm ? "Cancel" : "+ New Task"}
          </button>
        </div>
      </div>

      {showForm && !editing && (
        <TaskForm
          onSubmit={handleCreate}
          initialTitle=""
          onCancel={() => setShowForm(false)}
        />
      )}

      {editing && (
        <TaskForm
          onSubmit={handleUpdate}
          initialTitle={editing.title}
          initialDone={editing.done}
          taskId={editing.id}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="filter-bar">
        <input
          type="search"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-search"
        />
        <select
          value={filter.done}
          onChange={(e) => setFilter({ ...filter, done: e.target.value })}
          className="input-select"
        >
          <option value="">All</option>
          <option value="true">Completed</option>
          <option value="false">Pending</option>
        </select>
      </div>

      {loading && <div className="loading-state">Loading tasks...</div>}
      {error && <div className="error-state">Failed to load tasks</div>}
      {!loading && !error && tasks.length === 0 && !showForm && (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M3 9h18"/>
              <path d="M9 21V9"/>
            </svg>
          </div>
          <p>No tasks yet</p>
          <span>Create your first task to get started</span>
        </div>
      )}

      <div className="task-list">
        {sortedTasks.map((task) => (
          <TaskItem key={task.id} task={task} onEdit={setEditing} onDelete={onDelete} />
        ))}
      </div>
    </section>
  );
}
