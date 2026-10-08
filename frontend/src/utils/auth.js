export const getToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return token;
  } else {
    return sessionStorage.getItem("token");
  }
};
