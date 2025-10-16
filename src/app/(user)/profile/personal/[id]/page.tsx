// "use client";

// import React,{useState, ChangeEvent} from "react";
// import { User, Camera,  ArrowLeft, ShoppingCart } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";

// const PersonalInfoPage: React.FC = () => {
//   const [profileImage, setProfileImage] = useState<string | null>(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     // phone: "",
//   });

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setProfileImage(imageUrl);
//     }
//   };

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log(formData);
//     alert("Profile Updated Successfully!");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
//        {/* Header */}
//       <header className="sticky top-0 bg-white flex justify-between items-center px-4 sm:px-6 py-4 shadow-md z-20 border-b border-gray-200">
//         <button
//           className="text-gray-700 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-full"
//           onClick={() => window.history.back()}
//         >
//           <ArrowLeft size={24} />
//         </button>
//         <h2 className="font-bold text-xl sm:text-2xl flex-1 text-center text-gray-800">
//           Profile
//         </h2>
//         <Link href="/my-cart">
//           <button className="relative text-gray-700 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-full transition-colors">
//             <ShoppingCart size={24} />
//             <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
//               2
//             </span>
//           </button>
//         </Link>
//       </header>
//       <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-6 md:p-8">
//         {/* Header */}
//         <div className="flex items-center gap-3 mb-6">
//           <div className="p-2 bg-gray-100 rounded-lg">
//             <User className="text-gray-600 w-6 h-6" />
//           </div>
//           <h1 className="text-xl font-semibold text-gray-800">
//             Personal Information
//           </h1>
//         </div>

//         {/* Profile Image */}
//         <div className="flex flex-col items-center mb-6">
//           <div className="relative w-28 h-28">
//             <Image
//                src={"https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?semt=ais_hybrid&amp;w=740&amp;q=80"}
//               fill
//               alt="Profile"
//               className="w-28 h-28 rounded-full object-cover border-4 border-gray-200"
//             >
//               </Image>
//             <label
//               htmlFor="upload"
//               className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full cursor-pointer hover:bg-gray-700"
//             >
//               <Camera className="w-4 h-4" />
//               <input
//                 type="file"
//                 id="upload"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//             </label>
//           </div>
//           <p className="text-sm text-gray-500 mt-2">Tap camera to change photo</p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-5 mb-12">
//           {/* Name */}
//           <div>
//             <label className="block text-gray-600 text-sm mb-1">Full Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Priya Sharma"
//               className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-gray-600 text-sm mb-1">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="priya.sharma@email.com"
//               className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
//             />
//           </div>

//           {/* Phone */}
//           {/* <div>
//             <label className="block text-gray-600 text-sm mb-1">Phone</label>
//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               placeholder="+91 9876543210"
//               className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
//             />
//           </div> */}

//           {/* Submit */}
//           <div className="pt-4">
//             <button
//               type="submit"
//               className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition-all"
//             >
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PersonalInfoPage;

"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { User, Camera, ArrowLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getUserById, updateUser } from "@/services/userService"; // 👈 Import your service
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthProvider";

const PersonalInfoPage: React.FC = () => {
  const { refreshUser } = useAuth();
  const [profileImage, setProfileImage] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>('');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;
  // ✅ Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getUserById(userId);
        if (res?.users) {
          setFormData({
            name: res.users.name || "",
            email: res.users.email || "",
            // phone: res.users.phone || "",
          });
          setPreviewUrl(res.users.profileImage || null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // Handle image selection and preview
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("file", file);
    if (file) {
      setProfileImage(file);
      const preview = URL.createObjectURL(file);
      console.log("preview", preview);
      setPreviewUrl(preview);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle profile update
  // Handle profile update and image upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let uploadedImageUrl = previewUrl;

    // If a new image is selected, upload it
    if (profileImage instanceof File) {
      const formDataForImage = new FormData();
      formDataForImage.append("files", profileImage);
      formDataForImage.append("type", "profile");

      try {
        const res = await fetch("/api/upload-images", {
          method: "POST",
          body: formDataForImage,
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.urls?.[0]) {
          uploadedImageUrl = data.urls[0];
        } else {
          throw new Error(data.error || "Image upload failed");
        }
      } catch (err) {
        toast.error("Image upload failed");
        setLoading(false);
        return;
      }
    }
    console.log("uploadedImageUrl", uploadedImageUrl);

    // Update user profile
    try {
      const updatedData = {
        name: formData.name,
        email: formData.email,
        profileImage: uploadedImageUrl,
      };
      await updateUser(userId, updatedData);
      toast.success("Profile Updated Successfully!");
      refreshUser();
    } catch (err) {
      toast.error("Failed to update profile. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  ">
      {/* Header */}
      <header className="sticky top-0   flex justify-between items-center px-4 sm:px-6 py-2 shadow-md z-20 border-b border-gray-200">
        <button
          className="  hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-full"
          onClick={() => router.back()}
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="font-bold text-xl sm:text-2xl flex-1 text-center  ">
          Profile
        </h2>
      </header>

      <div className="w-full max-w-lg  shadow-lg rounded-2xl p-6 8 mx-auto border ">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2   rounded-lg">
            <User className="  w-6 h-6" />
          </div>
          <h1 className="text-xl font-semibold  ">
            Personal Information
          </h1>
        </div>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-28 h-28">
            <Image
              src={previewUrl || "/images/dummy_profile.png"}
              fill
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-gray-200"
            />
            <label
              htmlFor="upload"
              className="absolute bottom-0 right-0  p-2 rounded-full cursor-pointer hover:bg-gray-700"
            >
              <Camera className="w-4 h-4" />
              <input
                type="file"
                id="upload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm   mt-2">
            Tap camera to change photo
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 mb-12">
          {/* Name */}
          <div>
            <label className="block   text-sm mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Priya Sharma"
              className="w-full border   rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block  text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="priya.sharma@email.com"
              className="w-full border   rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Phone */}
          {/* <div>
            <label className="block text-gray-600 text-sm mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div> */}

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg  transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfoPage;
