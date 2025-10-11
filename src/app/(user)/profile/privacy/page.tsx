"use client";

import React, { useState } from "react";
// Removed: import Link from "next/link";
import {
  ArrowLeft,
  ShoppingCart,
  LucideIcon,
  Mail,
  Smartphone,
  BarChart3,
  Lock,
  ScanEye,
  Camera,
  MapPin,
  Bell,
  HardDrive,
  UserCheck,
  ChevronRight,
} from "lucide-react";

// --- Type Definitions ---
interface SettingItem {
  icon: LucideIcon;
  label: string;
  description: string;
  key: string; // Key for state management or link routing
}

interface SectionData {
  title: string;
  items: SettingItem[];
}

// --- Component Helpers ---

/**
 * Reusable Toggle Button for privacy settings.
 */
const PrivacyToggle: React.FC<{
  setting: SettingItem;
  isEnabled: boolean;
  onToggle: (key: string) => void;
}> = ({ setting, isEnabled, onToggle }) => (
  <button
    onClick={() => onToggle(setting.key)}
    className="w-full flex items-center p-4 bg-white text-gray-700 hover:bg-gray-50 transition-colors active:bg-gray-100 border-b border-gray-100 last:border-b-0"
  >
    {/* Icon Container */}
    <div className="w-10 h-10 mr-4 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
      <setting.icon size={20} className="text-orange-600" />
    </div>
    {/* Label & Description */}
    <div className="flex-1 text-left min-w-0 pr-4">
      <span className="font-medium text-sm sm:text-base block truncate">
        {setting.label}
      </span>
      <span className="text-xs text-gray-500 block mt-0.5">
        {setting.description}
      </span>
    </div>
    {/* Toggle Switch */}
    <label
      className="relative inline-flex items-center cursor-pointer ml-auto"
      onClick={(e) => e.stopPropagation()} // Stop event propagation to prevent button click interfering with toggle
    >
      <input
        type="checkbox"
        checked={isEnabled}
        readOnly
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
    </label>
  </button>
);

/**
 * Reusable Link Button for non-toggle settings (e.g., viewing data history).
 */
const PrivacyLink: React.FC<{ setting: SettingItem }> = ({ setting }) => (
  // Replaced Next.js Link with standard <a> tag
  <a href={`/settings/${setting.key}`} className="block">
    <div className="w-full flex items-center p-4 bg-white text-gray-700 hover:bg-gray-50 transition-colors active:bg-gray-100 border-b border-gray-100 last:border-b-0">
      {/* Icon Container */}
      <div className="w-10 h-10 mr-4 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
        <setting.icon size={20} className="text-blue-600" />
      </div>
      {/* Label & Description */}
      <div className="flex-1 text-left min-w-0 pr-4">
        <span className="font-medium text-sm sm:text-base block truncate">
          {setting.label}
        </span>
        <span className="text-xs text-gray-500 block mt-0.5">
          {setting.description}
        </span>
      </div>
      {/* Chevron Icon */}
      <ChevronRight size={20} className="text-gray-400 ml-auto" />
    </div>
  </a>
);

/**
 * Main Privacy Settings Page Component.
 */
