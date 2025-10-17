// "use client";

// import React from "react";
// import { Info, ArrowLeft, ShoppingCart, Target, Heart } from "lucide-react"; // Added extra icons for better visuals
// import Link from "next/link";
// import Image from "next/image";

// // --- Header Component ---
// const Header = () => (
//   <header className="sticky top-0 -white flex justify-between items-center px-4 sm:px-6 py-3 shadow-lg z-50 border-b border-gray-100">
//     <button
//       className="  hover:text-sky-600 transition-colors p-2 hover:-sky-50 rounded-full"
//       onClick={() => window.history.back()}
//       aria-label="Go back"
//     >
//       <ArrowLeft size={24} />
//     </button>
//     <h2 className="font-bold text-xl sm:text-2xl flex-1 text-center  ">
//       About Shine Beauty
//     </h2>
//     <Link href="/my-cart" aria-label="View shopping cart">
//       <button className="relative   hover:text-sky-600 p-2 hover:-sky-50 rounded-full transition-colors">
//         <ShoppingCart size={24} />
//         <span className="absolute -top-1 -right-1 -red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
//           2
//         </span>
//       </button>
//     </Link>
//   </header>
// );

// // --- Value Proposition Component ---
// const ValueProp: React.FC<{ icon: React.ElementType; title: string; description: string }> = ({
//   icon: Icon,
//   title,
//   description,
// }) => (
//   <div className="flex flex-col items-center text-center p-4">
//     <div className="p-3 mb-3 -sky-100 rounded-full">
//       <Icon className="w-6 h-6 text-sky-600" />
//     </div>
//     <h3 className="font-bold text-lg   mb-1">{title}</h3>
//     <p className="text-sm  ">{description}</p>
//   </div>
// );

// const AboutUsPage: React.FC = () => {
//   return (
//     <div className="min-h-screen -gray-50">
//       {/* 1. Sticky Header */}
//       <Header />

//       {/* 2. Main Content Wrapper */}
//       <div className="px-4 sm:px-6 py-8 flex justify-center">
//         <div className="w-full max-w-4xl -white shadow-2xl rounded-xl p-6 md:p-10 space-y-10">

//           {/* Main Title Block */}
//           <div className="flex items-center gap-4 border-b pb-4 border-gray-100">
//             <div className="p-3 -sky-100 rounded-xl">
//               <Info className="text-sky-600 w-7 h-7" />
//             </div>
//             <h1 className="text-3xl font-bold  ">
//               Our Story
//             </h1>
//           </div>

//           {/* Company Image with Next/Image Fix */}
//           <div className="w-full h-48 md:h-72 relative rounded-xl overflow-hidden shadow-lg">
//             <Image
//               src="https://plus.unsplash.com/premium_photo-1682141007707-1f09c5a1d814?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c29mdHdhcmUlMjBjb21wYW55fGVufDB8fDB8fHww"
//               alt="Shine Beauty team working"
//               layout="fill"
//               objectFit="cover"
//               // Add priority for LCP optimization if this image is prominent
//               priority
//             />
//           </div>

//           {/* Company Description */}
//           <section className="space-y-4   text-base leading-relaxed">
//             <p>
//               Welcome to **Shine Beauty**! We are dedicated to providing **high-quality cosmetics and skincare** products that cater to all your beauty needs. Born out of a passion for self-care and innovation, our brand stands for purity, efficacy, and joy.
//             </p>
//             <p>
//               Our mission is to make beauty **accessible, sustainable, and enjoyable** for everyone. We constantly update our products with the latest trends and botanical innovations in the beauty industry, ensuring you always get the best.
//             </p>
//             <p>
//               We believe in **customer satisfaction, premium quality**, and transparent communication. Every product we ship is a promise of quality—your happiness is truly our top priority.
//             </p>
//           </section>

//           {/* Core Values Section */}
//           <div className="pt-4 border-t border-gray-100">
//             <h2 className="text-2xl font-bold text-center   mb-6">Our Core Values</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               <ValueProp
//                 icon={Heart}
//                 title="Customer First"
//                 description="We listen, we care, and we put your needs at the heart of everything we do."
//               />
//               <ValueProp
//                 icon={Target}
//                 title="Sustainable Beauty"
//                 description="Committed to eco-friendly practices, ethical sourcing, and cruelty-free products."
//               />
//               <ValueProp
//                 icon={Info}
//                 title="Transparency"
//                 description="Full disclosure on ingredients and sourcing. Trust is the foundation of our brand."
//               />
//             </div>
//           </div>

