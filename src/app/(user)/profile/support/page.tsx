"use client";

import React from "react";
import { Headphones, ArrowLeft, ShoppingCart, Phone, Mail, MessageSquare } from "lucide-react"; // Added missing imports
import Link from "next/link"; // Added Link

const SupportPage: React.FC = () => {
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
        Help & Support
      </h2>
      <Link href="/my-cart" aria-label="View shopping cart">
        <button className="relative text-gray-700 hover:text-sky-600 p-2 hover:bg-sky-50 rounded-full transition-colors">
          <ShoppingCart size={24} />
          {/* Cart item count - hardcoded for example */}
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
            2
          </span>
        </button>
      </Link>
    </header>
  );

  // --- Support Option Card Component ---
  interface SupportOptionProps {
    icon: React.ElementType;
    title: string;
    description: string;
    actionLink: string;
    linkText: string;
  }

  const SupportOptionCard: React.FC<SupportOptionProps> = ({
    icon: Icon,
    title,
    description,
    actionLink,
    linkText,
  }) => (
    <Link href={actionLink} passHref>
      <div className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer group">
        
        {/* Icon and Text */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-sky-100 rounded-full">
            <Icon className="w-6 h-6 text-sky-600 group-hover:scale-105 transition-transform" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-sky-700 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-600 mt-1 max-w-sm">
              {description}
            </p>
          </div>
        </div>

        {/* Action Link Button */}
        <button className="text-sm font-semibold text-sky-600 group-hover:text-white group-hover:bg-sky-600 border border-sky-600 group-hover:border-sky-600 px-4 py-2 rounded-full transition-all flex-shrink-0">
          {linkText}
        </button>
      </div>
    </Link>
  );

  // --- Main Support Page ---
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Sticky Header */}
      <Header />

      {/* 2. Main Content Wrapper */}
      <div className="px-4 sm:px-6 py-8 flex justify-center">
        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl p-6 md:p-10">
          
          {/* Main Title and Intro */}
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-sky-100 rounded-xl">
              <Headphones className="text-sky-600 w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Customer Support Center
            </h1>
          </div>

          <p className="text-gray-600 text-lg mb-8 pb-6 border-b border-gray-100 leading-relaxed">
            We're here to ensure a smooth shopping experience. Choose the best way to connect with us for questions about your orders, returns, payments, or account.
          </p>

          {/* Support Options List */}
          <div className="space-y-5 mb-10">
            <SupportOptionCard
              icon={Phone}
              title="Dedicated Call Support"
              description="Talk to our support agent for immediate assistance. Available 24/7."
              actionLink="tel:+919876543210"
              linkText="Call Now"
            />

            <SupportOptionCard
              icon={MessageSquare}
              title="Instant Live Chat"
              description="Chat with us in real-time right from your browser or app for quick queries."
              actionLink="/support/chat"
              linkText="Start Chat"
            />

            <SupportOptionCard
              icon={Mail}
              title="Email Inquiry"
              description="Send us a detailed message. We'll respond to your email within 4-6 hours."
              actionLink="mailto:support@shinebeauty.in"
              linkText="Send Email"
            />
          </div>

           
        </div>
      </div>
    </div>
  );
};

export default SupportPage;