"use client";

import React, { useState } from "react";
import Link from "next/link";

const ShineUppage = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation example
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Send data to backend or API here
    console.log("Form Submitted:", formData);

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });

    alert("Account created successfully!");
  };

  return (
    <>
      <div className="h-20 flex flex-col justify-center items-center bg-orange-600 relative"></div>
      {/* SVG Wave */}
      <div className="w-full">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-40"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,
            82.39-16.72,168.19-17.73,250.45-.39C823.78,31,
            906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,
            214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,
            56.44Z"
            className="fill-orange-600"
          />
        </svg>
      </div>

      <h1 className="text-4xl text-black font-bold">Shin Up</h1>
      <div className="border-b-2 border-amber-600 w-24 "></div>

      <form
        onSubmit={handleSubmit}
        className="w-screen max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6 mx-auto mt-6"
      >
        <div className="relative">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border-b-2 border-gray-300 focus:border-orange-500 outline-none py-2 placeholder-gray-400 transition"
            required
          />
        </div>

        <div className="relative">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border-b-2 border-gray-300 focus:border-orange-500 outline-none py-2 placeholder-gray-400 transition"
            required
          />
        </div>

        <div className="relative">
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border-b-2 border-gray-300 focus:border-orange-500 outline-none py-2 placeholder-gray-400 transition"
            required
          />
        </div>

        <div className="relative">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border-b-2 border-gray-300 focus:border-orange-500 outline-none py-2 placeholder-gray-400 transition"
            required
          />
        </div>

        <div className="relative">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border-b-2 border-gray-300 focus:border-orange-500 outline-none py-2 placeholder-gray-400 transition"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 rounded-full shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all"
        >
          Create Account
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link
              href="/ShineIn"
              className="text-orange-600 font-semibold hover:text-orange-700 transition-colors"
            >
              Login here
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};

export default ShineUppage;
