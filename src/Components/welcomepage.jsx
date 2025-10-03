import React from "react";
import Link from "next/link";

const WelcomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header with gradient and animated wave */}
      <div className="relative h-96 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center overflow-hidden">
        <svg
          className="absolute bottom-0 w-full"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,224L48,218.7C96,213,192,203,288,197.3C384,192,480,192,576,197.3C672,203,768,213,864,197.3C960,181,1056,139,1152,133.3C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Content Section */}
      <div className="flex-1 bg-white px-8  md:px-16   relative">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Welcome
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-2xl">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil quis recusandae enim accusantium sed atque labore rerum pariatur soluta quia!  
          </p>
 
        </div>

        {/* Button in bottom-right corner */}
       <div className="fixed bottom-2 right-2 z-20">
  <Link href="/ShineUp">
    <button className="flex items-center gap-4 px-6 py-3 text-orange-600 font-bold rounded-full   hover:bg-orange-50 transition">
      Continue
      <span className="flex items-center justify-center w-8 h-8 bg-orange-600 text-white rounded-full transition-transform group-hover:scale-110">
        <svg
          className="w-4 h-4"
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