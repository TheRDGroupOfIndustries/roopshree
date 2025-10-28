"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GoShareAndroid } from "react-icons/go";
import { IoArrowBackOutline } from "react-icons/io5";
import CartItemCard from "./CartItemCard";
import Image from "next/image";
import {
  BanknoteIcon,
  CreditCardIcon,
  LandmarkIcon,
  Minus,
  Plus,
  ZapIcon,
} from "lucide-react";
import { getAllAddresses } from "@/services/addressService";
import toast from "react-hot-toast";
import PageLoader from "./PageLoader";

// / Array of available payment methods
const paymentMethods = [
  {
    id: "COD",
    name: "Cash on Delivery",
    icon: BanknoteIcon,
    description: "Pay at your doorstep (₹99 extra processing fee applies)",
  },
  //   {
  //     id: "CARD",
  //     name: "Credit / Debit Card",
  //     icon: CreditCardIcon,
  //     description: "Visa, MasterCard, RuPay & more",
  //   },
  //   {
  //     id: "UPI",
  //     name: "UPI / Google Pay / PhonePe",
  //     icon: ZapIcon,
  //     description: "Instant payment via UPI apps",
  //   },
  //   {
  //     id: "NETBANKING",
  //     name: "Net Banking",
  //     icon: LandmarkIcon,
  //     description: "All Indian banks accepted",
  //   },
];

