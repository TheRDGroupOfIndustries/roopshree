// "use client";

// import React, { useState, useCallback } from "react";
// import {
//   MapPin,
//   Plus,
//   X,
//   Pencil,
//   Trash2,
//   ArrowLeft,
//   ShoppingCart,
// } from "lucide-react";
// import Link from "next/link";

// // --- Interfaces ---
// interface Address {
//   id: string;
//   label: "Home" | "Work" | "Other";
//   name: string;
//   street: string;
//   cityState: string;
//   phone: string;
// }

// interface AddressFormProps {
//   initialAddress: Address | null;
//   onSave: (address: Omit<Address, "id">) => void;
//   onClose: () => void;
// }

// // --- Initial Data ---
// const initialAddresses: Address[] = [
//   {
//     id: "1",
//     label: "Home",
//     name: "Priya Sharma",
//     street: "123, Green Park Road",
//     cityState: "Noida, Uttar Pradesh 201301",
//     phone: "+91 9876543210",
//   },
//   {
//     id: "2",
//     label: "Work",
//     name: "Priya Sharma",
//     street: "A-45, Sector 62, TechPark Office",
//     cityState: "Noida, Uttar Pradesh 201309",
//     phone: "+91 9876543210",
//   },
// ];

// // -------- Address Form Modal (Reverted to its original address-saving purpose for clarity) --------

// const AddressForm: React.FC<AddressFormProps> = ({
//   initialAddress,
//   onSave,
//   onClose,
// }) => {
//   const [formData, setFormData] = useState<Omit<Address, "id">>({
//     label: initialAddress?.label || "Home",
//     name: initialAddress?.name || "",
//     street: initialAddress?.street || "",
//     cityState: initialAddress?.cityState || "",
//     phone: initialAddress?.phone || "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSave = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSave(formData);
//     onClose();
//   };

//   const isEditing = !!initialAddress;

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-aut bg-black bg-opacity-100 flex items-center justify-center p-4">
//       <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden animate-slide-in">
        
//         {/* Modal Header */}
//         <header className="flex justify-between items-center p-5 border-b border-gray-100 bg-white">
//           <h2 className="text-xl font-bold text-gray-800">
//             {isEditing ? "Edit Delivery Address" : "Add New Address"}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
//           >
//             <X size={24} />
//           </button>
//         </header>

//         {/* Form Body */}
//         <form className="p-5 space-y-4" onSubmit={handleSave}>
          
//           {/* Label Selector */}
//           <div>
//             <label className="block text-gray-600 text-sm mb-2">Address Type</label>
//             <div className="flex gap-3">
//               {(["Home", "Work", "Other"] as const).map((label) => (
//                 <button
//                   key={label}
//                   type="button"
//                   onClick={() => setFormData({ ...formData, label })}
//                   className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
//                     formData.label === label
//                       ? "bg-sky-600 text-white border-sky-600"
//                       : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
//                   }`}
//                 >
//                   {label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Input Fields */}
//           <div>
//             <label htmlFor="name" className="block text-gray-600 text-sm mb-1">Recipient Name</label>
//             <input
//               id="name"
//               name="name"
//               type="text"
//               required
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="e.g., Priya Sharma"
//               className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
//             />
//           </div>

//           <div>
//             <label htmlFor="street" className="block text-gray-600 text-sm mb-1">Street Address</label>
//             <input
//               id="street"
//               name="street"
//               type="text"
//               required
//               value={formData.street}
//               onChange={handleChange}
//               placeholder="e.g., 123, Green Park Road"
//               className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
//             />
//           </div>

//           <div>
//             <label htmlFor="cityState" className="block text-gray-600 text-sm mb-1">City, State & Pincode</label>
//             <input
//               id="cityState"
//               name="cityState"
//               type="text"
//               required
//               value={formData.cityState}
//               onChange={handleChange}
//               placeholder="e.g., Noida, UP 201301"
//               className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
//             />
//           </div>

//           <div>
//             <label htmlFor="phone" className="block text-gray-600 text-sm mb-1">Phone Number</label>
//             <input
//               id="phone"
//               name="phone"
//               type="tel"
//               required
//               value={formData.phone}
//               onChange={handleChange}
//               placeholder="+91 9876543210"
//               className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
//             />
//           </div>

