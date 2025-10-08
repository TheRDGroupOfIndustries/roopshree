"use client";
import React, { useState } from "react";
import { ArrowLeft, Trash2, X, Plus, Minus, Heart, Tag, ChevronRight } from "lucide-react";
import Image from "next/image";
interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  prePrice?: number;
  image: string;
  quantity: number;
}

interface RecommendedProduct {
  id: number;
  name: string;
   image: string;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Luxury Foundation",
      description: "Shade: Natural Beige",
      price: 2999,
      prePrice: 3999,
      image: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400&h=400&fit=crop",
      quantity: 1,
    },
    {
      id: 2,
      name: "Premium Lipstick",
      description: "Color: Ruby Red",
      price: 1499,
      prePrice: 1999,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop",
      quantity: 2,
    },
    {
      id: 3,
      name: "Eye Shadow Palette",
      description: "12 Shades Collection",
      price: 3499,
      prePrice: 4999,
      image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop",
      quantity: 1,
    },
    {
      id: 4,
      name: "Moisturizing Cream",
      description: "50ml Hydrating Formula",
      price: 2499,
      prePrice: 3499,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
      quantity: 1,
    },
  ]);

 

  const recommendedProducts: RecommendedProduct[] = [
    { id: 101, name: "Vitamin C Serum", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop" },
     { id: 103, name: "Nail Polish Kit",image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=400&h=400&fit=crop" },
    { id: 104, name: "Hair Serum", image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop" },
  ];

  const updateQuantity = (id: number, delta: number): void => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id: number): void => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const clearCart = (): void => {
    if (window.confirm("Are you sure you want to clear the cart?")) {
      setCartItems([]);
    }
  };
 
  const subtotal: number = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalSavings: number = cartItems.reduce(
    (acc, item) => acc + (item.prePrice ? (item.prePrice - item.price) * item.quantity : 0),
    0
  );
  const deliveryFee: number = 0;
  const total: number = subtotal ;

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

      {/* Main Content - Added padding bottom for bottom navbar + checkout button */}
      <div className="p-4 md:p-8 max-w-6xl mx-auto pb-48 sm:pb-40">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-xl text-gray-500 mb-4">Your cart is empty</p>
            <a href="/home" className="inline-block bg-amber-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-600 transition">
              Continue Shopping
            </a>
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
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-md hover:bg-red-50 transition-all"
                    aria-label="Remove item"
                  >
                    <X className="w-4 h-4 text-gray-700" />
                  </button>

                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%]" />

                  <div className="p-4 sm:p-6">
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        <Image fill src={item.image} alt={item.name} className="w-full h-full object-cover" >

                        </Image>
                        
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mb-2">{item.description}</p>

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

                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-gray-100 rounded-full">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4 text-gray-700" />
                            </button>
                            <span className="w-10 text-center font-semibold text-gray-800">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4 text-gray-700" />
                            </button>
                          </div>

                          <span className="text-sm text-gray-500">
                            Subtotal: ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button className="mt-4 w-full bg-gradient-to-r from-pink-50 to-red-50 text-red-600 px-4 py-2.5 rounded-xl hover:from-pink-100 hover:to-red-100 flex items-center justify-center gap-2 transition-all font-medium shadow-sm hover:shadow-md">
                      <Heart className="w-4 h-4" />
                      Move to Wishlist
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Section */}
            <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-6">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                Apply Promo Code
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Enter your promo code"
                   className="flex-1 px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <button
                  className="bg-amber-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-amber-700 transition-all font-semibold text-sm sm:text-base whitespace-nowrap"
                >
                  Apply
                </button>
              </div>
            
                <div className="mt-3 bg-green-50 border border-green-200 text-green-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-medium">
                    FIRST20 applied - 20 % off on first order
                  </span>
                  
                </div>
    
            </div>

            {/* Order Summary - Enhanced */}
            <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-6">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4 pb-3 border-b">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm sm:text-base text-gray-700">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base text-gray-700">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-green-600">Free Delivery</span>
                </div>
              
                  <div className="flex justify-between text-sm sm:text-base text-green-600 bg-green-50 -mx-2 sm:-mx-3 px-2 sm:px-3 py-2 rounded">
                    <span>Promo Discount 20%</span>
                    <span className="font-semibold">-₹ 20%</span>
                  </div>
              
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Total Amount</h3>
                    <span className="text-2xl sm:text-3xl font-bold text-amber-600">₹{total.toLocaleString()}</span>
                  </div>
                  {(totalSavings > 0) && (
                    <p className="text-xs sm:text-sm text-green-600 font-medium text-right">
                      You save ₹{(totalSavings ).toLocaleString()} on this order
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* You Might Also Like */}
            <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">You Might Also Like</h2>
              <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-2 px-2">
                {recommendedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-36 sm:w-40 md:w-48 bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all snap-start cursor-pointer group"
                  >
                    <div className="relative h-36 sm:h-40 md:h-48 bg-gray-200 overflow-hidden">
                      <Image                   
                        src={product.image}
                        fill
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
                        </Image>
                  
                    </div>
                    <div className="p-2.5 sm:p-3">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{product.name}</h3>
                       
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Fixed Checkout Footer - Positioned above 10vh bottom navbar */}
      {cartItems.length > 0 && (
        <div className="fixed left-0 right-0 bg-white shadow-2xl border-t border-gray-200 p-3 sm:p-4 z-40" style={{ bottom: '10vh' }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-center sm:text-left w-full sm:w-auto">
                <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700">Total:</h3>
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-600">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
                {(totalSavings > 0) && (
                  <p className="text-xs sm:text-sm text-green-600 font-medium">
                    You saved ₹{(totalSavings).toLocaleString()}
                  </p>
                )}
              </div>

              <button className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base md:text-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2">
                Proceed to Checkout
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;