// Helper component for a single payment option card
const PaymentOption = ({
  method,
  selected,
  onSelect,
}: {
  method: any;
  selected: string;
  onSelect: (id: string) => void;
}) => {
  const Icon = method.icon;
  const isSelected = selected === method.id;

  return (
    <div
      className={`
        flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 mb-3
        ${
          isSelected
            ? "border-indigo-600 bg-indigo-50 shadow-md"
            : "border-gray-200 bg-white hover:border-gray-400"
        }
      `}
      onClick={() => onSelect(method.id)}
    >
      <div className="flex-shrink-0 w-6 h-6 mr-4">
        <Icon className={isSelected ? "text-indigo-600" : "text-gray-500"} />
      </div>
      <div className="flex-grow">
        <div
          className={`font-semibold text-sm ${
            isSelected ? "text-indigo-900" : "text-gray-800"
          }`}
        >
          {method.name}
        </div>
        <p className="text-xs text-gray-500 mt-1">{method.description}</p>
      </div>
      <div
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ml-4 ${
          isSelected ? "border-indigo-600" : "border-gray-400"
        }`}
      >
        {isSelected && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
      </div>
    </div>
  );
};

export default function Checkout({ productId }: { productId: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(useState<number>(1));
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const [selectedMethod, setSelectedMethod] = useState("COD");
  const [isProcessing, setIsProcessing] = useState(false);
  const checkoutQtyKey = (id: string) => `checkoutQty_${id}`;
  // Calculate subtotal
  const subtotal = product?.price * quantity;
  // Only show delivery fee if it applies
  const deliveryFee = 0; // If free, otherwise 99
  const total = subtotal + deliveryFee;

  // Simulates the payment process
  const handlePlaceOrder = async () => {
    if (isProcessing) return;
    if (!selectedAddress) {
      toast.error("Please select or add a delivery address");
      return;
    }

    setIsProcessing(true);

    const order = {
      totalAmount: total,
      address: selectedAddress,
      paymentMode: selectedMethod,
      products: [
        {
          productId,
          quantity,
        },
      ],
    };

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });
      if (!res.ok) {
        toast.error("Order failed!");
        return;
      }
      const data = await res.json();
      // console.log("handlePlaceOrder",data);
      sessionStorage.setItem(
        "orderData",
        JSON.stringify({
          orderId: data[0].id,
          orderDate: data[0].createdAt,
          paymentMethod: data[0].paymentMode,
          orderAmount: data[0].totalAmount,
        })
      );
      router.push(`/checkout/${productId}/success`);
    } catch (error) {
      toast.error("Order failed!");
      console.log(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const updateQuantity = (updater: (prev: number) => number) => {
    setQuantity((prev) => {
      const next = updater(prev);
      try {
        sessionStorage.setItem(checkoutQtyKey(productId), String(next));
      } catch (e) {}
      return next;
    });
  };

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(checkoutQtyKey(productId));
      if (saved) {
        const n = Number(saved);
        if (!Number.isNaN(n) && n > 0) setQuantity(n);
      }
    } catch (err) {
      // ignore (sessionStorage might be unavailable in some envs)
      console.warn("sessionStorage read failed", err);
    }
  }, [productId]);
  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${productId}`);
      const data = await res.json();
      // console.log(data);
      setProduct(data);
    } catch (error) {
      console.log(error);
    }
  };
  function handshare(): void {
    if (navigator.share) {
      navigator.share({
        title: "Checkout my orders",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Product link copied to clipboard!");
    }
  }
  const fetchAddresses = async () => {
    try {
      const res = await getAllAddresses();
      setAddresses(res || []);
      if (res && res.length > 0) {
        setSelectedAddress(res[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  };
  useEffect(() => {
    fetchProduct();
    fetchAddresses();
  }, []);

  return (
    <div className="bg-white text-black">
      <header
        className="sticky top-0 bg-white flex justify-between items-center px-4 py-3 shadow-sm z-10"
        style={{ boxShadow: "0 2px 4px -1px rgba(0,0,0,0.1)" }}
      >
        {/* Back Button */}
        <button
          aria-label="Back"
          className="text-gray-600 text-xl flex-shrink-0"
          onClick={() => router.back()}
        >
          <IoArrowBackOutline />
        </button>

        {/* Title */}
        <h2 className="font-semibold text-black text-lg text-center flex-1">
          Checkout
        </h2>

        {/* Right Icons */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          {/* Share Button */}
          <button
            aria-label="Share"
            className="text-gray-600 text-xl hover:text-orange-500"
            onClick={handshare}
          >
            <GoShareAndroid />
          </button>

          {/* Cart Button */}
          <div className="relative">
            {/* <button
              aria-label="View cart"
              className="text-gray-600 text-xl hover:text-[var(--color-brand-hover)]"
            >
              <FiShoppingCart />
            </button>

            {product.cartQuantity > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center 
                  text-[10px] font-bold text-white bg-[var(--color-brand)] rounded-full 
                  w-[16px] h-[16px]"
              >
                {product.cartQuantity}
              </span>
            )} */}
          </div>
        </div>
      </header>

      {!product ? (
        <PageLoader />
      ) : (
        <>
          <div className="p-4 md:p-8 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
              {/* product  */}
              <div className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%]" />

                <div className="p-3 sm:p-4">
                  <div className="flex gap-3">
                    {/* Product Image */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <Image
                        src={product.images[0]}
                        fill
                        alt={product.name || "Product Image"}
                        sizes="(max-width: 768px) 64px, 128px"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-1 truncate">
                          {product.description}
                        </p>

                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-base font-bold text-[var(--color-brand)]">
                            ₹{product.price.toLocaleString()}
                          </span>
                          {product.prePrice && (
                            <span className="text-xs text-gray-400 line-through">
                              ₹{product.prePrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Wishlist */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity((q) => Math.max(1, q - 1))
                            }
                            className={`w-6 h-6 flex items-center justify-center border rounded-full transition-colors ${
                              quantity === 1
                                ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-100"
                                : "border-gray-300 hover:bg-gray-200 text-gray-700"
                            }`}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3 text-gray-700" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-gray-800">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity((q) => q + 1)}
                            className="w-6 h-6 flex items-center justify-center border border-gray-300 hover:bg-gray-200 rounded-full transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3 text-gray-700" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Select Address */}
              <div className="bg-white shadow-sm rounded-xl p-3 mb-3 border border-gray-100">
                <h3 className="text-md font-semibold mb-2">Delivery Address</h3>

                {addresses.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr.id)}
                        className={`p-2 border rounded-lg cursor-pointer transition-all text-xs ${
                          selectedAddress === addr.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex flex-col">
                          <p className="font-medium text-gray-800">
                            {addr.name}
                          </p>
                          <p className="text-gray-600 mt-0.5">
                            {addr.address}, {addr.city}, {addr.state}
                          </p>
                          <p className="text-gray-600 mt-0.5">
                            {addr.country === "IN" ? "India" : addr.country}
                          </p>

                          {selectedAddress === addr.id && (
                            <span className="text-blue-600 font-medium mt-1">
                              ✓ Selected
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 space-y-2">
                    <p className="text-xs text-gray-400 text-center">
                      No saved addresses
                    </p>
                    <button
                      onClick={() => router.push("/profile/addresses")}
                      className="bg-[var(--color-brand)] text-white text-xs px-3 py-1.5 rounded-md "
                    >
                      Add Address
                    </button>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-3 rounded-lg space-y-2 mb-2 shadow-sm">
                <h3 className="text-gray-800 font-semibold text-sm">
                  Order Summary
                </h3>

                <div className="flex justify-between text-gray-500 text-sm font-medium">
                  <span>Subtotal ({quantity} items)</span>
                  <span className="font-semibold text-black">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>

                {deliveryFee > 0 && (
                  <div className="flex justify-between text-gray-500 text-sm font-medium">
                    <span>Delivery Fee</span>
                    <span className="font-semibold">₹{deliveryFee}</span>
                  </div>
                )}
                {deliveryFee === 0 && (
                  <div className="flex justify-between text-green-600 text-sm font-medium">
                    <span>Free Delivery</span>
                    <span className="font-semibold">-₹99</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-gray-800 font-bold">Total Amount</span>
                  <span className="text-amber-600 text-lg font-bold">
                    ₹{total.toLocaleString()}
                  </span>
                </div>

                <p className="text-green-600 text-xs mt-1 font-medium">
                  You saved ₹0!
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-lg ">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Payment Method
                </h2>

                {paymentMethods.map((method) => (
                  <PaymentOption
                    key={method.id}
                    method={method}
                    selected={selectedMethod}
                    onSelect={setSelectedMethod}
                  />
                ))}
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className={`w-full py-4 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg ${
                  isProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-amber-600 hover:bg-amber-700 active:scale-[0.98]"
                } `}
              >
                {isProcessing
                  ? "Processing..."
                  : `PLACE ORDER (Pay ₹${total.toLocaleString()} with ${selectedMethod})`}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
