const BASE_URL = import.meta.env.VITE_API_URL || "https://ricardo-rpplanejados.vercel.app";

async function request(endpoint, options = {}) {
  const { method = "GET", body = null } = options;

  const url = endpoint.startsWith("/")
    ? `${BASE_URL}${endpoint}`
    : `${BASE_URL}/${endpoint}`;

  const headers = {};

  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions = {
    method,
    headers
  };

  if (body instanceof FormData) {
    fetchOptions.body = body;
  } else if (body) {
    headers["Content-Type"] = "application/json";
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (window.location.pathname.startsWith("/admin")) {
      window.location.href = "/admin/login";
    }
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const data = await response.json();
      errorMessage = data.message || data.error || errorMessage;
    } catch {
      errorMessage = await response.text() || errorMessage;
    }
    throw new Error(errorMessage);
  }

  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const api = {
  get: (endpoint) => request(endpoint, { method: "GET" }),
  post: (endpoint, data) => request(endpoint, { method: "POST", body: data }),
  put: (endpoint, data) => request(endpoint, { method: "PUT", body: data }),
  patch: (endpoint, data) => request(endpoint, { method: "PATCH", body: data }),
  delete: (endpoint) => request(endpoint, { method: "DELETE" })
};

export default api;