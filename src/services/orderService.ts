import api from "@/lib/api";
import { clearCart } from "./cartService";

export interface OrderProduct {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface CreateOrder {
  totalAmount: number;
  address: string;
  paymentMode?: string;
  referralCode?: string;
  products: OrderProduct[];
}

// ✅ Get all orders (admin) or user orders
export const getOrders = async () => {
  const res = await api.get("/order");
  //   console.log("getOrders:", res);
  return res.data;
};

// ✅ Create new order
export const createOrder = async (data: CreateOrder) => {
  const res = await api.post("/order", data);
    console.log("createOrder:", res);
  //   await clearCart()
  return res.data;
};

// ✅ Delete / Cancel order by ID
export const cancelOrder = async (id: string) => {
  const res = await api.delete(`/order/${id}`);
  //   console.log("cancelOrder:", res);
  return res.data;
};
