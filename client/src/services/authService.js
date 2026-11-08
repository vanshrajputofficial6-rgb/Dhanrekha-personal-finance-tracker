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