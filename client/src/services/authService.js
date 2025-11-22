import axios from "axios";

const API_URL = "/api/auth";

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const demoLogin = async ({ email, role } = { role: "admin" }) => {
  const response = await axios.post(`${API_URL}/demo-login`, { email, role });
  return response.data;
};

export const registerUser = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/register`, {
    name,
    email,
    password,
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
