"use client";

import React, { useState } from "react";
import { Bell, ArrowLeft, ShoppingCart } from "lucide-react"; // Imported missing icons
import Link from "next/link"; // Imported Link

const NotificationsPage: React.FC = () => {
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [appNotif, setAppNotif] = useState(true);

  // --- Header Component ---
  const Header = () => (
    <header className="sticky top-0 bg-white flex justify-between items-center px-4 sm:px-6 py-3 shadow-lg z-50 border-b border-gray-100">
      <button
        className="text-gray-700 hover:text-sky-600 transition-colors p-2 hover:bg-sky-50 rounded-full"
        onClick={() => window.history.back()}
        aria-label="Go back"
      >
        <ArrowLeft size={24} />
      </button>
      <h2 className="font-bold text-xl sm:text-2xl flex-1 text-center text-gray-800">
        Notification Settings
      </h2>
      <Link href="/my-cart" aria-label="View shopping cart">
        <button className="relative text-gray-700 hover:text-sky-600 p-2 hover:bg-sky-50 rounded-full transition-colors">
          <ShoppingCart size={24} />
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
            2
          </span>
        </button>
      </Link>
    </header>
  );

  // --- Toggle Switch Component (Refined for professional look) ---
  const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({
    checked,
    onChange,
  }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div
        className={`w-12 h-7 rounded-full peer transition-all duration-300 shadow-inner 
          ${checked ? "bg-sky-500" : "bg-gray-300"}
          peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sky-300`}
      >
        <div
          className={`absolute top-0.5 left-0.5 bg-white h-6 w-6 rounded-full transition-transform duration-300 shadow-md
            ${checked ? "translate-x-5" : "translate-x-0"}`}
        ></div>
      </div>
    </label>
  );

  // --- Main Notifications Page ---
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Sticky Header */}
      <Header />

      {/* 2. Main Content Wrapper */}
      <div className="px-4 sm:px-6 py-8 flex justify-center">
        <div className="w-full max-w-3xl bg-white shadow-2xl rounded-xl p-6 md:p-10">
          
          {/* Section Title */}
          <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-100">
            <div className="p-3 bg-sky-100 rounded-xl">
              <Bell className="text-sky-600 w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Manage Alerts
            </h1>
          </div>

          {/* Settings List */}
          <div className="space-y-6 divide-y divide-gray-100">
            {/* Email Notifications */}
            <div className="flex items-center justify-between pt-0 pb-4">
              <div>
                <h3 className="text-gray-800 font-semibold text-lg">
                  Email Notifications
                </h3>
                <p className="text-sm text-gray-500 max-w-md">
                  Get order updates, personalized offers, and security alerts sent directly to your inbox.
                </p>
              </div>
              <ToggleSwitch
                checked={emailNotif}
                onChange={() => setEmailNotif(!emailNotif)}
              />
            </div>

            {/* SMS Notifications */}
            <div className="flex items-center justify-between pt-6 pb-4">
              <div>
                <h3 className="text-gray-800 font-semibold text-lg">
                  SMS Notifications
                </h3>
                <p className="text-sm text-gray-500 max-w-md">
                  Receive important delivery status updates and urgent account security messages via text.
                </p>
              </div>
              <ToggleSwitch
                checked={smsNotif}
                onChange={() => setSmsNotif(!smsNotif)}
              />
            </div>

            {/* App Notifications (Push) */}
            <div className="flex items-center justify-between pt-6">
              <div>
                <h3 className="text-gray-800 font-semibold text-lg">
                  Mobile Push Notifications
                </h3>
                <p className="text-sm text-gray-500 max-w-md">
                  Get instant push alerts on your phone for new deals and in-app activity.
                </p>
              </div>
              <ToggleSwitch
                checked={appNotif}
                onChange={() => setAppNotif(!appNotif)}
              />
            </div>
          </div>

          {/* Info */}
          <div className="mt-10 pt-4 border-t border-gray-100 text-center text-gray-500 text-sm">
            You can always change your preferences here.
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;