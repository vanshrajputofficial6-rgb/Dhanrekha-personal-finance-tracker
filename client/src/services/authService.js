import api from "./api";

export const register = (data) =>
  api.post("/auth/register", data).then((res) => {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data.user;
  });

export const login = (data) =>
  api.post("/auth/login", data).then((res) => {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data.user;
  });

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const isLoggedIn = () => Boolean(localStorage.getItem("token"));

export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email }).then((res) => res.data);

export const resetPassword = (token, password) =>
  api.post(`/auth/reset-password/${token}`, { password }).then((res) => res.data);