import api from "@/lib/api";

export const getAllCategories = async () => {
  const res = await api.get("/api/category");
 return res.data;
};

