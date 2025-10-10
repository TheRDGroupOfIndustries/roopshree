import api from "@/lib/api";

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  const res = await api.post("/auth/signup", {
    name,
    email,
    password,
    confirmPassword,
  });
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

export const getMe = async () => {
  const res = await api.get("/auth/me");
  // console.log("getMe: ", res.data);

  return res.data;
};
