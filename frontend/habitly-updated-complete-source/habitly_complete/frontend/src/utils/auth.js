export const getToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  window.dispatchEvent(new CustomEvent("auth-change", { detail: false }));
};

export const notifyLogin = () => {
  window.dispatchEvent(new CustomEvent("auth-change", { detail: true }));
};

export const notifyLogout = () => {
  window.dispatchEvent(new CustomEvent("auth-change", { detail: false }));
};
