// "use client";

// import React, { useState } from "react";
// import { HelpCircle, ArrowLeft, ShoppingCart, ChevronDown, ChevronUp } from "lucide-react"; // Added missing imports
// import Link from "next/link";

// // --- Interfaces & Data (kept the same) ---
// interface FAQItem {
//   question: string;
//   answer: string;
// }

// const faqData: FAQItem[] = [
//   {
//     question: "How can I track my order?",
//     answer: "You can track your order from the 'Orders' section in your profile. Click on 'Track' next to your order to see the latest updates. Note that tracking may take up to 24 hours to update after shipping.",
//   },
//   {
//     question: "What is your return policy?",
//     answer: "You can return most items within 15 days of delivery, provided they are unused, undamaged, and in their original packaging with all tags intact. Customized items are non-refundable.",
//   },
//   {
//     question: "How can I redeem my rewards?",
//     answer: "Go to the 'Rewards' section in your profile to view your balance. You can apply available reward points as a discount option during the final step of checkout.",
//   },
//   {
//     question: "How do I change my delivery address?",
//     answer: "Go to 'Account Settings' -> 'Delivery Addresses'. You can update an existing address or add a new one before placing your order. Changes cannot be made after an order is shipped.",
//   },
//   {
//     question: "What payment methods do you accept?",
//     answer: "We accept Visa, MasterCard, American Express, Net Banking, UPI, and Cash on Delivery (COD) for most products.",
//   },
// ];

// // --- Header Component ---
// const Header = () => (
//   <header className="sticky top-0 bg-white flex justify-between items-center px-4 sm:px-6 py-3 shadow-lg z-50 border-b border-gray-100">
//     <button
//       className="text-gray-700 hover:text-sky-600 transition-colors p-2 hover:bg-sky-50 rounded-full"
//       onClick={() => window.history.back()}
//       aria-label="Go back"
//     >
//       <ArrowLeft size={24} />
//     </button>
//     <h2 className="font-bold text-xl sm:text-2xl flex-1 text-center text-gray-800">
//       Help Center
//     </h2>
//     <Link href="/my-cart" aria-label="View shopping cart">
//       <button className="relative text-gray-700 hover:text-sky-600 p-2 hover:bg-sky-50 rounded-full transition-colors">
//         <ShoppingCart size={24} />
//         <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
//           2
//         </span>
//       </button>
//     </Link>
//   </header>
// );

// // --- Main FAQ Component ---
// const FAQPage: React.FC = () => {
//   const [openIndex, setOpenIndex] = useState<number | null>(null);

//   const toggleIndex = (index: number) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* 1. Sticky Header */}
//       <Header />

//       {/* 2. Main Content Wrapper */}
//       <div className="px-4 sm:px-6 py-8 flex justify-center">
//         <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl p-8 md:p-10">
          
//           {/* Main Title Block */}
//           <div className="flex items-center gap-4 mb-8">
//             <div className="p-3 bg-sky-100 rounded-xl">
//               <HelpCircle className="text-sky-600 w-7 h-7" />
//             </div>
//             <h1 className="text-3xl font-bold text-gray-800">
//               Frequently Asked Questions
//             </h1>
//           </div>
//           <p className="text-gray-600 text-lg mb-8 pb-6 border-b border-gray-100 leading-relaxed">
//             Find quick answers to the most common questions about ordering, delivery, and returns.
//           </p>


