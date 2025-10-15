"use client";
import React, { useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { Trash2 } from "lucide-react";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import CartItemCard from "@/Components/CartItemCard";
import TrendingCard from "@/Components/TrendingNow";
import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart as clearCartService,
  clearCart,
} from "@/services/cartService";
import LoadingSpinner from "@/Components/LoadingSpinner";
import { addToWishlist, removeFromWishlist } from "@/services/wishlistService";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthProvider";
import { getAllProducts } from "@/services/productService";
import { CgShoppingCart } from "react-icons/cg";
import { useRouter } from "next/navigation";
import TrendingCardSkeleton from "@/Components/TrendingCardSkeleton";
import { getAllAddresses } from "@/services/addressService";
import { createOrder, OrderProduct } from "@/services/orderService";
import SmallLoadingSpinner from "@/Components/SmallLoadingSpinner";
interface Product {
  id: string;
  title: string;
  productId: string;
  description?: string;
  details?: string;
  price: number;
  oldPrice?: number;
  images: string[];
  insideBox?: string[];
  exclusive?: number;
}

interface CartItem {
  id: string;
  quantity: number;
  color?: string;
  size?: string | null;
  product: Product;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [productLoading, setProductLoading] = useState(true);
  const [shuffledProducts, setShuffledProducts] = useState<any[]>([]);

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [processingOrder, setProcessingOrder] = useState(false);

  // Fetch cart items from API
  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      console.log("fetchCart: ", data);

      setCartItems(data.items || []);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
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

