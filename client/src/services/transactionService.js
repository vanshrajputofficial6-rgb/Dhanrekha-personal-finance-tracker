import api from "./api";

export const getTransactions = (params) =>
  api.get("/transactions", { params }).then((res) => res.data);

export const createTransaction = (data) =>
  api.post("/transactions", data).then((res) => res.data);

export const updateTransaction = (id, data) =>
  api.put(`/transactions/${id}`, data).then((res) => res.data);

export const deleteTransaction = (id) =>
  api.delete(`/transactions/${id}`).then((res) => res.data);

export const getSummary = () =>
  api.get("/summary").then((res) => res.data);

export const getCategoryBreakdown = () =>
  api.get("/summary/by-category").then((res) => res.data);