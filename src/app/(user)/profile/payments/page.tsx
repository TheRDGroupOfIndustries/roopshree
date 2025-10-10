"use client";
import Image from "next/image";
import React from "react";
import { CreditCard, Plus, ArrowLeft, ShoppingCart, Trash2, Pencil } from "lucide-react";
import Link from "next/link"; // Need Link for cart navigation

// Mock data structure for better component design
interface Card {
  id: string;
  type: 'Visa' | 'MasterCard' | 'Amex';
  last4: string;
  holder: string;
  expiry: string;
  imageSrc: string;
  isPrimary: boolean;
}

const mockCards: Card[] = [
  {
    id: '1',
    type: 'Visa',
    last4: '3456',
    holder: 'Priya Sharma',
    expiry: '06/28',
    imageSrc: '/visa.png',
    isPrimary: true,
  },
  {
    id: '2',
    type: 'MasterCard',
    last4: '7890',
    holder: 'Priya Sharma',
    expiry: '02/26',
    imageSrc: '/mastercard.png',
    isPrimary: false,
  },
];

// --- Card Component for Clean Layout ---
const SavedCard: React.FC<{ card: Card }> = ({ card }) => {
  return (
    <div
      className={`relative p-5 border-2 rounded-xl shadow-lg transition-all duration-300 ease-in-out ${
        card.isPrimary
          ? "border-sky-500 bg-sky-50 shadow-sky-100"
          : "border-gray-200 bg-white hover:border-sky-300"
      }`}
    >
      {/* Card Header: Type, Last 4, and Expiry */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Next/Image fix: Use a fixed size wrapper */}
          <div className="relative w-10 h-6">
            {/* NOTE: You need to ensure these images exist in your public folder */}
            <Image
            src="https://www.pngplay.com/wp-content/uploads/12/Visa-Card-Logo-Background-PNG-Image.png" 
             alt={card.type}
            layout="fill"
            objectFit="contain"
            >
            </Image>
          </div>
          <p className="text-lg font-bold text-gray-800">
            {card.type} •••• {card.last4}
          </p>
        </div>
        
        {card.isPrimary && (
          <span className="text-xs font-semibold px-3 py-1 bg-sky-600 text-white rounded-full">
            Primary
          </span>
        )}
      </div>

      {/* Card Details and Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end">
        <div>
          <p className="text-sm text-gray-600">Card Holder: {card.holder}</p>
          <p className="text-sm text-gray-600 mt-1">Expires: {card.expiry}</p>
        </div>

        <div className="flex gap-4 mt-3 sm:mt-0 pt-3 border-t sm:border-t-0">
          <button className="flex items-center text-sm font-medium text-sky-600 hover:text-sky-800 transition-colors">
            <Pencil size={14} className="mr-1" /> Edit
          </button>
          <button className="flex items-center text-sm font-medium text-red-600 hover:text-red-800 transition-colors">
            <Trash2 size={14} className="mr-1" /> Remove
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const PaymentsPage: React.FC = () => {
  const cards = mockCards; // Using mock data for rendering

  // Header Component (Moved out for clarity and proper placement)
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
        My Payment Methods
      </h2>
      <Link href="/my-cart" aria-label="View shopping cart">
        <button className="relative text-gray-700 hover:text-sky-600 p-2 hover:bg-sky-50 rounded-full transition-colors">
          <ShoppingCart size={24} />
          {/* Cart item count - hardcoded for example */}
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
            2
          </span>
        </button>
      </Link>
    </header>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Sticky Header */}
      <Header />

      {/* 2. Main Content Wrapper */}
      <div className="px-4 sm:px-6 py-8 flex justify-center">
        <div className="w-full max-w-3xl bg-white shadow-2xl rounded-xl p-6 md:p-8">
          
          {/* Main Title and Add Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-sky-100 rounded-lg">
                <CreditCard className="text-sky-600 w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                Saved Cards
              </h1>
            </div>
            
            <button className="flex items-center gap-2 text-md bg-sky-600 text-white px-5 py-2.5 rounded-full hover:bg-sky-700 transition-all shadow-lg mt-4 sm:mt-0">
              <Plus className="w-5 h-5" /> Add New Card
            </button>
          </div>

          {/* Saved Cards List */}
          <div className="space-y-6">
            {cards.length > 0 ? (
              cards.map((card) => <SavedCard key={card.id} card={card} />)
            ) : (
              <div className="text-center py-10 text-gray-500 border-dashed border-2 border-gray-300 rounded-lg">
                <CreditCard className="mx-auto mb-3 text-gray-400" size={30} />
                <p className="font-medium">No payment methods saved</p>
                <p className="text-sm mt-1">Click "Add New Card" to save a method for faster checkout.</p>
              </div>
            )}
          </div>

          {/* Info Text */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            All card information is encrypted and securely stored.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;