//           {/* Save Button */}
//           <div className="pt-4">
//             <button
//               type="submit"
//               className="w-full bg-sky-600 text-white py-3 rounded-lg font-semibold hover:bg-sky-700 transition-all shadow-md"
//             >
//               {isEditing ? "Update Address" : "Save Address"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };


// // -------- Main Page (with added Header/Navbar) --------

// const AddressesPage: React.FC = () => {
//   const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingAddress, setEditingAddress] = useState<Address | null>(null);

//   const handleOpenModal = useCallback((address: Address | null = null) => {
//     setEditingAddress(address);
//     setIsModalOpen(true);
//   }, []);

//   const handleCloseModal = useCallback(() => {
//     setEditingAddress(null);
//     setIsModalOpen(false);
//   }, []);

//   const handleSaveAddress = (newData: Omit<Address, "id">) => {
//     if (editingAddress) {
//       setAddresses((prev) =>
//         prev.map((addr) =>
//           addr.id === editingAddress.id ? { ...addr, ...newData } : addr
//         )
//       );
//     } else {
//       const newAddress = { id: Date.now().toString(), ...newData };
//       setAddresses((prev) => [...prev, newAddress]);
//     }
//     handleCloseModal(); // Close after saving
//   };

//   const handleDelete = (id: string) => {
//     if (confirm("Are you sure you want to delete this address?")) {
//       setAddresses((prev) => prev.filter((a) => a.id !== id));
//     }
//   };

//   // --- Perfect and Responsive Header/Navbar ---
//   const Header = () => (
//     <header className="sticky top-0 bg-white flex justify-between items-center px-4 sm:px-6 py-3 shadow-md z-20 border-b border-gray-200">
//       <button
//         className="text-gray-700 hover:text-sky-600 transition-colors p-2 hover:bg-sky-50 rounded-full"
//         onClick={() => window.history.back()}
//         aria-label="Go back"
//       >
//         <ArrowLeft size={24} />
//       </button>
//       <h2 className="font-bold text-xl sm:text-2xl flex-1 text-center text-gray-800">
//         Delivery Addresses
//       </h2>
//       <Link href="/my-cart" aria-label="View shopping cart">
//         <button className="relative text-gray-700 hover:text-sky-600 p-2 hover:bg-sky-50 rounded-full transition-colors">
//           <ShoppingCart size={24} />
//           <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
//             2
//           </span>
//         </button>
//       </Link>
//     </header>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
      
//       {/* 1. Header/Navbar */}
//       <Header />

//       {/* 2. Main Content */}
//       <div className="px-4 sm:px-6 py-8">
//         <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-xl">
//           <div className="flex justify-between items-center mb-6 border-b pb-4">
//             <h1 className="text-xl font-semibold text-gray-800">
//               Your Saved Addresses
//             </h1>
//             <button
//               onClick={() => handleOpenModal()}
//               className="flex items-center bg-sky-600 text-white py-2 px-3 rounded-full text-sm font-medium hover:bg-sky-700 transition-colors shadow-md"
//             >
//               <Plus size={18} className="mr-1" /> Add New
//             </button>
//           </div>

//           {/* Address List */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//             {addresses.length ? (
//               addresses.map((address) => (
//                 <div
//                   key={address.id}
//                   className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition relative"
//                 >
//                   <div className="absolute top-0 right-0 p-3">
//                      <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700 ring-1 ring-inset ring-sky-200">
//                       {address.label}
//                     </span>
//                   </div>
//                   <div className="flex items-start mb-3">
//                     <MapPin className="text-sky-600 mr-3 mt-1" size={20} />
//                     <div>
//                       <p className="font-bold text-lg text-gray-900">{address.name}</p>
//                       <p className="text-sm text-gray-700 mt-1">{address.street}</p>
//                       <p className="text-sm text-gray-700">{address.cityState}</p>
//                       <p className="text-sm text-sky-700 font-medium mt-2">{address.phone}</p>
//                     </div>
//                   </div>

