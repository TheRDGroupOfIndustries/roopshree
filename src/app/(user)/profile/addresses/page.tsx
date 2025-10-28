"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  MapPin,
  Plus,
  X,
  Pencil,
  Trash2,
  ArrowLeft,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import {
  getAllAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "@/services/addressService";
import SmallLoadingSpinner from "@/Components/SmallLoadingSpinner";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface AddressFormProps {
  initialAddress: Address | null;
  onSave: (data: Omit<Address, "id">) => Promise<void>;
  onClose: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  initialAddress,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<Omit<Address, "id">>({
    name: initialAddress?.name || "",
    phone: initialAddress?.phone || "",
    address: initialAddress?.address || "",
    city: initialAddress?.city || "",
    state: initialAddress?.city || "",
    country: "IN",
    zipCode: initialAddress?.zipCode || "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  const isEditing = !!initialAddress;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 bg-opacity-60 flex items-center justify-center px-2 pb-16">
      <div
        className="relative w-full max-w-xs sm:max-w-md bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <header className="flex justify-between items-center p-3 border-b border-gray-100 bg-white">
          <h2 className="text-base font-bold text-gray-800">
            {isEditing ? "Edit Address" : "Add New Address"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
          >
            <X size={20} />
          </button>
        </header>

        {/* Form */}
        <form
          className="flex-1 overflow-y-auto px-3 py-4 space-y-3"
          onSubmit={handleSave}
        >
          {[
            {
              id: "name",
              label: "Full Name",
              placeholder: "e.g., Chetan Doniwal",
            },
            {
              id: "phone",
              label: "Phone Number",
              placeholder: "+91 9876543210",
            },
            {
              id: "address",
              label: "Street Address",
              placeholder: "e.g., 123, Green Park Road",
            },
            { id: "city", label: "City", placeholder: "e.g., Indore" },
            { id: "state", label: "State", placeholder: "e.g., Madhya Pradesh" },
            // { id: "country", label: "Country", placeholder: "e.g., India" },
            { id: "zipCode", label: "Pincode", placeholder: "e.g., 452001" },
          ].map((input) => (
            <div key={input.id}>
              <label
                htmlFor={input.id}
                className="block text-gray-600 text-xs mb-1"
              >
                {input.label}
              </label>
              <input
                id={input.id}
                name={input.id}
                type="text"
                required
                value={(formData as any)[input.id]}
                onChange={handleChange}
                placeholder={input.placeholder}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-300"
              />
            </div>
          ))}

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full flex justify-center items-center gap-2 bg-sky-600 text-white py-2 rounded-lg font-semibold hover:bg-sky-700 transition-all shadow text-xs disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <SmallLoadingSpinner />
                  Saving...
                </>
              ) : (
                <>{isEditing ? "Update Address" : "Save Address"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ✅ Main Page
const AddressesPage: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const [showConfirm, setShowConfirm] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await getAllAddresses();
      setAddresses(data);
    } catch (err) {
      console.error("Failed to fetch addresses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleOpenModal = useCallback((address: Address | null = null) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setEditingAddress(null);
    setIsModalOpen(false);
  }, []);

  // ✅ Save or Update Address
  const handleSaveAddress = async (formData: Omit<Address, "id">) => {
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, formData);
        toast.success("Address updated successfully!");
      } else {
        await createAddress(formData);
        toast.success("Address added successfully!");
      }
      await fetchAddresses();
      handleCloseModal();
    } catch (err: any) {
      console.error("Error saving address", err);
      toast.error(err.response?.data?.error || "Failed to save address");
    }
  };

  // ✅ Delete Address
  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteAddress(id);
      toast.success("Address deleted successfully!");
      await fetchAddresses();
    } catch (err: any) {
      console.error("Failed to delete address", err);
      toast.error(err.response?.data?.message || "Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  };

  const Header = () => (
    <header className="sticky top-0   flex justify-between items-center px-3 sm:px-6 py-3 shadow-sm z-20 border-gray-200">
      <button
        onClick={() => router.back()}
        aria-label="Go back"
        className="  hover:text-sky-600 transition-colors p-2 hover:bg-sky-50 rounded-full"
      >
        <ArrowLeft size={22} />
      </button>
      <h2 className="font-bold text-lg sm:text-xl   flex-1 text-center">
        Addresses
      </h2>
    </header>
  );

  return (
    <div className="min-h-screen  bg-white text-black">
      <Header />

      <div className="px-3  py-2">
        <div className=" p-2 rounded-xl max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-4 sm:mb-6 border-b pb-3">
            <h1 className="text-base sm:text-lg font-semibold  ">
              Your Saved Addresses
            </h1>
            <button
              onClick={() => {
                handleOpenModal();
              }}
              className="flex items-center bg-[var(--color-brand)] text-white py-1.5 px-3 sm:py-2 sm:px-4 rounded-full text-sm font-medium hover:bg-[var(--color-brand-hover)]  transition-colors disabled:opacity-60"
              disabled={addresses.length >= 2}
            >
              <Plus size={16} className="mr-1" /> Add
            </button>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="text-center  py-8 flex items-center justify-center gap-2">
              <SmallLoadingSpinner />
              Loading addresses...
            </div>
          ) : addresses.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="inline-block bg-sky-100 text-sky-700 text-xs font-medium px-2 py-1 rounded-full border border-sky-200">
                      {address.state}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(address)}
                        className="text-sky-600 hover:text-sky-800 disabled:opacity-50"
                        disabled={deletingId === address.id}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setAddressToDelete(address.id);
                          setShowConfirm(true);
                        }}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        disabled={deletingId === address.id}
                      >
                        {deletingId === address.id ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className=" mr-2 mt-1" size={18} />
                    <div>
                      <p className="font-semibold  text-sm sm:text-base">
                        {address.name}
                      </p>
                      <p className="text-xs sm:text-sm   mt-1">
                        {address.address}, {address.city}
                      </p>
                      <p className="text-xs sm:text-sm  ">
                        {address.state},{" "}
                        {address.country === "IN" ? "India" : address.country} -{" "}
                        {address.zipCode}
                      </p>

                      <p className="text-xs sm:text-sm   font-medium mt-2">
                        {address.phone}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10  border-dashed border-2 border-gray-300 rounded-lg">
              <MapPin className="mx-auto mb-3 " size={28} />
              <p className="font-medium text-sm">No saved addresses yet</p>
              <p className="text-xs mt-1">
                Tap “Add” to save your first address.
              </p>
            </div>
          )}
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl p-4 shadow-lg w-[80%] max-w-[300px] border border-gray-100">
            <h4 className="text-md font-semibold mb-2 text-gray-900 text-center">
              Delete Address
            </h4>
            <p className="text-gray-600 mb-4 text-sm text-center">
              Are you sure you want to delete this address?
            </p>
            <div className="flex gap-2">
              <button
                className="flex-1 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
                onClick={() => {
                  if (addressToDelete) {
                    handleDelete(addressToDelete);
                  }
                  setShowConfirm(false);
                  setAddressToDelete(null);
                }}
              >
                Yes
              </button>
              <button
                className="flex-1 px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium transition-colors"
                onClick={() => {
                  setShowConfirm(false);
                  setAddressToDelete(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <AddressForm
          initialAddress={editingAddress}
          onSave={handleSaveAddress}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AddressesPage;