//           {/* Enhanced FAQ List (Accordion) */}
//           <div className="space-y-4">
//             {faqData.map((item, index) => {
//               const isOpen = openIndex === index;
//               return (
//                 <div
//                   key={index}
//                   className={`border ${isOpen ? 'border-sky-500 bg-sky-50 shadow-md' : 'border-gray-200 bg-white hover:border-sky-300'} rounded-xl transition-all duration-300`}
//                 >
//                   <button
//                     className="flex justify-between w-full text-left items-center p-5 focus:outline-none"
//                     onClick={() => toggleIndex(index)}
//                     aria-expanded={isOpen}
//                     aria-controls={`faq-answer-${index}`}
//                   >
//                     <span className={`text-lg font-semibold ${isOpen ? 'text-sky-700' : 'text-gray-800'}`}>
//                       {item.question}
//                     </span>
//                     <span className="ml-4 transition-transform duration-300">
//                       {isOpen ? <ChevronUp size={20} className="text-sky-600" /> : <ChevronDown size={20} className="text-gray-500" />}
//                     </span>
//                   </button>

//                   <div
//                     id={`faq-answer-${index}`}
//                     className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
//                       isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
//                     }`}
//                   >
//                     <p className="mt-0 p-5 pt-0 text-gray-700 text-base border-t border-gray-200">
//                       {item.answer}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Footer CTA */}
//           <div className="mt-10 pt-6 border-t border-gray-100 text-center">
//             <h3 className="text-xl font-bold text-gray-800 mb-2">Still Need Help?</h3>
//             <p className="text-gray-600 mb-4">
//               If your question isn't answered here, feel free to contact our dedicated support team.
//             </p>
//             <Link href="/support">
//               <button className="inline-flex items-center bg-sky-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-sky-700 transition-colors shadow-lg shadow-sky-300/50">
//                 Contact Support
//               </button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FAQPage;



"use client";

import React, { useState } from "react";
import { HelpCircle, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How can I track my order?",
    answer:
      "Go to 'My Orders' in your profile. Tap 'Track' to see your shipment status. Tracking updates may take up to 24 hours after dispatch.",
  },
  {
    question: "What is your return policy?",
    answer:
      "Most items can be returned within 15 days if unused and in original packaging. Customized products are non-refundable.",
  },
  {
    question: "How can I redeem my rewards?",
    answer:
      "Open the 'Rewards' section in your account to view your balance. Apply your points at checkout for instant discounts.",
  },
  {
    question: "How do I change my delivery address?",
    answer:
      "Go to 'Account Settings' → 'Delivery Addresses' to add or edit an address before placing a new order.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept UPI, Net Banking, major credit/debit cards, and Cash on Delivery (COD) for most items.",
  },
];

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleIndex = (index: number) => setOpenIndex(openIndex === index ? null : index);

  return (
    <div className="min-h-screen   flex flex-col pb-20">
      {/* Header */}
      <header className="sticky top-0   flex items-center px-4 py-3 border-b border-gray-100 z-50 shadow-md">
        <button
          onClick={() => window.history.back()}
          className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition"
        >
          <ArrowLeft className="w-5 h-5  " />
        </button>
        <h2 className="flex-1 text-center font-semibold text-base  ">
          Help Center
        </h2>
        <div className="w-7" />
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2  rounded-lg">
            <HelpCircle className="w-5 h-5 text-sky-600" />
          </div>
          <h1 className="text-lg font-bold  ">
            FAQs
          </h1>
        </div>

        <p className=" text-sm mb-5">
          Quick answers about orders, delivery, and returns.
        </p>

        {/* FAQ Accordion */}
        <div className="space-y-2">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-lg   transition-all ${
                  isOpen
                    ? "border-orange-300 "
                    : "  "
                }`}
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className="flex justify-between w-full items-center text-left p-3   transition"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`text-sm font-medium ${
                      isOpen ? "text-orange-700" : " "
                    }`}
                  >
                    {item.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp size={18} className="text-sky-600" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-500" />
                  )}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <p className="text-xs  px-3 pb-3 leading-relaxed border-t  ">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-8 text-center border-t   pt-5">
          <p className="text-sm   mb-3">
            Still need help? Contact our support team.
          </p>
          <Link href="/profile/support">
            <button className="px-5 py-2 text-amber-700  text-sm font-medium rounded-full hover:bg-sky-700 active:bg-sky-800 transition">
              Contact Support
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default FAQPage;
