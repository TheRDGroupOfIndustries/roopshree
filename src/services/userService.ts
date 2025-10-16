import api from "@/lib/api";

// ✅ Get user by ID
export const getUserById = async (id: string) => {
  const res = await api.post(`/api/auth/${id}`);
  console.log("getUserById:", res);
  return res.data;
};

// ✅ Update user details by ID
export const updateUser = async (
  id: string,
  data: {
    name?: string;
    profileImage?: string;
    email?: string;
  }
) => {
  const res = await api.put(`/api/auth/${id}`, data);
  console.log("updateUser:", res);
  return res.data;
};
