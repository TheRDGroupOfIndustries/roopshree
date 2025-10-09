"use client";

import React from "react";
import { User } from "lucide-react";

const PersonalInfoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center items-center">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg">
            <User className="text-gray-600 w-6 h-6" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">
            Personal Information
          </h1>
        </div>

        <form className="space-y-5">
          <div>
            <label className="block text-gray-600 text-sm mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Priya Sharma"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="priya.sharma@email.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-1">Phone</label>
            <input
              type="tel"
              placeholder="+91 9876543210"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfoPage;
