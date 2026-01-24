"use client";
import { useEffect, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { IoArrowBackOutline, IoStarSharp } from "react-icons/io5";
import { RiTruckLine } from "react-icons/ri";
import { GoShareAndroid } from "react-icons/go";
import { useParams, useRouter } from "next/navigation";
import { getProductById } from "@/services/productService";
import ProductImageCarousel from "@/Components/ProductImageCarousel";
import { addToCart } from "@/services/cartService";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  MdOutlineAddShoppingCart,
  MdShoppingCartCheckout,
} from "react-icons/md";
import { LuShoppingBag } from "react-icons/lu";
import { useAuth } from "@/context/AuthProvider";
import { addToWishlist, removeFromWishlist } from "@/services/wishlistService";
import { getReviews, addReview } from "@/services/reviewService";
import Image from "next/image";
import ProductDetailsSkeleton from "@/Components/ProductDetailsSkeleton";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    profileImage?: string;
  };
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice: number;
  stock: number;
  category?: string;
  insideBox: string[];
  cartQuantity: number;
  images: string[];
  deliveryInfo: string;
  ingredients: string[];
  reviews: Review[];
  colour?: string[];
  size?: string[];
  isSpotlight?: boolean;
}

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [isInCart, setIsInCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedShade, setSelectedShade] = useState<number | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false); 
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  // Calculate average rating
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length ||
    0;

  const discountPercent =
    product && product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100
        )
      : 0;

  // Check if product is out of stock
  const isOutOfStock = product ? product.stock === 0 : false;

  useEffect(() => {
    if (!user || !product) return;

    const wishlistExists = user.wishlist?.some(
      (item: any) => item.productId === product.id
    );
    setIsInWishlist(!!wishlistExists);

    const cartExists = user.cart?.items?.some(
      (item: any) => item.productId === product.id
    );
    setIsInCart(!!cartExists);
  }, [user, product, id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id as string);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviews(id as string);
        const sorted = data.sort(
          (a: Review, b: Review) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setReviews(sorted);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (id) fetchReviews();
  }, [id]);

  const checkoutQtyKey = (productId: string) => `checkoutQty_${productId}`;

  const handleBuyNow = () => {
    if (!product || isOutOfStock || product.isSpotlight) return;
    sessionStorage.setItem(checkoutQtyKey(product.id), String(quantity));
    router.push(`/checkout/${product.id}`);
  };

  const updateQuantity = (updateFn: (prev: number) => number) => {
    if (!product || isOutOfStock || product.isSpotlight) return;

    setQuantity((prev) => {
      const next = updateFn(prev);
      sessionStorage.setItem(checkoutQtyKey(product.id), String(next));
      return next;
    });
  };

  const handleAddToCart = async () => {
    if (!product || isOutOfStock || product.isSpotlight) return;

    if (product.colour && product.colour.length > 0 && selectedShade === null) {
      toast.error("Please select a color before adding to cart");
      return;
    }

    const selectedColor =
      product.colour && selectedShade !== null
        ? product.colour[selectedShade]
        : null;

    try {
      await addToCart(product.id, quantity, selectedColor);
      await refreshUser();
      toast.success("Added to cart");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add to cart");
    }
  };

  function handelShare(): void {
    if (navigator.share) {
      navigator.share({
        title: "Check out this product!",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Product link copied to clipboard!");
    }
  }

  const handleWishlistToggle = async () => {
    if (!user || !product) return;

    try {
      setLoadingWishlist(true);

      if (isInWishlist) {
        setIsInWishlist(false);
        await removeFromWishlist(product?.id);
        toast.success("Removed from wishlist");
      } else {
        setIsInWishlist(true);
        await addToWishlist(product?.id);
        toast.success("Added to wishlist");
      }

      refreshUser();
    } catch (err) {
      console.error(err);
      setIsInWishlist((prev) => !prev);
      toast.error("Something went wrong");
    } finally {
      setLoadingWishlist(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!newReview.comment || newReview.rating === 0) {
      toast.error("Please provide rating and comment");
      return;
    }

    try {
      setSubmittingReview(true);
      const added = await addReview(id as string, newReview);
      toast.success("Review added successfully!");
      setNewReview({ rating: 0, comment: "" });

      const reviewWithUser = {
        ...added,
        user: {
          id: user?.id || "",
          name: user?.name || "User",
          profileImage: user?.profileImage || "",
        },
      };
      setReviews((prev) => [reviewWithUser, ...prev]);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const toggleDescription = () => setIsDescriptionExpanded((prev) => !prev);

  if (loading) return <ProductDetailsSkeleton />;

  if (!product) return <p className="p-4 text-black">Product not found</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-black pb-32">
      {/* Header */}
      <header
        className="sticky top-0 bg-white flex justify-between items-center px-4 py-3 shadow-sm z-10"
        style={{ boxShadow: "0 2px 4px -1px rgba(0,0,0,0.1)" }}
      >
        <button
          aria-label="Back"
          className="text-gray-600 text-xl flex-shrink-0"
          onClick={() => router.back()}
        >
          <IoArrowBackOutline />
        </button>

        <h2 className="font-semibold text-lg text-center flex-1">
          Product Details
        </h2>

        <div className="flex items-center space-x-4 flex-shrink-0">
          <button
            aria-label="Share"
            onClick={handelShare}
            className="text-gray-600 text-xl hover:text-orange-500"
          >
            <GoShareAndroid />
          </button>

          {!product.isSpotlight && (
            <div className="relative">
              <Link href={"/my-cart"}>
                <button
                  aria-label="View cart"
                  className="text-gray-600 text-xl hover:text-[var(--color-brand-hover)]"
                >
                  <FiShoppingCart />
                </button>
              </Link>

              {product.cartQuantity > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center 
            text-[10px] font-bold text-white bg-[var(--color-brand)] rounded-full 
            w-[16px] h-[16px]"
                >
                  {product.cartQuantity}
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      <ProductImageCarousel
        images={product.images}
        video={product.video}
        id={product.id}
        isWishlisted={isInWishlist}
        onWishlistToggle={handleWishlistToggle}
        loadingWishlist={loadingWishlist}
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
      />

      {/* Product Info */}
      <div className="flex-1 bg-white px-3 py-6 my-1">
        {product.category && (
          <span className="bg-orange-100 text-[var(--color-brand)] px-3 py-1 rounded text-xs font-medium">
            {product.category}
          </span>
        )}

        {product.isSpotlight && (
          <span className="ml-2 bg-purple-100 text-purple-600 px-3 py-1 rounded text-xs font-medium">
            Spotlight
          </span>
        )}

        <h1 className="text-2xl font-bold mt-3">{product.title}</h1>
        <p className="text-gray-500 mt-2">{product.description}</p>

        {/* Stock Status */}
        {isOutOfStock && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <p className="text-red-600 font-semibold text-sm">Out of Stock</p>
          </div>
        )}

        {!isOutOfStock && product.stock <= 10 && !product.isSpotlight && (
          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
            <p className="text-yellow-700 font-semibold text-sm">
              Only {product.stock} left in stock!
            </p>
          </div>
        )}

        {/* Rating and Price */}
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <IoStarSharp
                key={i}
                className={`${
                  i < Math.round(averageRating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                } text-lg`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-600 ml-1">
              ({reviews.length})
            </span>
          </div>

          {!product.isSpotlight && (
            <>
              <div className="flex gap-3 items-center">
                <h2 className="text-2xl font-bold text-[var(--color-brand)]">
                  ₹{product.price}
                </h2>
                <span className="line-through text-gray-500 font-semibold">
                  ₹{product.oldPrice}
                </span>
                <span className="bg-green-300 rounded px-2 py-1 text-xs font-medium">
                  {discountPercent}% OFF
                </span>
              </div>

              {!isOutOfStock && (
                <div className="p-3 bg-orange-200/50 border-2 border-orange-200 rounded-lg flex items-center gap-2 text-orange-800">
                  <RiTruckLine className="text-xl font-bold" />
                  <p className="text-sm font-semibold">
                    Free Delivery in 24 Hours across Varanasi
                  </p>
                </div>
              )}
            </>
          )}

          {product.isSpotlight && (
            <div className="mt-2 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
              <p className="text-purple-700 font-bold text-center text-lg">
                🎯 Grab from our store
              </p>
              <p className="text-purple-600 text-center text-sm mt-1">
                This is a spotlight product - Visit our store to purchase
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Colors Section - Hide for spotlight */}
      {!product.isSpotlight && product.colour && product.colour.length > 0 && (
        <div className="flex-1 bg-white px-3 py-6 my-1">
          <h2 className="text-lg font-semibold mb-2">Select Color</h2>
          <div className="flex flex-wrap gap-3">
            {product.colour.map((color, index) => (
              <button
                key={index}
                onClick={() => !isOutOfStock && setSelectedShade(index)}
                disabled={isOutOfStock}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedShade === index
                    ? "border-[var(--color-brand)] scale-110"
                    : "border-gray-300"
                } ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quantity - Hide for spotlight */}
      {!product.isSpotlight && (
        <div className="flex-1 bg-white px-3 py-6 my-1">
          <h2 className="text-lg font-semibold mb-2">Quantity</h2>
          <div className="flex items-center space-x-6 mb-4">
            <button
              className={`w-8 h-8 border-2 border-gray-300 rounded-xl flex items-center justify-center ${
                isOutOfStock ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => updateQuantity((q) => Math.max(1, q - 1))}
              disabled={isOutOfStock}
            >
              <AiOutlineMinus className="text-sm" />
            </button>
            <span className="text-lg">{quantity}</span>
            <button
              className={`w-8 h-8 border-2 border-gray-300 rounded-xl flex items-center justify-center ${
                isOutOfStock ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => updateQuantity((q) => q + 1)}
              disabled={isOutOfStock}
            >
              <AiOutlinePlus className="text-sm" />
            </button>
          </div>
        </div>
      )}

      {/* Description */}
      <div className="flex-1 bg-white px-3 py-6 my-1">
        <h2 className="text-lg font-semibold mb-2">Description</h2>
        <p className="text-gray-700 text-sm line-clamp-3">
          {isDescriptionExpanded
            ? product.description
            : product.description.slice(0, 120) +
              (product.description.length > 120 ? "..." : "")}
        </p>
        <button
          className="text-[var(--color-brand)] text-sm font-semibold"
          onClick={toggleDescription}
        >
          {isDescriptionExpanded ? "Read Less" : "Read More"}
        </button>
      </div>

      {/* Inside Box */}
      <div className="flex-1 bg-white px-3 py-6 my-1">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Inside Box</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-gray-700 text-sm mb-6">
          {(product.insideBox || []).map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--color-brand)] rounded-full"></span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Write Review */}
      <div className="p-3 bg-white shadow-sm my-1">
        <h3 className="font-semibold text-gray-800 text-base mb-1">
          Write a Review
        </h3>

        <div className="flex space-x-1 justify-start my-2">
          {Array.from({ length: 5 }, (_, index) => (
            <IoStarSharp
              key={index}
              className={`text-2xl cursor-pointer transition-colors duration-200
            ${index < newReview.rating ? "text-yellow-400" : "text-gray-200"}`}
              onClick={() => setNewReview({ ...newReview, rating: index + 1 })}
            />
          ))}
        </div>

        <textarea
          value={newReview.comment}
          onChange={(e) =>
            setNewReview({ ...newReview, comment: e.target.value })
          }
          placeholder="Write your review…"
          className="border p-1 rounded w-full text-sm h-20 resize-none"
        />

        <button
          onClick={handleSubmitReview}
          className={`bg-[var(--color-brand)] text-white px-3 py-2 rounded-lg w-full mt-2 text-sm flex justify-center items-center gap-2 transition-all ${
            submittingReview ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={submittingReview}
        >
          {submittingReview ? "Submitting..." : "Submit"}
        </button>
      </div>

      {/* Reviews */}
      <div className="p-4 bg-white shadow-sm my-1">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Reviews ({reviews.length})
          </h2>
          {reviews.length > 3 && !showAllReviews && (
            <button
              onClick={() => setShowAllReviews(true)}
              className="text-[var(--color-brand)] text-sm font-medium"
            >
              View All
            </button>
          )}

          {reviews.length > 4 && showAllReviews && (
            <button
              onClick={() => setShowAllReviews(false)}
              className="text-[var(--color-brand)] text-sm font-medium"
            >
              View Less
            </button>
          )}
        </div>

        {reviews.length > 0 ? (
          (showAllReviews ? reviews : reviews.slice(0, 4)).map((review) => (
            <div className="mb-5 pb-3 border-b border-gray-100" key={review.id}>
              <div className="flex items-start gap-4">
                <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden border border-gray-200">
                  <Image
                    src={
                      review.user?.profileImage || "/images/dummy_profile.png"
                    }
                    alt={review.user?.name || "User"}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <p className="text-gray-900 font-semibold text-base leading-tight">
                        {review.user?.name || "Anonymous"}
                      </p>
                      <time
                        dateTime={review.createdAt}
                        className="text-xs text-gray-500"
                        title={new Date(review.createdAt).toLocaleString()}
                      >
                        {new Date(review.createdAt).toLocaleDateString()}
                      </time>
                    </div>

                    <div
                      className="flex"
                      aria-label={`Rating: ${review.rating} out of 5`}
                    >
                      {[...Array(5)].map((_, i) => (
                        <IoStarSharp
                          key={i}
                          className={`${
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          } text-sm`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed break-words">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm italic">No reviews yet</p>
        )}
      </div>

      {/* Fixed Bottom Buttons - Hide for spotlight */}
      {!product.isSpotlight && (
        <div
          className="fixed bottom-[60px] left-0 right-0 bg-white flex justify-between items-center p-4 z-50"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)",
            boxShadow: "0 -4px 6px -4px rgba(0, 0, 0, 0.1)",
          }}
        >
          {isOutOfStock ? (
            <button
              disabled
              className="w-full py-3 bg-gray-400 text-white rounded-xl font-medium cursor-not-allowed"
            >
              Out of Stock
            </button>
          ) : (
            <>
              {isInCart ? (
                <button
                  onClick={() => router.push("/my-cart")}
                  className="flex items-center justify-center gap-2 w-[48%] py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium min-w-0"
                >
                  <MdShoppingCartCheckout className="text-lg flex-shrink-0" />
                  <span className="truncate">Go to Cart</span>
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 w-[48%] py-3 bg-gray-200 rounded-xl font-medium hover:bg-gray-300 min-w-0"
                >
                  <MdOutlineAddShoppingCart className="text-lg flex-shrink-0" />
                  <span className="truncate">Add to Cart</span>
                </button>
              )}

              <button
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-2 w-[48%] py-3 bg-[var(--color-brand)] text-white rounded-xl font-medium hover:bg-[var(--color-brand-hover)] min-w-0"
              >
                <LuShoppingBag className="text-lg flex-shrink-0" />
                <span className="truncate">Buy Now</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Spotlight Message - Show only for spotlight products */}
      {product.isSpotlight && (
        <div
          className="fixed bottom-[60px] left-0 right-0 bg-purple-600 p-4 z-50"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)",
            boxShadow: "0 -4px 6px -4px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="text-center">
            <p className="text-white font-bold text-lg mb-1">
              🎯 Grab from our store
            </p>
            <p className="text-purple-100 text-sm">
              Visit us to get this exclusive spotlight product
            </p>
          </div>
        </div>
      )}
    </div>
  );
}