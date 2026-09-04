import { useState } from "react";
import TaskItem from "./TaskItem.jsx";
import TaskForm from "./TaskForm.jsx";

export default function TaskList({ tasks, loading, error, onCreate, onUpdate, onDelete, filter, setFilter, search, setSearch }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  async function handleCreate(title) {
    await onCreate(title);
    setShowForm(false);
  }

  async function handleUpdate(task) {
    await onUpdate(task);
    setEditing(null);
  }

  return (
    <section className="task-section">
      <div className="task-section-header">
        <h2>Tasks</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ New Task"}
        </button>
      </div>

      {showForm && (
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
      {!loading && !error && tasks.length === 0 && (
        <div className="empty-state">No tasks found</div>
      )}

      <div className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onEdit={setEditing}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
