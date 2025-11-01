// Improved Welcome Page UI
"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BiStore } from "react-icons/bi";
const WelcomePage: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col justify-between items-center px-6 sm:px-10 bg-gradient-to-b from-rose-50 via-white to-orange-50 overflow-hidden text-gray-900">
      <div className="absolute inset-0 bg-[url('/makeup-bg.jpg')] bg-cover bg-center opacity-20 blur-sm"></div>

      <div className="absolute top-10 left-5 w-44 h-44 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float-slow"></div>
      <div className="absolute bottom-10 right-5 w-56 h-56 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float-slower"></div>

      <div className="flex flex-col items-center text-center max-w-xl z-10 mt-24 sm:mt-32 md:mt-36">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight drop-shadow-md animate-glow">
          Welcome to
        </h1>
        <p className="text-3xl sm:text-4xl font-serif tracking-widest text-pink-700 mt-2 mb-3">
          ROOP SHREE
        </p>
        <p className="bg-amber-500 flex items-center justify-center w-20 h-20 rounded-3xl shadow-lg">
          <BiStore className="text-4xl text-amber-100 drop-shadow-md" />
        </p>
        <p className="text-base sm:text-lg md:text-xl text-gray-700 mt-3 mb-12 leading-relaxed max-w-md">
          Discover premium beauty crafted to enhance your natural glow. Step
          into a world of charm, confidence, and luxury.
        </p>
      </div>

      <div className="w-full max-w-xs mb-16 z-10">
        <Link href="/auth/signin" className="w-full">
          <button className="flex items-center justify-center w-full gap-3 px-8 py-4 bg-gradient-to-r from-[#f2ae55] to-[#ff8904] text-white font-semibold text-lg rounded-2xl shadow-[0_4px_15px_rgba(255,100,130,0.4)] ">
            <span>Continue to Glamour</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;
