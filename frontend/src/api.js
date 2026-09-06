const BASE_URL = "/api";

function getToken() {
  return localStorage.getItem("token");
}

function getHeaders(extra = {}) {
  const headers = { "Content-Type": "application/json", ...extra };
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function request(url, options = {}) {
  const config = {
    ...options,
    headers: getHeaders(options.headers || {}),
  };
  const res = await fetch(`${BASE_URL}${url}`, config);
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const error = data?.error || `Request failed with status ${res.status}`;
    throw new Error(error);
  }
  return data;
}

export const api = {
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  signup: (email, password) =>
    request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  getProtected: () => request("/auth/protected"),
  getTasks: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/tasks${qs ? "?" + qs : ""}`);
  },
  createTask: (title, done) =>
    request("/tasks", {
      method: "POST",
      body: JSON.stringify({ title, done }),
    }),
  getTask: (id) => request(`/tasks/${id}`),
  updateTask: (id, data) =>
    request(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
};
