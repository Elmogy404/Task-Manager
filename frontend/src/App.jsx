import { useState, useEffect, useCallback } from "react";
import { api } from "./api.js";
import Header from "./components/Header.jsx";
import Stats from "./components/Stats.jsx";
import TaskList from "./components/TaskList.jsx";
import "./App.css";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState({ tasks: false, stats: false });
  const [errors, setErrors] = useState({ tasks: "", stats: "" });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({ done: "" });
  const [authMsg, setAuthMsg] = useState("");

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

  const fetchStats = useCallback(async () => {
    setLoading((p) => ({ ...p, stats: true }));
    setErrors((p) => ({ ...p, stats: "" }));
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (err) {
      setErrors((p) => ({ ...p, stats: err.message }));
    } finally {
      setLoading((p) => ({ ...p, stats: false }));
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  // Auto-refresh when filter/search changes
  useEffect(() => {
    const id = setTimeout(fetchTasks, 300);
    return () => clearTimeout(id);
  }, [search, filter, fetchTasks]);

  function handleLogin() {
    setToken(localStorage.getItem("token") || "");
    setAuthMsg("Logged in successfully");
    setTimeout(() => setAuthMsg(""), 3000);
    fetchTasks();
    fetchStats();
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken("");
    setAuthMsg("Logged out");
    setTimeout(() => setAuthMsg(""), 3000);
    setTasks([]);
    setStats(null);
  }

  async function handleCreateTask(title) {
    const data = await api.createTask(title);
    setTasks((prev) => [...prev, data]);
    fetchStats();
  }

  async function handleUpdateTask(task) {
    const data = await api.updateTask(task.id, { title: task.title, done: task.done });
    setTasks((prev) => prev.map((t) => (t.id === data.id ? data : t)));
    fetchStats();
  }

  async function handleDeleteTask(id) {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    fetchStats();
  }

  return (
    <div className="app">
      <Header token={token} onLogin={handleLogin} onLogout={handleLogout} />
      {authMsg && <div className="toast">{authMsg}</div>}

      <main className="main">
        <Stats stats={stats} loading={loading.stats} error={errors.stats} />

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
      </main>

      <footer className="footer">
        <p>Task API &mdash; Frontend</p>
      </footer>
    </div>
  );
}
