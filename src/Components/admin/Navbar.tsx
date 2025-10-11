"use client";

import React, { useEffect, useState } from "react";
import { Search, Bell, Store } from "lucide-react";
import Image from "next/image";
import { verifyJwt } from "@/lib/jwt";

interface UserData {
  userId: string;
  name: string;
  role: string;
  image?: string;
}

export default function Navbar() {
  const [userData, setUserData] = useState<UserData>({
    userId: "",
    name: "Guest",
    role: "User",
    image: "/default-avatar.png",
  });

  useEffect(() => {
    // Read token from cookie
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) return;

    // Decode JWT
    const decoded = verifyJwt(token);
    if (!decoded) return;

    // Set basic info from token first
    setUserData((prev) => ({
      ...prev,
      userId: decoded.userId,
      name: decoded.name,
      role: decoded.role,
    }));

    // Fetch full user info (including image) from API
    fetch(`/api/auth/${decoded.userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: decoded.userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUserData((prev) => ({
          ...prev,
          image: data.image || "/default-avatar.png",
        }));
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
      });
  }, []);

  return (
    <header className="w-full h-16 md:h-20 bg-white sticky top-0 z-30 border-b border-gray-100 flex items-center justify-between px-4 md:px-8 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
            <Store className="text-white text-xl" />
          </div>
          <div className="ml-3">
            <h1
              className="text-xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent"
              style={{ fontFamily: "Pacifico, serif" }}
            >
              RoopShree
            </h1>
            <p className="text-xs text-gray-500 font-medium">Premium Dashboard</p>
          </div>
        </div>

        <div className="w-15 h-8"></div>

        <div className="hidden md:block relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-lg py-2 pl-10 pr-4 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="text-center">
          <p className="text-xs text-amber-700 font-medium">Today's Sales</p>
          <p className="text-sm font-bold text-amber-800">$12.4K</p>
        </div>

        <div className="text-center">
          <p className="text-xs text-amber-700 font-medium">Active Orders</p>
          <p className="text-sm font-bold text-amber-800">47</p>
        </div>

        <div className="relative">
          <button className="relative p-2.5 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all duration-300 cursor-pointer">
            <Bell className="text-xl" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
              4
            </span>
          </button>
        </div>

        {/* User Avatar / Profile */}
        <div className="relative">
          <button className="flex items-center space-x-3 p-2 hover:bg-amber-50 rounded-xl transition-all duration-300 cursor-pointer">
            <Image
              width={40}
              height={40}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border-2 border-amber-200"
              src={userData.image || "/default-avatar.png"}
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">{userData.name}</p>
              <p className="text-xs text-gray-500">{userData.role}</p>
            </div>
            <i className="ri-arrow-down-s-line text-gray-400"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
