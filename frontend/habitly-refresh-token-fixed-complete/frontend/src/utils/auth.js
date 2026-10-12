import axios from "axios";
import {
  refreshToken as refreshTokenEndpoint,
  logout as logoutEndpoint,
} from "../api/endpoints";

export const getToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

const storeRefreshedToken = (token) => {
  if (localStorage.getItem("token") !== null) {
    localStorage.setItem("token", token);
    return;
  }

  if (sessionStorage.getItem("token") !== null) {
    sessionStorage.setItem("token", token);
    return;
  }

  sessionStorage.setItem("token", token);
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  window.dispatchEvent(new CustomEvent("auth-change", { detail: false }));
};

let refreshPromise = null;

const isHabitlyApiRequest = (config) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  return Boolean(apiUrl && config?.url?.startsWith(apiUrl));
};

const shouldSkipRefresh = (config) => {
  const url = config?.url || "";

  return (
    url.includes("/login") ||
    url.includes("/register") ||
    url.includes("/forgot-password") ||
    url.includes("/refresh") ||
    url.includes("/logout")
  );
};

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        refreshTokenEndpoint,
        {},
        {
          withCredentials: true,
          skipAuthRefresh: true,
        },
      )
      .then((response) => {
        const token = response.data?.token;

        if (!token) {
          throw new Error("Refresh response did not contain an access token");
        }

        storeRefreshedToken(token);
        return token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const setupAuthInterceptor = () => {
  if (setupAuthInterceptor.initialized) {
    return;
  }

  setupAuthInterceptor.initialized = true;

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status !== 401 ||
        !originalRequest ||
        !isHabitlyApiRequest(originalRequest) ||
        originalRequest._retry ||
        originalRequest.skipAuthRefresh ||
        shouldSkipRefresh(originalRequest)
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const token = await refreshAccessToken();

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${token}`,
        };

        return axios(originalRequest);
      } catch (refreshError) {
        clearAuth();
        return Promise.reject(refreshError);
      }
    },
  );
};

export const logoutUser = async () => {
  try {
    await axios.post(
      logoutEndpoint,
      {},
      {
        withCredentials: true,
        skipAuthRefresh: true,
      },
    );
  } finally {
    clearAuth();
  }
};

export const notifyLogin = () => {
  window.dispatchEvent(new CustomEvent("auth-change", { detail: true }));
};

export const notifyLogout = () => {
  window.dispatchEvent(new CustomEvent("auth-change", { detail: false }));
};
