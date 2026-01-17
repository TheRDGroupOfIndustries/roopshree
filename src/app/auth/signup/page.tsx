"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEyeSlash,
  FaEye,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  registerUser,
  sendOtpEmail,
  verifyOtpCode,
} from "@/services/authService";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

export default function CreateAccountPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sendOtp = async () => {
    if (!formData.email) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);
      const res = await sendOtpEmail(formData.email);

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      setOtpSent(true);
      toast.success("OTP sent to your email");
    } catch (err: any) {
      toast.error(err?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpAndRegister = async () => {
    if (formData.otp.length !== 6) {
      toast.error("Enter valid 6 digit OTP");
      return;
    }

    try {
      setLoading(true);

      await verifyOtpCode(formData.email, formData.otp);

      await registerUser(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );

      toast.success("Account created successfully");
      router.push("/auth/signin");
    } catch (err: any) {
      toast.error(err?.error || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!otpSent) {
      await sendOtp();
    } else {
      await verifyOtpAndRegister();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fff3e3] via-[#fff8ef] to-[#fffdf9] px-4">

      {/* LOGO */}
      <div className="mb-6 mt-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.35)] hover:scale-105 transition-transform">
          <Image
            src="/images/logo.jpeg"
            alt="Roop Shree Logo"
            width={48}
            height={48}
            priority
            className="object-contain rounded-xl drop-shadow-[0_0_8px_rgba(255,255,255,0.45)]"
          />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-semibold text-gray-800">
        Create Account
      </h1>
      <p className="text-sm text-gray-500 mt-1">
        Join us and start your journey today
      </p>

      <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mt-3 mb-6" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="text-xs text-gray-900">Full Name</label>
            <div className="relative mt-1">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-100 focus:bg-white transition text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs text-gray-900">Email Address</label>
            <div className="relative mt-1">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-100 focus:bg-white transition text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-gray-900">Password</label>
            <div className="relative mt-1">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-slate-100 focus:bg-white transition text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-xs text-gray-900">Confirm Password</label>
            <div className="relative mt-1">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-slate-100 focus:bg-white transition text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
              >
                {showConfirm ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          {/* OTP */}
          {otpSent && (
            <div>
              <label className="text-xs text-gray-900">OTP</label>
              <input
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter 6 digit OTP"
                className="w-full py-2.5 px-4 rounded-lg bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold shadow-md hover:opacity-90 transition"
          >
            {loading
              ? "Please wait..."
              : otpSent
              ? "Verify OTP & Signup"
              : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-5">
          Already have an account?{" "}
          <span
            className="text-orange-500 font-medium cursor-pointer"
            onClick={() => router.push("/auth/signin")}
          >
            Sign in here
          </span>
        </p>
      </motion.div>

      <div className="h-12" />
    </div>
  );
}