    fetchAddresses();
  }, []);

  const handleCheckout = async () => {
    if (processingOrder) return;
    if (!selectedAddress) {
      return toast.error("Please select a delivery address");
    }

    if (cartItems.length === 0) {
      return toast.error("Your cart is empty");
    }

    try {
      setProcessingOrder(true);

      const products: OrderProduct[] = cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        size: item.size || undefined,
        color: item.color || undefined,
      }));

      const orderData = {
        totalAmount,
        address: selectedAddress,
        paymentMode: "COD",
        products,
      };

      await createOrder(orderData);
      toast.success("Order placed successfully!");
      setCartItems([]);
      clearCart();
      refreshUser();
    } catch (error: any) {
      console.error("Checkout failed:", error);
      toast.error(error?.message || "Failed to place order");
    } finally {
      setProcessingOrder(false);
    }
  };

  // Update quantity
  const updateQuantity = async (id: string, delta: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + delta);
    setCartItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, quantity: newQuantity } : it))
    );

    try {
      await updateCartItem(id, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      fetchCart(); // fallback refresh if failed
    }
  };

  // Remove item
  const handleRemoveItem = async (id: string) => {
    try {
      await removeCartItem(id);
      setCartItems(cartItems.filter((item) => item.id !== id));
      refreshUser();
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  // Clear cart
  const handleClearCart = async () => {
    try {
      await clearCartService();
      setCartItems([]);
      refreshUser();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const handleMoveToWishlist = async (itemId: string) => {
    const item = cartItems.find((i) => i.id === itemId);
    if (!item) return;
    if (!user) return toast.error("Please login to manage wishlist");

    try {
      const wishlistExists = user.wishlist?.some(
        (w: any) => w.productId === item.product.id
      );

      if (wishlistExists) {
        await removeFromWishlist(item.product.id);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(item.product.id);
        toast.success("Added to wishlist");
      }

      refreshUser();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductLoading(true);
        const res = await getAllProducts();
        const shuffled = [...res].sort(() => Math.random() - 0.5);
        setShuffledProducts(shuffled);
      } catch (error) {
        console.log("Error fetching products:", error);
      } finally {
        setProductLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const totalSavings = cartItems.reduce(
    (acc, item) =>
      acc +
      (item.product.oldPrice
        ? (item.product.oldPrice - item.product.price) * item.quantity
        : 0),
    0
  );

  const deliveryFee = 99;
  const totalAmount = subtotal + deliveryFee - deliveryFee;

  if (loading) {
    return <LoadingSpinner message=" Loading your cart..." />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16 relative">
      {/* Navigation */}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl p-4 shadow-lg w-[80%] max-w-[300px] border border-gray-100">
            <h4 className="text-md font-semibold mb-2 text-gray-900 text-center">
              Clear Cart
            </h4>
            <p className="text-gray-600 mb-4 text-sm text-center">
              Are you sure you want to clear all items from the cart?
            </p>
            <div className="flex gap-2">
              <button
                className="flex-1 px-3 py-2 rounded bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
                onClick={() => {
                  setShowConfirm(false);
                  handleClearCart();
                }}
              >
                Yes
              </button>
              <button
                className="flex-1 px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium transition-colors"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 bg-white flex justify-between items-center px-4 py-2 shadow-sm z-20">
        <button
          aria-label="Back"
          className="text-gray-600 text-xl"
          onClick={() => router.back()}
        >
          <IoArrowBackOutline />
        </button>

        <h2 className="font-semibold text-lg flex-1 text-center">
          Shopping Cart
        </h2>

        {cartItems.length > 0 && (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full hover:bg-red-50 transition-colors"
            aria-label="Delete cart"
          >
            <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
          </button>
        )}
      </header>

      <div className="p-4 md:p-8 pb-32">
        <div className="max-w-6xl mx-auto">
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <CgShoppingCart
                size={48}
                className="mx-auto mb-4 text-gray-300"
              />
              <p className="text-xl font-semibold text-gray-900 mb-2">
                Your cart is empty
              </p>
              <p className="text-gray-500 mb-6">Add items to get started</p>
              <button
                onClick={() => router.push("/home")}
                className="bg-[var(--color-brand)] text-white font-medium py-2 px-6 rounded-lg transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
                {cartItems.map((item) => (
                  <CartItemCard
                    key={item.id}
                    id={item.id}
                    productId={item.productId}
                    name={item.product.title}
                    description={item.product.description || ""}
                    price={item.product.price}
                    prePrice={item.product.oldPrice}
                    image={item.product.images[0]}
                    quantity={item.quantity}
                    onRemove={handleRemoveItem}
                    onUpdateQuantity={updateQuantity}
                    onMoveToWishlist={handleMoveToWishlist}
                  />
                ))}
              </div>

              {/* Promo & Summary (same UI) */}
              {/* <div className="bg-gray-50 p-3 rounded-lg space-y-2 mb-2 shadow-sm">
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
              </div> */}
              {/* Selected Address Section */}
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

                {/* <div className="flex justify-between text-green-600 text-sm font-medium">
                  <span>Promo Discount (FIRST20)</span>
                  <span className="font-semibold">
                    -₹{promoDiscount.toLocaleString()}
                  </span>
                </div> */}

                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-gray-800 font-bold">Total Amount</span>
                  <span className="text-amber-600 text-lg font-bold">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>

                <p className="text-green-600 text-xs mt-1 font-medium">
                  You saved ₹{totalSavings}!
                </p>
              </div>

              {/* Trending Products */}
              <div className="bg-gray-50 p-3 rounded-lg space-y-2 mb-2 shadow-sm">
                <div className="mb-4">
                  <h3 className="font-medium text-sm text-gray-900">
                    You might also like
                  </h3>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {productLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <TrendingCardSkeleton key={i} />
                      ))
                    : // Show actual products
                      shuffledProducts.map((product) => (
                        <TrendingCard
                          key={product.id}
                          id={product.id}
                          name={product.title}
                          price={product.price}
                          oldPrice={product.oldPrice}
                          image={
                            product.images?.[0] ||
                            "/images/placeholder_image.png"
                          }
                        />
                      ))}
                </div>
              </div>

              {processingOrder && (
                <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center backdrop-blur-sm bg-black/30">
                  <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center gap-3 border border-gray-200">
                    <SmallLoadingSpinner />
                    <p className="text-gray-700 font-medium text-sm">
                      Processing your order...
                    </p>
                  </div>
                </div>
              )}

              {/* Checkout Button */}
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

                  <button
                    onClick={handleCheckout}
                    disabled={processingOrder}
                    className={`w-full md:w-auto bg-gradient-to-r from-[var(--color-brand-hover)] to-[var(--color-brand)] text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg duration-200 ${
                      processingOrder ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    {processingOrder ? (
                      <p className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                        <SmallLoadingSpinner /> Processing...
                      </p>
                    ) : (
                      <>
                        <MdOutlineShoppingCartCheckout className="w-5 h-5" />
                        Proceed to Checkout
                      </>
                    )}
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