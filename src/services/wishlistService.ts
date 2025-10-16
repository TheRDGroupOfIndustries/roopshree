import api from "@/lib/api";

//  Wishlist API 


//  Add product to wishlist
export const addToWishlist = async (productId: string) => {
  const res = await api.post("/api/wishlist", { productId });
  // console.log("addToWishlist,",res.data);
  
  return res.data;
};

//  Remove product from wishlist
export const removeFromWishlist = async (productId: string) => {
    const res = await api.delete(`/api/wishlist/${productId}`);
    // console.log("removeFromWishlist,",res.data);
  return res.data;
};

// Fetch user's wishlist
export const getWishlist = async () => {
  const res = await api.get("/api/wishlist");
  // console.log("getWishlist: ",res);
  
  return res.data;
};