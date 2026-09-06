import { useState, useEffect, useCallback } from "react";
import { api } from "./api.js";
import Header from "./components/Header.jsx";
import Stats from "./components/Stats.jsx";
import TaskList from "./components/TaskList.jsx";
import Toast from "./components/Toast.jsx";
import "./App.css";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState({ tasks: false });
  const [errors, setErrors] = useState({ tasks: "" });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({ done: "" });
  const [toasts, setToasts] = useState([]);

  const addToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const stats = tasks.length > 0
    ? {
        total: tasks.length,
        done: tasks.filter((t) => t.done).length,
        pending: tasks.filter((t) => !t.done).length,
      }
    : null;

  const fetchTasks = useCallback(async () => {
    setLoading((p) => ({ ...p, tasks: true }));
    setErrors((p) => ({ ...p, tasks: "" }));
    try {
      const params = {};
      if (search) params.search = search;
      if (filter.done !== "") params.done = filter.done;
      const data = await api.getTasks(params);
      setTasks(data);
    } catch (err) {
      setErrors((p) => ({ ...p, tasks: err.message }));
    } finally {
      setLoading((p) => ({ ...p, tasks: false }));
    }
  }, [search, filter]);

  useEffect(() => {
    if (!token) return;
    fetchTasks();
  }, [fetchTasks, token]);

  useEffect(() => {
    const id = setTimeout(fetchTasks, 300);
    return () => clearTimeout(id);
  }, [search, filter, fetchTasks]);

  function handleLogin(data) {
    localStorage.setItem("token", data.token);
    setToken(data.token);
    addToast("Logged in successfully");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken("");
    addToast("Logged out", "info");
    setTasks([]);
  }

  async function handleCreateTask(title, done) {
    const data = await api.createTask(title, done);
    setTasks((prev) => [...prev, data]);
    addToast("Task created");
  }

  async function handleUpdateTask(task) {
    const data = await api.updateTask(task.id, { title: task.title, done: task.done });
    setTasks((prev) => prev.map((t) => (t.id === data.id ? data : t)));
    addToast("Task updated");
  }

  async function handleDeleteTask(id) {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    addToast("Task deleted", "info");
  }

  return (
    <div className="app">
      <Header token={token} onLogin={handleLogin} onLogout={handleLogout} />
      <div className="toast-container">
        {toasts.map((t) => (
          <Toast key={t.id} msg={t.msg} type={t.type} onDismiss={() => removeToast(t.id)} />
        ))}
      </div>

      <main className="main">
        {token ? (
          <>
            <Stats stats={stats} loading={loading.tasks} error={errors.tasks} />

            <TaskList
              tasks={tasks}
              loading={loading.tasks}
              error={errors.tasks}
              onCreate={handleCreateTask}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              filter={filter}
              setFilter={setFilter}
              search={search}
              setSearch={setSearch}
            />
          </>
        ) : (
          <div className="auth-placeholder">
            <div className="auth-illustration">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--primary-bright)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18"/>
                <path d="M9 21V9"/>
              </svg>
            </div>
            <h2>Task Manager</h2>
            <p>Manage your tasks, track progress, and stay productive.</p>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Task API &mdash; Frontend</p>
      </footer>
    </div>
  );
}
