"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const WelcomePage: React.FC = () => {
  return (
    <div className="">
      <div className="relative w-screen h-[70vh]">
        <Image
          src="/Vector 2.svg"
          alt="wave"
          fill
          className="object-cover absolute h-screen w-full"
          priority
        />
      </div>

      <div className="pl-[5vw]">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold   mb-4 md:mb-6 leading-tight">
          Welcome
        </h2>
      </div>

      <div className="pl-[5vw] pb-16">
        <p className="  text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil quis
          recusandae enim accusantium sed atque labore rerum pariatur soluta
          quia!
        </p>
      </div>

      <div className="relative">
        {/* Continue Button */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20">
          <Link href="/auth/signin">
            <button className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-2 sm:py-3 text-orange-600 font-bold rounded-full hover:bg-orange-50 transition group shadow-lg">
              <span className="text-sm sm:text-base">Continue</span>
              <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-orange-600 text-white rounded-full transition-transform group-hover:scale-110">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4"
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
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