//                   <div className="flex gap-4 mt-4 border-t pt-3">
//                     <button
//                       onClick={() => handleOpenModal(address)}
//                       className="flex items-center text-sm font-medium text-sky-600 hover:text-sky-800 transition-colors"
//                     >
//                       <Pencil size={16} className="mr-1" /> Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(address.id)}
//                       className="flex items-center text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
//                     >
//                       <Trash2 size={16} className="mr-1" /> Delete
//                     </button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="col-span-full text-center py-10 text-gray-500 border-dashed border-2 border-gray-300 rounded-lg">
//                 <MapPin className="mx-auto mb-3 text-gray-400" size={30} />
//                 <p className="font-medium">No saved addresses yet</p>
//                 <p className="text-sm mt-1">Click Add New to save your first address.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* 3. Address Form Modal (Rendered on top of everything) */}
//       {isModalOpen && (
//         <AddressForm
//           initialAddress={editingAddress}
//           onSave={handleSaveAddress}
//           onClose={handleCloseModal}
//         />
//       )}
//     </div>
//   );
// };

// export default AddressesPage;



// "use client";

// import React, { useEffect, useState, useCallback } from "react";
// import {
//   MapPin,
//   Plus,
//   X,
//   Pencil,
//   Trash2,
//   ArrowLeft,
//   ShoppingCart,
// } from "lucide-react";
// import Link from "next/link";
// import {
//   getAllAddresses,
//   createAddress,
//   updateAddress,
//   deleteAddress,
// } from "@/services/addressService";

// interface Address {
//   id: string;
//   name: string;
//   phone: string;
//   address: string;
//   city: string;
//   state: string;
//   country: string;
//   zipCode: string;
// }

// interface AddressFormProps {
//   initialAddress: Address | null;
//   onSave: (data: Omit<Address, "id">) => void;
//   onClose: () => void;
// }


// const AddressForm: React.FC<AddressFormProps> = ({
//   initialAddress,
//   onSave,
//   onClose,
// }) => {
//   const [formData, setFormData] = useState<Omit<Address, "id">>({
//     name: initialAddress?.name || "",
//     phone: initialAddress?.phone || "",
//     address: initialAddress?.address || "",
//     city: initialAddress?.city || "",
//     state: initialAddress?.state || "",
//     country: initialAddress?.country || "",
//     zipCode: initialAddress?.zipCode || "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSave = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSave(formData);
//   };

//   const isEditing = !!initialAddress;

//   return (
//     <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-2 pb-16">
//       <div className="relative w-full max-w-xs sm:max-w-md bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
//         style={{ maxHeight: "90vh" }}
//       >
//         {/* Header */}
//         <header className="flex justify-between items-center p-3 border-b border-gray-100 bg-white">
//           <h2 className="text-base font-bold text-gray-800">
//             {isEditing ? "Edit Address" : "Add New Address"}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
//           >
//             <X size={20} />
//           </button>
//         </header>

//         {/* Form */}
//         <form
//           className="flex-1 overflow-y-auto px-3 py-4 space-y-3"
//           onSubmit={handleSave}
//         >
//           {[
//             { id: "name", label: "Full Name", placeholder: "e.g., Chetan Doniwal" },
//             { id: "phone", label: "Phone Number", placeholder: "+91 9876543210" },
//             { id: "address", label: "Street Address", placeholder: "e.g., 123, Green Park Road" },
//             { id: "city", label: "City", placeholder: "e.g., Indore" },
//             { id: "state", label: "State", placeholder: "e.g., Madhya Pradesh" },
//             { id: "country", label: "Country", placeholder: "e.g., India" },
//             { id: "zipCode", label: "Pincode", placeholder: "e.g., 452001" },
//           ].map((input) => (
//             <div key={input.id}>
//               <label
//                 htmlFor={input.id}
//                 className="block text-gray-600 text-xs mb-1"
//               >
//                 {input.label}
//               </label>
//               <input
//                 id={input.id}
//                 name={input.id}
//                 type="text"
//                 required
//                 value={(formData as any)[input.id]}
//                 onChange={handleChange}
//                 placeholder={input.placeholder}
//                 className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-300"
//               />
//             </div>
//           ))}

