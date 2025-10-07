"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft, Trash2, X, Plus, Minus, Heart } from "lucide-react";

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

  const total: number = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalSavings: number = cartItems.reduce(
    (acc, item) =>
      acc + (item.prePrice ? (item.prePrice - item.price) * item.quantity : 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="w-full px-4 py-4 sm:px-6 md:px-8 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <a
            href="/home"
            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back to home"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </a>

          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
            Shopping Cart
          </h2>

          <button
            onClick={clearCart}
            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full hover:bg-red-50 transition-colors"
            aria-label="Delete cart"
          >
            <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
          </button>
        </div>
      </nav>

      <div className="p-4 md:p-8 pb-32">
        <div className="max-w-6xl mx-auto">
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <p className="text-xl text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              {/* Cart Items Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    {/* Remove Button - Top Right */}
                    <button
                      className="absolute top-3 right-3 z-10 w-8 h-8  text-black rounded-full flex items-center justify-center "
                      aria-label="Remove item"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%]" />

                    <div className="p-4 sm:p-6">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image
                            src={item.image}
                            fill
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 mb-2">
                            {item.description}
                          </p>

                          {/* Price */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg sm:text-xl font-bold text-amber-600">
                              ₹{item.price.toLocaleString()}
                            </span>
                            {item.prePrice && (
                              <span className="text-sm text-gray-400 line-through">
                                ₹{item.prePrice.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center bg-gray-100 rounded-full">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-4 h-4 text-gray-700" />
                              </button>
                              <span className="w-10 text-center font-semibold text-gray-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-4 h-4 text-gray-700" />
                              </button>
                            </div>

                            <span className="text-sm text-gray-500">
                              Subtotal: ₹
                              {(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Move to Wishlist Button */}
                      <button className="mt-4 w-full bg-gradient-to-r from-pink-50 to-red-50 text-red-600 px-4 py-2.5 rounded-xl hover:from-pink-100 hover:to-red-100 flex items-center justify-center gap-2 transition-all font-medium shadow-sm hover:shadow-md">
                        <Heart className="w-4 h-4" />
                        Move to Wishlist
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total and Checkout - Fixed at Bottom */}
              <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-200 p-4 md:p-6 z-40">
                <div className="max-w-6xl mx-auto">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-center sm:text-left">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
                          Total:
                        </h3>
                        <span className="text-2xl sm:text-3xl font-bold text-amber-600">
                          ₹{total.toLocaleString()}
                        </span>
                      </div>
                      {totalSavings > 0 && (
                        <p className="text-sm text-green-600 font-medium">
                          You saved ₹{totalSavings.toLocaleString()}
                        </p>
                      )}
                    </div>

                    <button className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl hover:scale-105">
                      Proceed to Checkout
                    </button>
                  </div>
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
