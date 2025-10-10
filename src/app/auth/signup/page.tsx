// "use client";

// import React, { useState, ChangeEvent, FormEvent } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { Eye, EyeOff, Mail, Phone,User } from "lucide-react";

// // Define types for form data
// interface FormData {
//   name: string;
//   email: string;
//   phone: string;
//   password: string;
//   confirmPassword: string;
//   otp: string;
// }

// const SignUpPage: React.FC = () => {
//    const [formData, setFormData] = useState<FormData>({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//     otp: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Handle input changes
//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Send OTP
//   const handleSendOTP = async () => {
//     if (!formData.confirmPassword|| !formData.password|| !formData.email|| !formData.name ) {
//       alert("Please fill your details");
//       return;
//     }

//     setLoading(true);
//     setTimeout(() => {
//       setOtpSent(true);
//       setLoading(false);
//       alert("OTP sent to your email!");
//     }, 1500);
//   };

//   // Verify OTP
//   const handleVerify = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!formData.otp) {
//       alert("Please enter OTP!");
//       return;
//     }
//     alert("Email verified successfully! 🎉");
//   };

//   return (
//     <div className="-translate-y-72 absolute">
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

//       <h1 className="text-4xl text-black font-bold pl-[5vw]">Sign Up</h1>
//       <div className="border-b-2 border-[#F49F00] w-24 ml-[5vw]"></div>

//        <form
//         onSubmit={otpSent ? handleVerify : (e) => e.preventDefault()}
//         className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl space-y-6 transition-all duration-300"
//       >
//         {!otpSent && (
//           <>
//             {/* Name */}
//             <div className="relative">
//               <label className="block text-gray-700 font-semibold mb-2">
//                 Full Name
//               </label>
//               <div className="flex items-center border-2 border-gray-300 rounded-lg px-3 py-2 focus-within:border-[#F49F00] transition">
//                 <User className="text-gray-500 w-5 h-5 mr-2" />
//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="John Doe"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   className="w-full outline-none placeholder-gray-400 bg-transparent"
//                 />
//               </div>
//             </div>

//             {/* Email */}
//             <div className="relative">
//               <label className="block text-gray-700 font-semibold mb-2">
//                 Email
//               </label>
//               <div className="flex items-center border-2 border-gray-300 rounded-lg px-3 py-2 focus-within:border-[#F49F00] transition">
//                 <Mail className="text-gray-500 w-5 h-5 mr-2" />
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="demo@gmail.com"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   className="w-full outline-none placeholder-gray-400 bg-transparent"
//                 />
//               </div>
//             </div>

//             {/* Phone */}
//             <div className="relative">
//               <label className="block text-gray-700 font-semibold mb-2">
//                 Phone Number
//               </label>
//               <div className="flex items-center border-2 border-gray-300 rounded-lg px-3 py-2 focus-within:border-[#F49F00] transition">
//                 <Phone className="text-gray-500 w-5 h-5 mr-2" />
//                 <input
//                   type="tel"
//                   name="phone"
//                   placeholder="+91 98765-43210"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   required
//                   className="w-full outline-none placeholder-gray-400 bg-transparent"
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div className="relative">
//               <label className="block text-gray-700 font-semibold mb-2">
//                 Password
//               </label>
//               <div className="flex items-center border-2 border-gray-300 rounded-lg px-3 py-2 focus-within:border-[#F49F00] transition">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   placeholder="Create password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   className="w-full outline-none placeholder-gray-400 bg-transparent"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="text-gray-500 ml-2 hover:text-gray-700"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Confirm Password */}
//             <div className="relative">
//               <label className="block text-gray-700 font-semibold mb-2">
//                 Confirm Password
//               </label>
//               <div className="flex items-center border-2 border-gray-300 rounded-lg px-3 py-2 focus-within:border-[#F49F00] transition">
//                 <input
//                   type={showConfirm ? "text" : "password"}
//                   name="confirmPassword"
//                   placeholder="Confirm password"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   required
//                   className="w-full outline-none placeholder-gray-400 bg-transparent"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirm(!showConfirm)}
//                   className="text-gray-500 ml-2 hover:text-gray-700"
//                 >
//                   {showConfirm ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Send OTP */}
//             <button
//               type="button"
//               onClick={handleSendOTP}
//               disabled={loading}
//               className="w-full bg-[#F49F00] text-white font-bold py-3 rounded-full shadow-lg hover:bg-[#e59000] hover:scale-[1.02] transition-all disabled:opacity-60"
//             >
//               {loading ? "Sending OTP..." : "Send OTP"}
//             </button>
//           </>
//         )}

