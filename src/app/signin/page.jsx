"use client";
import React, { useState } from "react";
import Link from "next/link";
 import Image from "next/image";
const Login = () => {
  // State for login form
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Here you can add API call to verify login
    console.log("Login Data:", loginData);

    // Simple alert for demonstration
    alert(`Logged in with email: ${loginData.email}`);

    // Reset form (optional)
    setLoginData({ email: "", password: "" });
  };

  return (
    <>
      <Image
            src="/Vector 2.svg"
            alt="wave"
            width={200}
            height={300}
            className="  object-cover relative w-full"
            priority
          />

       <h1 className="text-4xl text-black font-bold pt-[75vh] pl-[5vw]">Sign In</h1>
      <div className="border-b-2 border-[#F49F00] w-24 ml-[5vw]"></div>

     <form
  onSubmit={handleSubmit}
  className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6 mx-auto mt-8"
>
  {/* Email */}
  <div className="relative">
    <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">
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
    <label htmlFor="password" className="block text-gray-700 font-semibold mb-1">
      Password
    </label>
    <input
      type="password"
      name="password"
      placeholder="Password"
      value={loginData.password}
      onChange={handleChange}
      className="w-full border-b-2 border-gray-300 focus:border-[#F49F00] outline-none py-2 placeholder-gray-400 transition"
      required
    />
  </div>

  {/* Remember Me / Forgot Password */}
  <div className="flex items-center justify-between mt-2">
    <label className="flex items-center gap-2 text-gray-700">
      <input
        type="checkbox"
        className="w-4 h-4 accent-[#F49F00]"
      />
      Remember me
    </label>
    <Link href="/ForgotPassword" className="text-[#F49F00] font-semibold hover:underline text-sm">
      Forgot password?
    </Link>
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    className="w-full bg-[#F49F00] text-white font-bold py-3 rounded-full shadow-lg hover:bg-[#e59400] transition-all duration-300"
  >
    Login
  </button>

  {/* Signup Link */}
  <div className="mt-6 text-center">
    <p className="text-gray-600 text-sm">
      Don't have an account?{' '}
      <Link
        href="/signup"
        className="text-[#F49F00] font-semibold hover:underline transition-colors"
      >
        Sign up here
      </Link>
    </p>
  </div>
</form>

    </>
  );
};

export default Login;
