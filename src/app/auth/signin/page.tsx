// "use client";

// import React, { useState, ChangeEvent, FormEvent } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { Eye, EyeOff } from "lucide-react"; // ✅ added missing imports

// const SignInPage: React.FC = () => {
//   const [showPassword, setShowPassword] = useState<boolean>(false);

//   // State for login form
//   const [loginData, setLoginData] = useState({
//     email: "",
//     password: "",
//   });

//   // Handle input change
//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setLoginData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle form submit
//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     console.log("Login Data:", loginData);
//     alert(`Logged in with email: ${loginData.email}`);

//     // Reset form (optional)
//     setLoginData({ email: "", password: "" });
//   };

//   return (
//     <div className="-translate-y-40 absolute">
//       {/* SVG Wave */}
//       <div className="relative w-screen h-[70vh]">
//         <Image
//           src="/Vector 2.svg"
//           alt="wave"
//           fill
//           className="object-cover absolute h-full w-full"
//           priority
//         />
//       </div>

//       <h1 className="text-4xl text-black font-bold pl-[5vw]">Sign In</h1>
//       <div className="border-b-2 border-[#F49F00] w-24 ml-[5vw]"></div>

//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6 mx-auto mt-8"
//       >
//         {/* Email */}
//         <div className="relative">
//           <label
//             htmlFor="email"
//             className="block text-gray-700 font-semibold mb-1"
//           >
//             Email
//           </label>
//           <input
//             type="email"
//             name="email"
//             placeholder="Email Address"
//             value={loginData.email}
//             onChange={handleChange}
//             className="w-full border-b-2 border-gray-300 focus:border-[#F49F00] outline-none py-2 placeholder-gray-400 transition"
//             required
//           />
//         </div>

//         {/* Password */}
//         <div className="relative">
//           <label className="block text-gray-700 font-semibold mb-1">Password</label>
//           <div className="flex items-center border-b-2 border-gray-300 focus-within:border-[#F49F00] transition">
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               placeholder="Enter password"
//               value={loginData.password}
//               onChange={handleChange}
//               className="w-full py-2 outline-none placeholder-gray-400"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="text-gray-600 ml-2"
//             >
//               {showPassword ? <EyeOff /> : <Eye />}
//             </button>
//           </div>
//         </div>

//         {/* Remember Me / Forgot Password */}
//         <div className="flex items-center justify-between mt-2">
//           <label className="flex items-center gap-2 text-gray-700">
//             <input type="checkbox" className="w-4 h-4 accent-[#F49F00]" />
//             Remember me
//           </label>
//           <Link
//             href="/ForgotPassword"
//             className="text-[#F49F00] font-semibold hover:underline text-sm"
//           >
//             Forgot password?
//           </Link>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="w-full bg-[#F49F00] text-white font-bold py-3 rounded-full shadow-lg hover:bg-[#e59400] transition-all duration-300"
//         >
//           Login
//         </button>

//         {/* Signup Link */}
//         <div className="mt-6 text-center">
//           <p className="text-gray-600 text-sm">
//             Don&apos;t have an account?{" "}
//             <Link
//               href="/auth/signup"
//               className="text-[#F49F00] font-semibold hover:underline transition-colors"
//             >
//               Sign up here
//             </Link>
//           </p>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SignInPage;

"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
const SignInPage: React.FC = () => {
  const { login,user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     await login(loginData.email, loginData.password);
  //     toast.success("Logged in successfully!");
  //     console.log("user: ",user);
      
  //       if (user?.role === "admin") {
  //     router.push("/manage");
  //   } else {
  //     router.push("/home");
  //   }

  //   } catch (error: any) {
  //     console.error("Login failed:", error);
  //     toast.error(error.response?.data?.error || "Login failed. Try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  try {
    const loggedInUser = await login(loginData.email, loginData.password); // 🔹 use returned user
    toast.success("Logged in successfully!");

    if (loggedInUser.role === "ADMIN") {
      router.push("/manage");
    } else {
      router.push("/home");
    }
  } catch (error: any) {
    console.error("Login failed:", error);
    toast.error(error.response?.data?.error || "Login failed. Try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="-translate-y-40 absolute">
      {/* Background */}
      <div className="relative w-screen h-[70vh]">
        <Image
          src="/Vector 2.svg"
          alt="wave"
          fill
          className="object-cover absolute h-full w-full"
          priority
        />
      </div>

      <h1 className="text-4xl text-black font-bold pl-[5vw]">Sign In</h1>
      <div className="border-b-2 border-[#F49F00] w-24 ml-[5vw]"></div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6 mx-auto mt-8"
      >
        {/* Email */}
        <div className="relative">
          <label
            htmlFor="email"
            className="block text-gray-700 font-semibold mb-1"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={loginData.email}
            onChange={handleChange}
            className="w-full border-b-2 border-gray-300 focus:border-[#F49F00] outline-none py-2 placeholder-gray-400 transition"
            required
          />
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block text-gray-700 font-semibold mb-1">
            Password
          </label>
          <div className="flex items-center border-b-2 border-gray-300 focus-within:border-[#F49F00] transition">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={loginData.password}
              onChange={handleChange}
              className="w-full py-2 outline-none placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-600 ml-2"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#F49F00] text-white font-bold py-3 rounded-full shadow-lg hover:bg-[#e59400] transition-all duration-300 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Signup Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-[#F49F00] font-semibold hover:underline"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignInPage;
