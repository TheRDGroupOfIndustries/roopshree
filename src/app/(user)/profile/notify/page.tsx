"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";

const NotificationsPage: React.FC = () => {
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [appNotif, setAppNotif] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center items-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Bell className="text-gray-600 w-6 h-6" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">
            Notifications
          </h1>
        </div>

        {/* Settings List */}
        <div className="space-y-6">
          {/* Email Notifications */}
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-gray-800 font-medium">
                Email Notifications
              </h3>
              <p className="text-sm text-gray-500">
                Get order updates, offers, and alerts on your email.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotif}
                onChange={() => setEmailNotif(!emailNotif)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-gray-800 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>

          {/* SMS Notifications */}
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-gray-800 font-medium">
                SMS Notifications
              </h3>
              <p className="text-sm text-gray-500">
                Receive delivery and security alerts via SMS.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={smsNotif}
                onChange={() => setSmsNotif(!smsNotif)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-gray-800 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>

          {/* App Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-800 font-medium">
                App Notifications
              </h3>
              <p className="text-sm text-gray-500">
                Get push notifications directly from the app.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={appNotif}
                onChange={() => setAppNotif(!appNotif)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-gray-800 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          Customize how you receive notifications.
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