//           {/* Contact Info */}
//           <div className="mt-8 border-t pt-6 border-gray-100">
//             <h2 className="text-xl font-bold   mb-4">Get In Touch</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4   text-base mb-11">
//                 <p>
//                     <span className="font-semibold text-sky-600">Email:</span> <a href="mailto:support@shinebeauty.in" className="hover:underline">support@shinebeauty.in</a>
//                 </p>
//                 <p>
//                     <span className="font-semibold text-sky-600">Phone:</span> <a href="tel:+919876543210" className="hover:underline">+91 98765 43210</a>
//                 </p>
//                 <p>
//                     <span className="font-semibold text-sky-600">Address:</span> 123, Shine Street, Beauty City
//                 </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AboutUsPage;

"use client";

import React from "react";
import { Info, ArrowLeft, Heart, Target } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const AboutUsPage: React.FC = () => {
  return (
    <div className="min-h-screen  bg-white text-black flex flex-col">
      {/* Header */}
      <header className="sticky top-0 -white flex items-center px-4 py-3 bg-white z-50 shadow-md">
        <button
          onClick={() => window.history.back()}
          className="p-2 rounded-full hover:-gray-100 active:-gray-200 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="flex-1 text-gray-950 text-center font-semibold text-base">
          About Roop Shree
        </h2>
        <div className="w-7" /> {/* Spacer for layout balance */}
      </header>

      {/* Content */}
      <main className="flex-1 p-4">
        {/* Hero Image */}
        <div className="relative w-full h-40 rounded-xl overflow-hidden mb-5">
          <Image
            src="/images/image.png"
            alt="Shine Beauty team working"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Story */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 -sky-100 rounded-lg">
              <Info className="w-5 h-5 text-sky-600" />
            </div>
            <h1 className="text-lg font-bold ">Our Story</h1>
          </div>

          <p className="text-sm   leading-relaxed mb-3">
            Welcome to <span className="font-semibold">Roop Shree</span> — your
            trusted destination for premium cosmetics and skincare. We’re driven
            by passion for self-care, sustainability, and innovation.
          </p>
          <p className="text-sm   leading-relaxed mb-3">
            Our goal is to make beauty accessible, ethical, and enjoyable for
            everyone. We combine modern science with natural ingredients to
            deliver the best in skincare and cosmetics.
          </p>
          <p className="text-sm   leading-relaxed">
            At Roop Shree Beauty, your happiness is our priority — because when
            you feel confident, you shine.
          </p>
        </section>

        {/* Core Values */}
        <section className="border-t border-gray-100 pt-5 mb-8">
          <h2 className="text-center font-semibold   mb-4 text-base">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3 -white rounded-lg p-3  ">
              <div className="p-2 -pink-100 rounded-full">
                <Heart className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold  ">Customer First</h3>
                <p className="text-xs  ">
                  We listen, care, and prioritize your satisfaction.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 -white rounded-lg p-3    ">
              <div className="p-2 -green-100 rounded-full">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold  ">Sustainable Beauty</h3>
                <p className="text-xs  ">
                  Eco-friendly, ethical, and cruelty-free practices.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 -white rounded-lg p-3    ">
              <div className="p-2 -sky-100 rounded-full">
                <Info className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold  ">Transparency</h3>
                <p className="text-xs  ">
                  Clear communication and honest ingredients.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="border-t  pt-5 text-center text-sm   space-y-2">
          <p>
            <span className="font-semibold text-sky-600">Email:</span>{" "}
            <a href="mailto:support@shinebeauty.in" className="hover:underline">
              support@roopshree.in
            </a>
          </p>
          <p>
            <span className="font-semibold text-sky-600">Phone:</span>{" "}
            <a href="tel:+919876543210" className="hover:underline">
              +91 98765 43210
            </a>
          </p>
          <p>
            <span className="font-semibold text-sky-600">Address:</span> Roop
            Shree, Varanasi, Uttar Pradesh
          </p>

          <Link href="/support">
            <button className="mt-4 -sky-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:-sky-700 active:-sky-800 transition">
              Contact Support
            </button>
          </Link>
        </section>
      </main>
    </div>
  );
};

export default AboutUsPage;
