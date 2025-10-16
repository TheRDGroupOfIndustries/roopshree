import api from "@/lib/api";


export const getAllProducts = async () => {
  const res = await api.get("/api/products");
  return res.data;
};


export const getProductById = async (id: string) => {
  const res = await api.get(`/api/products/${id}`);
  return res.data;
};

