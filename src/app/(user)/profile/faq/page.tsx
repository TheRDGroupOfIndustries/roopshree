"use client";

import React, { useState } from "react";
import { HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How can I track my order?",
    answer: "You can track your order from the 'Orders' section in your profile. Click on 'Track' next to your order to see the latest updates.",
  },
  {
    question: "What is your return policy?",
    answer: "You can return most items within 15 days of delivery. Please make sure the items are unused and in original packaging.",
  },
  {
    question: "How can I redeem my rewards?",
    answer: "Go to the 'Rewards' section in your profile. You can apply available reward points during checkout.",
  },
  {
    question: "How do I change my delivery address?",
    answer: "Go to 'Delivery Addresses' under Account Settings and update or add a new address.",
  },
];

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg">
            <HelpCircle className="w-6 h-6 text-gray-700" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">FAQ</h1>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:shadow-md transition"
            >
              <button
                className="flex justify-between w-full text-left items-center"
                onClick={() => toggleIndex(index)}
              >
                <span className="text-gray-800 font-medium">{item.question}</span>
                <span className="text-gray-500">{openIndex === index ? "−" : "+"}</span>
              </button>
              {openIndex === index && (
                <p className="mt-2 text-gray-600 text-sm">{item.answer}</p>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          If you have further questions, please contact our support team.
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
