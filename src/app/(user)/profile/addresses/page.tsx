"use client";

import React from "react";
import { MapPin, Plus } from "lucide-react";

const AddressesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center items-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <MapPin className="text-gray-600 w-6 h-6" />
            </div>
            <h1 className="text-xl font-semibold text-gray-800">
              Delivery Addresses
            </h1>
          </div>

          <button className="flex items-center gap-2 text-sm bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all">
            <Plus className="w-4 h-4" /> Add New
          </button>
        </div>

        {/* Address Cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Address Card 1 */}
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:shadow-md transition">
            <h3 className="text-gray-800 font-medium mb-2">Home</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Priya Sharma <br />
              123, Green Park Road, Noida, Uttar Pradesh <br />
              +91 9876543210
            </p>
            <div className="flex gap-3 mt-4">
              <button className="text-sm text-gray-700 font-medium hover:underline">
                Edit
              </button>
              <button className="text-sm text-red-600 font-medium hover:underline">
                Delete
              </button>
            </div>
          </div>

          {/* Address Card 2 */}
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:shadow-md transition">
            <h3 className="text-gray-800 font-medium mb-2">Work</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Priya Sharma <br />
              A-45, Sector 62, TechPark Office, Noida <br />
              +91 9876543210
            </p>
            <div className="flex gap-3 mt-4">
              <button className="text-sm text-gray-700 font-medium hover:underline">
                Edit
              </button>
              <button className="text-sm text-red-600 font-medium hover:underline">
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Add address placeholder if none */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          You have 2 saved addresses.
        </div>
      </div>
    </div>
  );
};

export default AddressesPage;
