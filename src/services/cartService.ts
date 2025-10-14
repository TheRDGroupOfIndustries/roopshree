import api from "@/lib/api";

//  Add product to cart
export const addToCart = async (
  productId: string,
  quantity: number = 1,
  color?: string,
  size?: string
) => {
  const res = await api.post("/my-cart", { productId, quantity, color, size });
  return res.data;
};

//  Get user's cart
export const getCart = async () => {
  const res = await api.get("/my-cart");
return res.data;
};

//  Update cart item quantity
export const updateCartItem = async (itemId: string, quantity: number) => {
  const res = await api.patch(`/my-cart/${itemId}`, { quantity });
  return res.data;
};

//  Remove a single cart item
export const removeCartItem = async (itemId: string) => {
  const res = await api.delete(`/my-cart/${itemId}`);
  return res.data;
};

//  Clear entire cart
export const clearCart = async () => {
  const res = await api.delete("/my-cart/clear");
  return res.data;
};
