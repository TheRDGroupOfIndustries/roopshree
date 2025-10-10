import api from "@/lib/api";

export const loginUser = async (email: string, password: string) => {
<<<<<<< HEAD
  const res = await api.post("/auth/signin", { email, password });
  // const res = await api.post("/auth/login", { email, password });

=======
  const res = await api.post("/auth/login", { email, password });
>>>>>>> 7255ebd5fd2d0f35dcc89fb3fdaf77bae5225590
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
