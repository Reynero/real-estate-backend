import axios from "axios";

// Central axios instance. Every feature's API module imports this
// instead of creating its own client, so auth headers and error
// handling stay in one place.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// The auth store (Zustand + persist) is the single source of truth for
// the token, saved under this localStorage key. Reading it directly here
// avoids a circular import between the store and this client.
const AUTH_STORAGE_KEY = "auth-storage";

function readToken(): string | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw)?.state?.token ?? null;
  } catch {
    return null;
  }
}

// Attach the JWT to every outgoing request, if we have one.
apiClient.interceptors.request.use((config) => {
  const token = readToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the backend says the token is no longer valid, clear it and
// send the user back to login. Keeping this here means no feature
// has to remember to handle 401s itself.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);