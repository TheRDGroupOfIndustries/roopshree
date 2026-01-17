"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

/* Parent container for staggered animation */
const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.4,
      delayChildren: 0.2,
    },
  },
};

/* Individual animations */
const fadeScale = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const slideDown = {
  hidden: { opacity: 0, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-pink-50 flex items-center justify-center px-6 py-12 relative overflow-hidden">

      {/* Floating dots */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-3 h-3 bg-pink-300 rounded-full opacity-40 animate-float" />
        <div className="absolute top-24 right-20 w-5 h-5 bg-rose-300 rounded-full opacity-30 animate-float-fast" />
        <div className="absolute top-40 left-32 w-2 h-2 bg-amber-300 rounded-full opacity-50 animate-float-ultra" />

        <div className="absolute top-1/2 left-12 w-4 h-4 bg-pink-200 rounded-full opacity-40 animate-float-fast" />
        <div className="absolute top-1/2 right-24 w-6 h-6 bg-rose-200 rounded-full opacity-30 animate-float-ultra" />
        <div className="absolute top-[55%] left-1/3 w-3 h-3 bg-amber-200 rounded-full opacity-50 animate-float" />

        <div className="absolute bottom-20 left-16 w-5 h-5 bg-pink-300 rounded-full opacity-40 animate-float-ultra" />
        <div className="absolute bottom-32 right-32 w-4 h-4 bg-rose-300 rounded-full opacity-30 animate-float-fast" />
        <div className="absolute bottom-48 right-12 w-6 h-6 bg-amber-300 rounded-full opacity-35 animate-float" />
      </div>

      {/* Main content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full flex flex-col items-center z-10"
      >
        {/* Heading */}
        <motion.div variants={slideDown} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Welcome to
          </h1>
          <h2 className="text-5xl md:text-6xl font-semibold bg-pink-600 bg-clip-text text-transparent">
            ROOP SHREE
          </h2>
        </motion.div>

        {/* LOGO WITH SAME EFFECT */}
        <motion.div variants={fadeScale} className="mb-12">
          <div className="w-44 h-44 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl shadow-[0_0_25px_8px_rgba(252,211,77,0.25),0_0_25px_8px_rgba(249,115,22,0.25)] flex items-center justify-center hover:scale-105 transition-transform">
            
            {/* Logo Image */}
            <div className="w-32 h-32 flex items-center justify-center">
              <Image
                src="/images/logo.jpeg"
                alt="Roop Shree Logo"
                width={128}
                height={128}
                priority
                className="object-contain rounded-2xl drop-shadow-[0_0_12px_rgba(255,255,255,0.45)]"
              />
            </div>

          </div>
        </motion.div>

        {/* Text + Button */}
        <motion.div variants={slideUp} className="flex flex-col items-center">
          <p className="text-center text-gray-700 text-lg mb-12 px-4">
            Discover premium beauty crafted to enhance your natural glow.
          </p>

          <button
            onClick={() => router.push("/auth/signin")}
            className="w-full max-w-sm bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 text-white font-semibold text-xl py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group"
          >
            Continue to Glamour
            <svg
              className="w-6 h-6 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </motion.div>

        {/* Animated indicators */}
        <div className="flex gap-2 mt-16">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 animate-bounce-dot" />
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 animate-bounce-dot delay-200" />
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 animate-bounce-dot delay-400" />
        </div>
      </motion.div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          50% {
            transform: translateY(-30px);
          }
        }

        @keyframes bounce-dot {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-ultra {
          animation: float 5s ease-in-out infinite;
        }

        .animate-bounce-dot {
          animation: bounce-dot 1.2s ease-in-out infinite;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}
