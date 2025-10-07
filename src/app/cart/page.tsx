"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Trash2, X, Plus, Minus, Heart } from "lucide-react";
import { IoArrowBackOutline } from "react-icons/io5";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import CartItemCard from "@/Components/CartItemCard";
import TrendingCard from "@/Components/TrendingNow";

interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  prePrice?: number;
  image: string;
  quantity: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Luxury Foundation",
      description: "Shade: Natural Beige",
      price: 2999,
      prePrice: 3999,
      image:
        "https://c8.alamy.com/comp/2HMD622/cosmetic-foundation-cream-bottle-luxury-makeup-product-template-glossy-airless-bottle-for-liquid-powder-realistic-moisturizer-dispenser-tube-premi-2HMD622.jpg",
      quantity: 1,
    },
    {
      id: 2,
      name: "Premium Lipstick",
      description: "Color: Ruby Red",
      price: 1499,
      prePrice: 1999,
      image:
        "https://atlas-content-cdn.pixelsquid.com/stock-images/white-lipstick-opened-mr1aQn0-600.jpg",
      quantity: 2,
    },
    {
      id: 3,
      name: "Eye Shadow Palette",
      description: "12 Shades Collection",
      price: 3499,
      prePrice: 4999,
      image:
        "https://img.freepik.com/premium-photo/close-up-colorful-eyeshadow-palette-isolated-white-background-open-makeup-case-trendy-pastel-bright-colors-visage_105596-6860.jpg",
      quantity: 1,
    },
    {
      id: 4,
      name: "Moisturizing Cream",
      description: "50ml Hydrating Formula",
      price: 2499,
      prePrice: 3499,
      image:
        "https://thumbs.dreamstime.com/b/open-jar-face-cream-isolated-white-background-ideal-skincare-beauty-cosmetics-product-photography-design-356477718.jpg",
      quantity: 1,
    },
  ]);

  const trendingProducts = [
    {
      id: 1,
      name: "Moisturizer",
      price: "₹799",
      image: "/images/image.png",
    },
    {
      id: 2,
      name: "Lipstick",
      price: "₹499",
      image: "/images/image.png",
    },
    {
      id: 3,
      name: "Perfume",
      price: "₹1299",
      image: "/images/image.png",
    },
  ];

  const updateQuantity = (id: number, delta: number): void => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const clearCart = (): void => {
    if (window.confirm("Are you sure you want to clear the cart?")) {
      setCartItems([]);
    }
  };

  // Dynamic Calculations
  const subtotal: number = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalSavings: number = cartItems.reduce(
    (acc, item) =>
      acc + (item.prePrice ? (item.prePrice - item.price) * item.quantity : 0),
    0
  );

  const deliveryFee: number = 99;
  const promoDiscount: number = Math.floor(subtotal * 0.2); // assuming 20% promo applied

  const totalAmount: number =
    subtotal + deliveryFee - deliveryFee - promoDiscount; // free delivery applied

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16 relative">
      {/* Navigation */}
      <header className="sticky top-0 bg-white flex justify-between items-center px-4 py-2 shadow-sm z-20">
        <button
          aria-label="Back"
          className="text-gray-600 text-xl"
          onClick={() => window.history.back()}
        >
          <IoArrowBackOutline />
        </button>

        <h2 className="font-semibold text-lg flex-1 text-center">
          Shopping Cart
        </h2>

        <button
          onClick={clearCart}
          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full hover:bg-red-50 transition-colors"
          aria-label="Delete cart"
        >
          <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />{" "}
        </button>
      </header>

      <div className="p-4 md:p-8 pb-32">
        <div className="max-w-6xl mx-auto">
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <p className="text-xl text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              {/* Cart Items Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
                {cartItems.map((item) => (
                  <CartItemCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    prePrice={item.prePrice}
                    image={item.image}
                    quantity={item.quantity}
                    onRemove={(id) =>
                      setCartItems(cartItems.filter((cart) => cart.id !== id))
                    }
                    onUpdateQuantity={updateQuantity}
                  />
                ))}
              </div>

              {/* Apply Promo Code */}
              <div className="bg-gray-50 p-3 rounded-lg space-y-2 mb-2 shadow-sm">
                <label className="block text-gray-700 text-sm font-medium">
                  Apply Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="flex-1 border border-gray-300 rounded-xl px-3 py-1 focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]"
                  />
                  <button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white px-4 py-2 rounded-xl font-medium">
                    Apply
                  </button>
                </div>
                <p className="text-green-600 text-xs mt-1 rounded-xl bg-green-200/50 text-center px-2 py-1 flex justify-start items-center gap-3 font-medium">
                  <FaCheckCircle className="ml-2" />
                  FIRST20 applied - 20% off on first order
                </p>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-3 rounded-lg space-y-2 mb-2 shadow-sm">
                <h3 className="text-gray-800 font-semibold text-sm">
                  Order Summary
                </h3>

                <div className="flex justify-between text-gray-500 text-sm font-medium">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold text-black">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-gray-500 text-sm font-medium">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">₹{deliveryFee}</span>
                </div>

                <div className="flex justify-between text-green-600 text-sm font-medium">
                  <span>Free Delivery</span>
                  <span className="font-semibold">-₹{deliveryFee}</span>
                </div>

                <div className="flex justify-between text-green-600 text-sm font-medium">
                  <span>Promo Discount (FIRST20)</span>
                  <span className="font-semibold">
                    -₹{promoDiscount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-gray-800 font-bold">Total Amount</span>
                  <span className="text-amber-600 text-lg font-bold">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>

                <p className="text-green-600 text-xs mt-1 font-medium">
                  You saved ₹{totalSavings + promoDiscount}!
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg space-y-2 mb-2 shadow-sm">
                {/* Header */}
                <div className="mb-4">
                  <h3 className="font-medium text-sm text-gray-900">
                    You might also like
                  </h3>
                </div>

                {/* Horizontal Scrollable Container */}
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {trendingProducts.map((product) => (
                    <TrendingCard key={product.id} {...product} />
                  ))}
                </div>
              </div>

              {/* Total and Checkout - Fixed at Bottom */}
              <div className="fixed bottom-14 left-0 w-full bg-white shadow-2xl border-gray-200 p-3 z-30">
                <div className="flex flex-col md:flex-row items-center justify-start gap-3 md:gap-6">
                  <div className="flex w-full md:w-auto justify-between items-center gap-4 md:gap-6">
                    <div className="flex flex-col items-start">
                      <h3 className="text-sm font-semibold text-gray-700">
                        Total Amount:
                      </h3>
                      <span className="text-xl font-bold text-[var(--color-brand)]">
                        ₹{totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-col items-start md:items-end">
                      <span className="text-sm text-gray-500 font-medium">
                        Deliver in
                      </span>
                      <span className="text-sm font-semibold">2 hr</span>
                    </div>
                  </div>

                  <button className="w-full md:w-auto bg-gradient-to-r from-[var(--color-brand-hover)] to-[var(--color-brand)] text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg duration-200">
                    <MdOutlineShoppingCartCheckout className="w-5 h-5" />
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
