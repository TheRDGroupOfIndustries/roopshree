"use client";
import React from "react";
import { Search, Bell, User, Settings } from "lucide-react";

export default function Navbar() {
  return (
    // Updated styling: Lighter shadow, stickier, slightly taller, and better background clarity
    <header className="w-full h-16 md:h-20 bg-white sticky top-0 z-30 border-b border-gray-100 flex items-center justify-between px-4 md:px-8 shadow-sm">
      {/* 1. Page Title / Breadcrumbs Area (Left) */}
      <div className="flex items-center space-x-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
          RoopShree Dashboard
        </h1>
        {/* You could optionally add breadcrumbs here for a more complex app */}
      </div>

      {/* 2. Controls and User Menu (Right) */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Search Bar (Desktop) */}
        <div className="hidden md:block relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-48 py-2 pl-10 pr-4 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>

        {/* Action Buttons (Notification/Settings) */}
        <button
          title="Notifications"
          className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-indigo-600 transition duration-150 relative"
        >
          <Bell className="w-5 h-5" />
          {/* Unread Indicator */}
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500" />
        </button>

        <button
          title="Settings"
          className="hidden sm:block p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-indigo-600 transition duration-150"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* User Avatar / Profile Button */}
        <button className="flex items-center p-1.5 md:p-2 ml-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition duration-150 group">
          {/* User Icon/Avatar */}
          <div className="bg-indigo-500 p-1.5 rounded-full">
            <User className="w-5 h-5 text-white" />
          </div>

          {/* User Name (Desktop) */}
          <span className="hidden md:block text-sm font-medium text-gray-700 ml-3 mr-1">
            Admin User
          </span>
        </button>
      </div>
    </header>
  );
}
