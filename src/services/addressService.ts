import api from "@/lib/api";

// Get all addresses for logged-in user
export const getAllAddresses = async () => {
  const res = await api.get("/api/address");
  return res.data;
};

// Create a new address
export const createAddress = async (data: {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  name: string;
}) => {
  const res = await api.post("/api/address", data);
  return res.data;
};

// Update an existing address by ID
export const updateAddress = async (id: string, data: Partial<{
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  name: string;
}>) => {
  const res = await api.patch(`/api/address/${id}`, data);
  return res.data;
};

// Delete an address by ID
export const deleteAddress = async (id: string) => {
  const res = await api.delete(`/api/address/${id}`);
  return res.data;
};
