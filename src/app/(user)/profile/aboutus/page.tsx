"use client";

import React from "react";
import { Info } from "lucide-react";

const AboutUsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Info className="w-6 h-6 text-gray-700" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">About Us</h1>
        </div>

        {/* Company Image */}
        <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-sm">
          <img
            src="/images/company_about.png"
            alt="About Us"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Company Description */}
        <div className="space-y-4 text-gray-700 text-sm md:text-base">
          <p>
            Welcome to Shine Beauty! We are dedicated to providing high-quality cosmetics and skincare products that cater to all your beauty needs.
          </p>
          <p>
            Our mission is to make beauty accessible, sustainable, and enjoyable for everyone. We constantly update our products with the latest trends and innovations in the beauty industry.
          </p>
          <p>
            We believe in customer satisfaction, premium quality, and transparent communication. Your happiness is our top priority.
          </p>
        </div>

        {/* Contact Info */}
        <div className="mt-4 space-y-2 text-gray-600 text-sm">
          <p><span className="font-medium">Email:</span> support@shinebeauty.in</p>
          <p><span className="font-medium">Phone:</span> +91 98765 43210</p>
          <p><span className="font-medium">Address:</span> 123, Shine Street, Beauty City, India</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
