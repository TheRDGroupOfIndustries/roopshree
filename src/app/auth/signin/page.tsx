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

import React, { useState, ChangeEvent, FormEvent, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, X } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const SignInPage: React.FC = () => {
  const { login, user } = useAuth();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
  const otpRefs = useRef<HTMLInputElement[]>([]);
  const [newPassword, setNewPassword] = useState("");

  // 🔹 Input Handlers
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 OTP Input Change
  const handleOtpChange = (index: number, value: string) => {
    if (/[^0-9]/.test(value)) return; // only numbers
    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);

    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  // 🔹 Send OTP
  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!loginData.email) return toast.error("Enter your email first");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginData.email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");

      toast.success(data.success || "OTP sent to your email!");
      setStep("otp");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Verify OTP
  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    const otp = otpValues.join("");

    if (otp.length !== 6) return toast.error("Enter 6-digit OTP");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginData.email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid OTP");

      toast.success("OTP verified!");
      setStep("reset");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Reset Password
  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPassword) return toast.error("Please enter your new password");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/update-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginData.email, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");

      toast.success("Password reset successfully!");
      setStep("signin"); // Go back to sign-in step
      setNewPassword("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Normal Login
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginData.email, loginData.password);
      toast.success("Logged in successfully!");
      router.push(user?.role === "ADMIN" ? "/manage" : "/home");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white text-black px-6 py-10 relative">
      {/* Background Image */}
      {/* <div className="w-screen absolute top-0 left-0 h-[400px]">
        <Image
          src="/Vector 2.svg"
          alt="wave"
          fill
          className="object-cover object-bottom"
          priority
        />
      </div> */}

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Sign In</h1>
        <div className="border-b-4 border-[#F49F00] w-20 mx-auto mt-2"></div>
      </div>
      <div className="p-4 w-full flex justify-center items-center">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white backdrop-blur-md border border-gray-100 p-8 rounded-2xl shadow-xl space-y-6 transition-all duration-300"
        >
          {/* Email */}
          <div className="relative">
            <label className="block font-semibold mb-1">Email</label>
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
            <label className="block font-semibold mb-1">Password</label>
            <div className="flex items-center border-b-2 border-gray-300 focus-within:border-[#F49F00] transition">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={loginData.password}
                onChange={handleChange}
                className="w-full py-2 outline-none placeholder-gray-400"
                required
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

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => setForgotOpen(true)}
              className="text-sm text-[#F49F00] font-medium hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F49F00] text-white font-bold py-3 rounded-full shadow-lg hover:bg-[#e59400] transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-sm">
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

      {/* 🔒 Forgot Password Modal */}
      {forgotOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-xl relative">
            <button
              onClick={() => setForgotOpen(false)}
              className="absolute right-4 top-4 text-gray-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-center">
              Forgot Password
            </h2>

            {/* Step 1: Email */}
            {step === "email" && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <label className="block font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="demo@gmail.com"
                  value={loginData.email}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#F49F00] outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#F49F00] text-white font-bold py-3 rounded-full shadow-lg hover:bg-[#e59000] transition-all disabled:opacity-60"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            )}

            {/* Step 2: OTP */}
            {step === "otp" && (
              <form
                onSubmit={handleVerifyOtp}
                className="space-y-4 text-center"
              >
                <h2 className="text-lg font-semibold text-gray-700">
                  Enter 6-digit OTP
                </h2>
                <div className="flex justify-center gap-2">
                  {otpValues.map((value, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el!)}
                      type="text"
                      maxLength={1}
                      value={value}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      className="w-10 h-12 text-center border rounded-md text-lg font-semibold focus:ring-2 focus:ring-[#F49F00] outline-none"
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 w-full bg-[#F49F00] text-white font-bold py-3 rounded-full shadow-lg hover:bg-[#e59000] transition-all"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>
            )}

            {/* Step 3: Reset Password */}
            {step === "reset" && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <label className="block font-semibold mb-2">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#F49F00]"
                />
                <button
                  type="submit"
                  className="w-full bg-[#F49F00] text-white py-2 rounded-lg hover:bg-[#e59400] transition"
                >
                  Set New Password
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInPage;
