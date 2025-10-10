import api from "@/lib/api";

//  Add product to cart
export const addToCart = async (
  productId: string,
  quantity: number = 1,
  color?: string,
  size?: string
) => {
  const res = await api.post("/cart", { productId, quantity, color, size });
  return res.data;
};

//  Get user's cart
export const getCart = async () => {
  const res = await api.get("/cart");
  // console.log("regetCart:",res.data);
  
  return res.data;
};

//  Update cart item quantity
export const updateCartItem = async (itemId: string, quantity: number) => {
  const res = await api.patch(`/cart/${itemId}`, { quantity });
  // console.log("res: ",res.data);
  
  return res.data;
};

//  Remove a single cart item
export const removeCartItem = async (itemId: string) => {
  const res = await api.delete(`/cart/${itemId}`);
  return res.data;
};

//  Clear entire cart
export const clearCart = async () => {
  const res = await api.delete("/cart");
  return res.data;
};