//           {/* Save Button */}
//           <div className="pt-2">
//             <button
//               type="submit"
//               className="w-full bg-sky-600 text-white py-2 rounded-lg font-semibold hover:bg-sky-700 transition-all shadow text-xs"
//             >
//               {isEditing ? "Update Address" : "Save Address"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // ✅ Main Page
// const AddressesPage: React.FC = () => {
//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingAddress, setEditingAddress] = useState<Address | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch all addresses
//   const fetchAddresses = async () => {
//     try {
//       setLoading(true);
//       const data = await getAllAddresses();
//       setAddresses(data);
//     } catch (err) {
//       console.error("Failed to fetch addresses", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAddresses();
//   }, []);

//   const handleOpenModal = useCallback((address: Address | null = null) => {
//     setEditingAddress(address);
//     setIsModalOpen(true);
//   }, []);

//   const handleCloseModal = useCallback(() => {
//     setEditingAddress(null);
//     setIsModalOpen(false);
//   }, []);

//   // ✅ Save or Update Address
//   const handleSaveAddress = async (formData: Omit<Address, "id">) => {
//     try {
//       if (editingAddress) {
//         await updateAddress(editingAddress.id, formData);
//       } else {
//         await createAddress(formData);
//       }
//       await fetchAddresses();
//       handleCloseModal();
//     } catch (err) {
//       console.error("Error saving address", err);
//     }
//   };

//   // ✅ Delete Address
//   const handleDelete = async (id: string) => {
//     if (confirm("Are you sure you want to delete this address?")) {
//       try {
//         await deleteAddress(id);
//         await fetchAddresses();
//       } catch (err) {
//         console.error("Failed to delete address", err);
//       }
//     }
//   };

//   // ✅ Header
//   const Header = () => (
//     <header className="sticky top-0 bg-white flex justify-between items-center px-3 sm:px-6 py-3 shadow-sm z-20 border-b border-gray-200">
//       <button
//         onClick={() => window.history.back()}
//         aria-label="Go back"
//         className="text-gray-700 hover:text-sky-600 transition-colors p-2 hover:bg-sky-50 rounded-full"
//       >
//         <ArrowLeft size={22} />
//       </button>
//       <h2 className="font-bold text-lg sm:text-xl text-gray-800 flex-1 text-center">
//         Addresses
//       </h2>
//       <Link href="/my-cart">
//         <button className="relative text-gray-700 hover:text-sky-600 p-2 hover:bg-sky-50 rounded-full">
//           <ShoppingCart size={22} />
//           <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-1.5 py-[1px] rounded-full">
//             2
//           </span>
//         </button>
//       </Link>
//     </header>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />

//       <div className="px-3 sm:px-6 py-6">
//         <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md max-w-3xl mx-auto">
//           <div className="flex justify-between items-center mb-4 sm:mb-6 border-b pb-3">
//             <h1 className="text-base sm:text-lg font-semibold text-gray-800">
//               Your Saved Addresses
//             </h1>
//             <button
//               onClick={() => handleOpenModal()}
//               className="flex items-center bg-sky-600 text-white py-1.5 px-3 sm:py-2 sm:px-4 rounded-full text-sm font-medium hover:bg-sky-700 transition-colors"
//             >
//               <Plus size={16} className="mr-1" /> Add
//             </button>
//           </div>

