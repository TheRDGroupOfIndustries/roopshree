"use client";
import React from 'react';
import { MoveLeft, Headphones, Phone, Mail, ChevronRight } from "lucide-react";

// Placeholder for next/link compatibility
const Link = ({ href, children }) => <a href={href}>{children}</a>;

// --- Support Option Component (Simplified UI) ---
const SupportOption = ({
  icon: Icon,
  title,
  description,
  actionLink,
  linkText,
}) => (
  <Link href={actionLink}>
    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-200 cursor-pointer border border-gray-100">
      
      {/* Icon and Text Content */}
      <div className="flex items-start gap-4">
        {/* Circular Icon with Rose theme for consistency */}
        <div className="p-3 bg-rose-100 rounded-full flex-shrink-0">
          <Icon className="w-6 h-6 text-rose-600" />
        </div>
        
        {/* Text */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 leading-tight">
            {title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>

      {/* Action Indicator */}
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </div>
  </Link>
);

// --- Main Help and Support Component ---
const HelpAndSupport = () => {
  return (
    <div className="min-h-screen bg-gray-100/50 flex flex-col items-center text-gray-800">
      
      {/* 🔹 Top Navbar */}
      <nav className="sticky top-0 z-10 w-full flex items-center gap-5 px-5 py-4 bg-rose-700 shadow-lg">
        <MoveLeft
          className="w-6 h-6 text-white cursor-pointer"
          onClick={() => window.history.back()}
        />
        <h1 className="text-xl text-white font-bold tracking-tight">Help & Support</h1>
      </nav>

      <main className="w-full max-w-4xl p-4 sm:p-8">
        
        {/* Title Section */}
        <div className="flex items-center gap-3 mb-6 mt-4">
          <Headphones className="text-rose-600 w-7 h-7" />
          <h1 className="text-2xl font-bold text-gray-800">Support Center</h1>
        </div>

        <p className="text-md text-gray-600 mb-8">
          Need assistance with your account, reports, or application features? Choose a support channel below.
        </p>

        {/* Support Options List */}
        <div className="space-y-4">
          
          <SupportOption
            icon={Phone}
            title="Call Support Hotline"
            description="Speak directly to our 24/7 technical team for immediate help."
            actionLink="tel:+919876543210"
            linkText="Call Now"
          />

          <SupportOption
            icon={Mail}
            title="Email Technical Support"
            description="Submit a detailed query and get a guaranteed response within 6 business hours."
            actionLink="mailto:support@roopshree.in"
            linkText="Send Email"
          />

          <SupportOption
            icon={Headphones}
            title="View Knowledge Base"
            description="Browse self-help articles, FAQs, and application documentation."
            actionLink="/faq" // Placeholder route
            linkText="Read Guides"
          />
          
        </div>
      </main>
    </div>
  );
};

export default HelpAndSupport;