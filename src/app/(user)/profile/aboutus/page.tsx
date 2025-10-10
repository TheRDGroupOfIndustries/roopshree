"use client";

import React from "react";
import { Info, ArrowLeft, ShoppingCart, Target, Heart } from "lucide-react"; // Added extra icons for better visuals
import Link from "next/link";
import Image from "next/image";

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
      About Shine Beauty
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

// --- Value Proposition Component ---
const ValueProp: React.FC<{ icon: React.ElementType; title: string; description: string }> = ({
  icon: Icon,
  title,
  description,
}) => (
  <div className="flex flex-col items-center text-center p-4">
    <div className="p-3 mb-3 bg-sky-100 rounded-full">
      <Icon className="w-6 h-6 text-sky-600" />
    </div>
    <h3 className="font-bold text-lg text-gray-800 mb-1">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

const AboutUsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Sticky Header */}
      <Header />

      {/* 2. Main Content Wrapper */}
      <div className="px-4 sm:px-6 py-8 flex justify-center">
        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl p-6 md:p-10 space-y-10">
          
          {/* Main Title Block */}
          <div className="flex items-center gap-4 border-b pb-4 border-gray-100">
            <div className="p-3 bg-sky-100 rounded-xl">
              <Info className="text-sky-600 w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Our Story
            </h1>
          </div>

          {/* Company Image with Next/Image Fix */}
          <div className="w-full h-48 md:h-72 relative rounded-xl overflow-hidden shadow-lg">
            <Image
              src="https://plus.unsplash.com/premium_photo-1682141007707-1f09c5a1d814?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c29mdHdhcmUlMjBjb21wYW55fGVufDB8fDB8fHww"
              alt="Shine Beauty team working"
              layout="fill"
              objectFit="cover"
              // Add priority for LCP optimization if this image is prominent
              priority 
            />
          </div>

          {/* Company Description */}
          <section className="space-y-4 text-gray-700 text-base leading-relaxed">
            <p>
              Welcome to **Shine Beauty**! We are dedicated to providing **high-quality cosmetics and skincare** products that cater to all your beauty needs. Born out of a passion for self-care and innovation, our brand stands for purity, efficacy, and joy.
            </p>
            <p>
              Our mission is to make beauty **accessible, sustainable, and enjoyable** for everyone. We constantly update our products with the latest trends and botanical innovations in the beauty industry, ensuring you always get the best.
            </p>
            <p>
              We believe in **customer satisfaction, premium quality**, and transparent communication. Every product we ship is a promise of quality—your happiness is truly our top priority.
            </p>
          </section>

          {/* Core Values Section */}
          <div className="pt-4 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ValueProp
                icon={Heart}
                title="Customer First"
                description="We listen, we care, and we put your needs at the heart of everything we do."
              />
              <ValueProp
                icon={Target}
                title="Sustainable Beauty"
                description="Committed to eco-friendly practices, ethical sourcing, and cruelty-free products."
              />
              <ValueProp
                icon={Info}
                title="Transparency"
                description="Full disclosure on ingredients and sourcing. Trust is the foundation of our brand."
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-8 border-t pt-6 border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Get In Touch</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-700 text-base mb-11">
                <p>
                    <span className="font-semibold text-sky-600">Email:</span> <a href="mailto:support@shinebeauty.in" className="hover:underline">support@shinebeauty.in</a>
                </p>
                <p>
                    <span className="font-semibold text-sky-600">Phone:</span> <a href="tel:+919876543210" className="hover:underline">+91 98765 43210</a>
                </p>
                <p>
                    <span className="font-semibold text-sky-600">Address:</span> 123, Shine Street, Beauty City
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;