//           {/* Address List */}
//           {loading ? (
//             <p className="text-center text-gray-500 py-8">Loading addresses...</p>
//           ) : addresses.length ? (
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               {addresses.map((address) => (
//                 <div
//                   key={address.id}
//                   className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
//                 >
//                   <div className="flex justify-between items-start mb-2">
//                     <span className="inline-block bg-sky-100 text-sky-700 text-xs font-medium px-2 py-1 rounded-full border border-sky-200">
//                       {address.state}
//                     </span>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => handleOpenModal(address)}
//                         className="text-sky-600 hover:text-sky-800"
//                       >
//                         <Pencil size={16} />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(address.id)}
//                         className="text-red-600 hover:text-red-800"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   </div>

//                   <div className="flex items-start">
//                     <MapPin className="text-sky-600 mr-2 mt-1" size={18} />
//                     <div>
//                       <p className="font-semibold text-gray-900 text-sm sm:text-base">
//                         {address.name}
//                       </p>
//                       <p className="text-xs sm:text-sm text-gray-700 mt-1">
//                         {address.address}, {address.city}
//                       </p>
//                       <p className="text-xs sm:text-sm text-gray-700">
//                         {address.state}, {address.country} - {address.zipCode}
//                       </p>
//                       <p className="text-xs sm:text-sm text-sky-700 font-medium mt-2">
//                         {address.phone}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-10 text-gray-500 border-dashed border-2 border-gray-300 rounded-lg">
//               <MapPin className="mx-auto mb-3 text-gray-400" size={28} />
//               <p className="font-medium text-sm">No saved addresses yet</p>
//               <p className="text-xs mt-1">
//                 Tap “Add” to save your first address.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <AddressForm
//           initialAddress={editingAddress}
//           onSave={handleSaveAddress}
//           onClose={handleCloseModal}
//         />
//       )}
//     </div>
//   );
// };

// export default AddressesPage;


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
    state: initialAddress?.state || "",
    country: initialAddress?.country || "",
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
            { id: "name", label: "Full Name", placeholder: "e.g., Chetan Doniwal" },
            { id: "phone", label: "Phone Number", placeholder: "+91 9876543210" },
            { id: "address", label: "Street Address", placeholder: "e.g., 123, Green Park Road" },
            { id: "city", label: "City", placeholder: "e.g., Indore" },
            { id: "state", label: "State", placeholder: "e.g., Madhya Pradesh" },
            { id: "country", label: "Country", placeholder: "e.g., India" },
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
                  <SmallLoadingSpinner  />
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
  if (confirm("Are you sure you want to delete this address?")) {
    try {
      setDeletingId(id);
      await deleteAddress(id);
      toast.success("Address deleted successfully!");
      await fetchAddresses();
    } catch (err: any) {
      console.error("Failed to delete address", err);
      toast.error(err.response?.data?.error || "Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  }
};

  const Header = () => (
    <header className="sticky top-0 bg-white flex justify-between items-center px-3 sm:px-6 py-3 shadow-sm z-20 border-b border-gray-200">
      <button
         onClick={() => router.back()}
        aria-label="Go back"
        className="text-gray-700 hover:text-sky-600 transition-colors p-2 hover:bg-sky-50 rounded-full"
      >
        <ArrowLeft size={22} />
      </button>
      <h2 className="font-bold text-lg sm:text-xl text-gray-800 flex-1 text-center">
        Addresses
      </h2>
     
    </header>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="px-3 sm:px-6 py-2">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-4 sm:mb-6 border-b pb-3">
            <h1 className="text-base sm:text-lg font-semibold text-gray-800">
              Your Saved Addresses
            </h1>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center bg-sky-600 text-white py-1.5 px-3 sm:py-2 sm:px-4 rounded-full text-sm font-medium hover:bg-sky-700 transition-colors"
            >
              <Plus size={16} className="mr-1" /> Add
            </button>
          </div>

          {/* Loading */}
          {loading ? (
            <p className="text-center text-gray-500 py-8 flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={18} /> Loading addresses...
            </p>
          ) : addresses.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
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
                        onClick={() => handleDelete(address.id)}
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
                    <MapPin className="text-sky-600 mr-2 mt-1" size={18} />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        {address.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-700 mt-1">
                        {address.address}, {address.city}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-700">
                        {address.state}, {address.country} - {address.zipCode}
                      </p>
                      <p className="text-xs sm:text-sm text-sky-700 font-medium mt-2">
                        {address.phone}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 border-dashed border-2 border-gray-300 rounded-lg">
              <MapPin className="mx-auto mb-3 text-gray-400" size={28} />
              <p className="font-medium text-sm">No saved addresses yet</p>
              <p className="text-xs mt-1">
                Tap “Add” to save your first address.
              </p>
            </div>
          )}
        </div>
      </div>

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
