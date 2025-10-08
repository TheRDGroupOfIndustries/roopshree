import api from "@/lib/api";

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  console.log("res loginUser: ",res);
  return res.data;
};

export const registerUser = async (name: string, email: string, password: string,confirmPassword: string) => {
  const res = await api.post("/auth/signup", { name, email, password ,confirmPassword});
  console.log("res registerUser: ",res);
  
  return res.data;
};
export const getMe = async () => {
  const res = await api.get("/auth/me");
  console.log("res getMe: ",res);
  return res.data;
};


