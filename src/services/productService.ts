import api from "@/lib/api";

// interface CreateProductBody {
//   title: string;
//   description: string;
//   images: string[];
//   details: string;
//   insideBox: string[];
//   initialStock: number;
// }

export const getAllProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};
