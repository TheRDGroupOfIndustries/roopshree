"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
    <div className="-translate-y-72 absolute">
      {/* SVG Wave */}
      <div className="relative w-screen h-[70vh]  ">

      <Image
        src="/Vector 2.svg"
        alt="wave"
        fill
        className="object-cover absolute h-full w-full"
        
        />
        </div>

      <h1 className="text-4xl text-black font-bold  pl-[5vw]">Sign Up</h1>
      <div className="border-b-2 border-[#F49F00] w-24 ml-[5vw]"></div>




      <form
        onSubmit={handleSubmit}
        className="w-screen max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6 mx-auto mt-6"
      >
        <div className="relative">
          <label htmlFor="Email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border-b-2 border-gray-300 focus:border-[#F49F00] outline-none py-2 placeholder-gray-400 transition"
            required
          />
        </div>

        <div className="relative">
          <label htmlFor="Phone">Phone No</label>
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border-b-2 border-gray-300 focus:border-[#F49F00] outline-none py-2 placeholder-gray-400 transition"
            required
          />
        </div>

        <div className="relative">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border-b-2 border-gray-300 focus:border-[#F49F00] outline-none py-2 placeholder-gray-400 transition"
            required
          />
        </div>

        <div className="relative">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border-b-2 border-gray-300 focus:border-[#F49F00] outline-none py-2 placeholder-gray-400 transition"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#F49F00] text-white font-bold py-3 rounded-full shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all"
        >
          Create Account
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              href="/ShineIn"
              className="text-orange-600 font-semibold hover:border-[#F49F00] transition-colors"
            >
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ShineUppage;
