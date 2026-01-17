"use client";

import React, { useState, ChangeEvent, FormEvent, useRef } from "react";
import { Mail, Lock, Eye, EyeOff, X } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

const fadeScale = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const SignInPage: React.FC = () => {
  const { login } = useAuth();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
  const otpRefs = useRef<HTMLInputElement[]>([]);
  const [newPassword, setNewPassword] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOtpChange = (index: number, value: string) => {
    if (/[^0-9]/.test(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedInUser = await login(loginData.email, loginData.password);
      toast.success("Logged in successfully!");
      router.push(loggedInUser?.role === "ADMIN" ? "/manage" : "/home");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.message ||
          "Login failed!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF4E6] px-4 pt-12">

      {/* LOGO + HEADING */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeScale}
        className="flex flex-col items-center mb-8 relative"
      >
        <div className="absolute -top-4 w-36 h-36 rounded-full bg-yellow-200/30 blur-3xl z-0" />

        {/* LOGO IMAGE */}
        <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl shadow-[0_0_20px_rgba(249,115,22,0.4)] flex items-center justify-center hover:scale-105 transition-transform mb-4">
          <Image
            src="/images/logo.jpeg"
            alt="Roop Shree Logo"
            width={48}
            height={48}
            priority
            className="object-contain rounded-xl drop-shadow-[0_0_8px_rgba(255,255,255,0.45)]"
          />
        </div>

        <h2 className="relative z-10 text-2xl font-bold text-gray-800">
          Welcome Back
        </h2>
        <p className="relative z-10 text-xs text-gray-500 mt-1 text-center">
          Sign in to continue your journey
        </p>
        <div className="relative z-10 w-20 h-1 mt-3 rounded-full bg-gradient-to-r from-orange-400 to-orange-600" />
      </motion.div>

      {/* SIGN IN CARD */}
      <div className="w-full max-w-[380px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-8">
        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-200/80 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={loginData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-200/80 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-lg text-white font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 transition hover:opacity-95 disabled:opacity-70"
          >
            {loading ? "Signing In..." : "Sign In →"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-orange-500 font-medium hover:underline"
          >
            Create one now
          </Link>
        </p>
      </div>

      <div className="h-12" />
    </div>
  );
};

export default SignInPage;
