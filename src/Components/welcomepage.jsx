import React from "react";
import Link from "next/link";

const WelcomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 to-white">
       <div className="h-50 flex flex-col justify-center items-center bg-orange-600 relative"></div>
      {/* SVG Wave */}
      <div className="w-full">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-40"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,
            82.39-16.72,168.19-17.73,250.45-.39C823.78,31,
            906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,
            214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,
            56.44Z"
            className="fill-orange-600"
          />
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