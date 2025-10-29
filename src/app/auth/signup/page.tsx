"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Phone, User } from "lucide-react";
import { registerUser, sendOtpEmail, verifyOtpCode } from "@/services/authService";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  email: string;
  // phone: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    // phone: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();

  // const sendOtp = async () => {

  //   // console.log("send data: ",formData);
  //   if (!formData.email) {
  //   toast.error("Please enter your email first!");
  //   return;
  // }

  //   try {
  //     setLoading(true);
  //     const res = await sendOtpEmail(formData?.email);
  //     console.log("sendOtp:", res);
  //      if (res.error) {
  //     toast.error(res.error);
  //     return;
  //   }
  //     setOtpSent(true);
  //     toast.success("OTP sent to your email!");
  //   } catch (error: any) {
  //      console.error("Send OTP failed:", error);
  //     toast.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const sendOtp = async () => {
  if (!formData.email) {
    toast.error("Please enter your email!");
    return;
  }

  try {
    setLoading(true);

    const res = await sendOtpEmail(formData.email);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    setOtpSent(true);
    toast.success("OTP sent to your email!");
  } catch (error: any) {
    console.error("Send OTP failed:", error);
    const message =
      typeof error === "string"
        ? error
        : error?.error || "Failed to send OTP. Please try again.";
    toast.error(message);
  } finally {
    setLoading(false);
  }
};

  const verifyOtp = async () => {
    try {
      setLoading(true);
      const res = await verifyOtpCode(formData.email, formData.otp);
      toast.success(res.success || "OTP Verified Successfully!");

      // Register user after OTP verification
      await registerUser(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );

      toast.success("Signup successful!");
      router.push("/auth/signin");
    } catch (error: any) {
      console.error("OTP verification or signup failed:", error);
      toast.error(error.error || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

     if (formData.email === formData.password) {
    toast.error("Email and password cannot be the same!");
    return;
  }

    if (!otpSent) {
      // const phoneDigitsOnly = formData.phone.replace(/\D/g, "");
      // if (phoneDigitsOnly.length !== 10) {
      //   toast.error("Phone Number must be 10 digits long!");
      //   return;
      // }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }

      await sendOtp();
      return;
    }

    // Verify OTP
    if (formData.otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP!");
      return;
    }

    await verifyOtp();

    // setLoading(true);
    // try {
    //   setLoading(true);
    //   await registerUser(
    //     formData.name,
    //     formData.email,
    //     formData.password,
    //     formData.confirmPassword
    //   );
    //   toast.success("Signup successful!");
    //   router.push("/auth/signin");
    // } catch (error: any) {
    //   console.error("Signup failed:", error);
    //   toast.error(error.response?.data?.message || "Signup failed");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
<div className="min-h-screen flex flex-col justify-center items-center bg-white text-black px-6 py-10 relative">
  {/* Heading */}
  <div className="text-center mb-8">
    <h1 className="text-4xl font-bold text-gray-900">Sign Up</h1>
    <div className="border-b-4 border-[#F49F00] w-20 mx-auto mt-2"></div>
  </div>

  {/* Form */}
  <form
    onSubmit={handleSubmit}
    className="w-full max-w-md bg-white backdrop-blur-md border border-gray-100 p-8 rounded-2xl shadow-xl space-y-6 transition-all duration-300"
  >
    {!otpSent ? (
      <>
        {/* Full Name */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            Full Name
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-[#F49F00]">
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

        {/* Email */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Email</label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-[#F49F00]">
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

        {/* Password */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            Password
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-[#F49F00]">
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

        {/* Confirm Password */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            Confirm Password
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-[#F49F00]">
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

        {/* Send OTP Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#F49F00] text-white font-bold py-3 rounded-full shadow-lg hover:bg-[#e59000] active:scale-95 transition-all disabled:opacity-60"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </>
    ) : (
      /* OTP Screen */
      <div className="animate-fadeIn space-y-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800">Enter 6-digit OTP</h2>
        <p className="text-gray-500 text-sm">
          We’ve sent a verification code to your email.
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-3">
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
                  const nextInput = e.target.nextElementSibling as HTMLInputElement;
                  nextInput?.focus();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
                  const prevInput = e.currentTarget.previousElementSibling as HTMLInputElement;
                  prevInput?.focus();
                }
              }}
              className="w-12 h-12 text-center text-xl font-semibold text-gray-800 border border-gray-300 rounded-lg focus:border-[#F49F00] focus:outline-none transition"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#F49F00] text-white font-bold py-3 rounded-full shadow-lg hover:bg-[#e59000] active:scale-95 transition-all"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </div>
    )}

    {/* Footer */}
    <div className="text-center pt-4">
      <p className="text-gray-600 text-sm">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-[#F49F00] font-semibold hover:underline">
          Login here
        </Link>
      </p>
    </div>
  </form>
</div>

  );
};

export default SignUpPage;
