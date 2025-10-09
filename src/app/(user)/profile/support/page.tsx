"use client";

import React from "react";
import { Headphones } from "lucide-react";

const SupportPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Headphones className="w-6 h-6 text-gray-700" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Customer Support</h1>
        </div>

        {/* Support Message */}
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          We’re here to help you 24/7. If you have any questions or issues related to your orders, 
          payments, or account, feel free to reach out to us using the options below.
        </p>

        {/* Support Options */}
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:shadow-md transition">
            <h3 className="font-medium text-gray-800 mb-1">📞 Call Support</h3>
            <p className="text-sm text-gray-600">+91 98765 43210</p>
          </div>

          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:shadow-md transition">
            <h3 className="font-medium text-gray-800 mb-1">✉️ Email Support</h3>
            <p className="text-sm text-gray-600">support@shinebeauty.in</p>
          </div>

          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:shadow-md transition">
            <h3 className="font-medium text-gray-800 mb-1">💬 Live Chat</h3>
            <p className="text-sm text-gray-600">Chat with our support team instantly from the app.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          Available 24 hours a day, 7 days a week.
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