const PrivacySettingsPage: React.FC = () => {
  // --- State for Toggles ---
  const [settingsState, setSettingsState] = useState({
    emailMarketing: true,
    smsAlerts: false,
    dataSharing: true,
    faceIdLogin: true,
    twoFactorAuth: false,
    locationAccess: true,
    cameraAccess: false,
    appNotifications: true,
  });

  const handleToggle = (key: string) => {
    setSettingsState((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  // --- Data Sections ---
  const DATA_CONTROL_SETTINGS: SectionData = {
    title: "Data & Marketing Control",
    items: [
      {
        icon: Mail,
        label: "Email Marketing Opt-in",
        description: "Receive personalized offers and news.",
        key: "emailMarketing",
      },
      {
        icon: Smartphone,
        label: "SMS Alerts",
        description: "Receive promotional text messages.",
        key: "smsAlerts",
      },
      {
        icon: BarChart3,
        label: "Third-Party Data Sharing",
        description: "Allow data usage for external analytics and partners.",
        key: "dataSharing",
      },
    ],
  };

  const APP_PERMISSIONS: SectionData = {
    title: "App Permissions",
    items: [
      {
        icon: MapPin,
        label: "Location Services",
        description: "Enable for localized offers and delivery tracking.",
        key: "locationAccess",
      },
      {
        icon: Camera,
        label: "Camera Access",
        description: "Allow access for image uploads and scanning features.",
        key: "cameraAccess",
      },
      {
        icon: Bell,
        label: "App Notifications",
        description: "Receive order and application update alerts.",
        key: "appNotifications",
      },
    ],
  };

  const SECURITY_SETTINGS: SectionData = {
    title: "Account Security & Privacy",
    items: [
      {
        icon: Lock,
        label: "Two-Factor Authentication (2FA)",
        description: "Add an extra layer of security to your account.",
        key: "twoFactorAuth",
      },
      {
        icon: ScanEye,
        label: "Biometric / Face ID Login",
        description: "Enable faster, secure login on this device.",
        key: "faceIdLogin",
      },
      {
        icon: UserCheck,
        label: "Review Data History",
        description: "View and download your personal data history.",
        key: "data_export", // Link
      },
      {
        icon: HardDrive,
        label: "Manage Devices",
        description: "See active sessions and log out from old devices.",
        key: "manage_devices", // Link
      },
    ],
  };

  const allSections = [
    DATA_CONTROL_SETTINGS,
    APP_PERMISSIONS,
    SECURITY_SETTINGS,
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-white flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 shadow-md z-20 border-b border-gray-100">
        <button
          className="text-gray-700 hover:text-gray-900 transition-colors p-1"
          onClick={() => window.history.back()}
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="font-extrabold text-lg sm:text-xl flex-1 text-center text-gray-800 tracking-wide">
          Privacy & Security
        </h2>
        {/* Replaced Link with standard <a> tag */}
        <a href="/my-cart" aria-label="View shopping cart">
          <div className="relative text-gray-700 hover:text-orange-500 p-1 transition-colors">
            <ShoppingCart size={24} />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1 rounded-full min-w-[16px] h-[16px] flex items-center justify-center">
              2
            </span>
          </div>
        </a>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 max-w-4xl mx-auto w-full">
        {/* Intro Card */}
        <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-6 rounded-2xl shadow-lg mb-6 border border-orange-100">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Your Privacy Matters.
          </h3>
          <p className="text-sm text-gray-600">
            Manage how your data is collected, used, and shared. Take control of
            your account settings and app permissions.
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6 pb-6">
          {allSections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <h3 className="px-4 pt-4 text-base font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-100 pb-2">
                {section.title}
              </h3>
              <div className="divide-y divide-gray-100">
                {section.items.map((item, itemIndex) => {
                  // Determine if the item should be a toggle (state exists) or a link (no state)
                  const isToggle = Object.keys(settingsState).includes(
                    item.key
                  );
                  const isLink = !isToggle;

                  if (isToggle) {
                    return (
                      <PrivacyToggle
                        key={itemIndex}
                        setting={item}
                        isEnabled={
                          settingsState[
                            item.key as keyof typeof settingsState
                          ]
                        }
                        onToggle={handleToggle}
                      />
                    );
                  }

                  if (isLink) {
                    return <PrivacyLink key={itemIndex} setting={item} />;
                  }
                  return null;
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="w-full max-w-4xl mx-auto p-6 text-center">
        <p className="text-xs text-gray-500">
          For complete details on data handling, please refer to our{" "}
          {/* Replaced Link with standard <a> tag */}
          <a
            href="/legal/privacy"
            className="text-orange-600 font-medium hover:underline"
          >
            Privacy Policy
          </a>
          .
        </p>
      </footer>
    </div>
  );
};

export default PrivacySettingsPage;