//         {/* OTP Verification Screen */}
//         {otpSent && (
//           <div className="space-y-6 animate-fadeIn">
//             <label className="block text-gray-700 font-semibold mb-2 text-center text-lg">
//               Enter the 6-digit OTP sent to your email
//             </label>
//             <div className="flex justify-center gap-2">
//               {[0, 1, 2, 3, 4, 5].map((index) => (
//                 <input
//                   key={index}
//                   type="text"
//                   maxLength={1}
//                   value={formData.otp[index] || ""}
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     if (!/^\d*$/.test(value)) return;
//                     const newOtp = formData.otp.split("");
//                     newOtp[index] = value;
//                     setFormData((prev) => ({
//                       ...prev,
//                       otp: newOtp.join(""),
//                     }));
//                     if (value && index < 5) {
//                       const nextInput =
//                         e.target.nextElementSibling as HTMLInputElement;
//                       nextInput?.focus();
//                     }
//                   }}
//                   onKeyDown={(e) => {
//                     if (
//                       e.key === "Backspace" &&
//                       !formData.otp[index] &&
//                       index > 0
//                     ) {
//                       const prevInput =
//                         e.currentTarget.previousElementSibling as HTMLInputElement;
//                       prevInput?.focus();
//                     }
//                   }}
//                   className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#F49F00] focus:outline-none transition bg-white"
//                   required
//                 />
//               ))}
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-[#F49F00] text-white font-bold py-3 rounded-full shadow-lg hover:bg-[#e59000] hover:scale-[1.02] transition-all"
//             >
//               Verify Email
//             </button>
//           </div>
//         )}

//         {/* Login link */}
//         {!otpSent && (
//           <div className="text-center mt-4">
//             <p className="text-gray-600 text-sm">
//               Already have an account?{" "}
//               <Link
//                 href="/auth/signin"
//                 className="text-[#F49F00] font-semibold hover:underline"
//               >
//                 Login here
//               </Link>
//             </p>
//           </div>
//         )}
//       </form>

//     </div>
//   );
// };

// export default SignUpPage;
"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Phone, User } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [serverOtp, setServerOtp] = useState("");

  const sendOtp = async () => {
    try {
      const res = await fetch("/api/auth/send-otp", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }) 
      });
      const data = await res.json();
      setServerOtp(data.otp);
      setOtpSent(true);
      alert("✅ OTP sent to your email!");
    } catch (error) {
      alert("❌ Failed to send OTP. Please try again.");
    }
  };

  const verifyOtp = () => {
    if (formData.otp === serverOtp) {
      alert("✅ OTP Verified Successfully!");
      // Proceed with signup here
      return true;
    } else {
      alert("❌ Invalid OTP. Try again!");
      return false;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!otpSent) {
      const phoneDigitsOnly = formData.phone.replace(/\D/g, "");
      if (phoneDigitsOnly.length !== 10) {
        alert("Phone Number must be 10 digits long!");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      // Send OTP
      await sendOtp();
      return;
    }

    // Verify OTP
    if (formData.otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP!");
      return;
    }

    if (!verifyOtp()) {
      return;
    }

    // Proceed to signup
    setLoading(true);
    try {
      // Replace with your actual signup logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Signup successful!");
      // router.push("/auth/signin");
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="-translate-y-72 absolute">
      <div className="relative w-screen h-[70vh]">
        <Image
          src="/Vector 2.svg"
          alt="wave"
          fill
          className="object-cover absolute h-full w-full"
          priority
        />
      </div>

      <h1 className="text-4xl text-black font-bold pl-[5vw]">Sign Up</h1>
      <div className="border-b-2 border-[#F49F00] w-24 ml-[5vw]"></div>

      <form onSubmit={handleSubmit} 
            className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl space-y-6 transition-all duration-300">
        {!otpSent ? (
          <>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Full Name
              </label>
              <div className="flex items-center border-2 border-gray-300 rounded-lg px-3 py-2 focus-within:border-[#F49F00]">
                <User className="text-gray-500 w-5 h-5 mr-2" />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full outline-none bg-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <div className="flex items-center border-2 border-gray-300 rounded-lg px-3 py-2 focus-within:border-[#F49F00]">
                <Mail className="text-gray-500 w-5 h-5 mr-2" />
                <input
                  type="email"
                  name="email"
                  placeholder="demo@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full outline-none bg-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Phone
              </label>
              <div className="flex items-center border-2 border-gray-300 rounded-lg px-3 py-2 focus-within:border-[#F49F00]">
                <Phone className="text-gray-500 w-5 h-5 mr-2" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765-43210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full outline-none bg-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Password
              </label>
              <div className="flex items-center border-2 border-gray-300 rounded-lg px-3 py-2 focus-within:border-[#F49F00]">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 ml-2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Confirm Password
              </label>
              <div className="flex items-center border-2 border-gray-300 rounded-lg px-3 py-2 focus-within:border-[#F49F00]">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-gray-500 ml-2"
                >
                  {showConfirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F49F00] text-white font-bold py-3 rounded-full shadow-lg hover:bg-[#e59000] transition-all disabled:opacity-60"
            >
              {loading ? "Processing..." : "Send OTP"}
            </button>
          </>
        ) : (
          <div className="animate-fadeIn space-y-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Enter 6-digit OTP
            </h2>
            <p className="text-gray-500 text-sm">
              We've sent a verification code to your email.
            </p>

            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={formData.otp[index] || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!/^\d*$/.test(value)) return;
                    const newOtp = formData.otp.split("");
                    newOtp[index] = value;
                    setFormData((prev) => ({
                      ...prev,
                      otp: newOtp.join(""),
                    }));
                    if (value && index < 5) {
                      const nextInput =
                        e.target.nextElementSibling as HTMLInputElement;
                      nextInput?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Backspace" &&
                      !formData.otp[index] &&
                      index > 0
                    ) {
                      const prevInput =
                        e.currentTarget
                          .previousElementSibling as HTMLInputElement;
                      prevInput?.focus();
                    }
                  }}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#F49F00] focus:outline-none transition bg-white"
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-[#F49F00] text-white font-bold py-3 rounded-full shadow-lg hover:bg-[#e59000] hover:scale-[1.02] transition-all"
            >
              Verify Email
            </button>
          </div>
        )}
        <div className="text-center mt-4">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-[#F49F00] font-semibold hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;