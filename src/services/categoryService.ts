import api from "@/lib/api";

export const getAllCategories = async () => {
  const res = await api.get("/category");
  console.log("getAllCategories: ",res);
  
  return res.data;
};

