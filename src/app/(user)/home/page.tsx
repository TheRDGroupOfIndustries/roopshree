"use client";
import { FiShoppingCart } from "react-icons/fi";
import { AiOutlineSearch } from "react-icons/ai";
import { BiHeart } from "react-icons/bi";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "@/Components/ProductCard";
import ProductCardSkeleton from "@/Components/ProductCardSkeleton";
import TrendingCardSkeleton from "@/Components/TrendingCardSkeleton";
import CategoryList from "@/Components/CategoryList";
import CategorySkeleton from "@/Components/CategorySkeleton";

import { getAllProducts } from "@/services/productService";
import { getAllCategories } from "@/services/categoryService";
import { useAuth } from "@/context/AuthProvider";
import TrendingCard from "@/Components/TrendingNow";

export default function HomePage() {
  const { user, refreshUser } = useAuth();
  const cartCount = user?.cart?.items?.length || 0;

  // ------------------- SEARCH ------------------- //
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // ------------------- PRODUCTS ------------------- //
  const [products, setProducts] = useState<any[]>([]);
  const [shuffledProducts, setShuffledProducts] = useState<any[]>([]);
  const [productLoading, setProductLoading] = useState(true);
  const [showAllProducts, setShowAllProducts] = useState(false);

  // ------------------- CATEGORIES ------------------- //
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  // ------------------- BANNERS ------------------- //
  const [banners, setBanners] = useState<any[]>([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // ------------------- OFFERS ------------------- //
  const [offers, setOffers] = useState<any[]>([]);
  const [offerLoading, setOfferLoading] = useState(true);
  const [offerExpired, setOfferExpired] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // ------------------- CAROUSEL ------------------- //
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  // ------------------- FETCH DATA ------------------- //
  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductLoading(true);
        const res = await getAllProducts();
        setProducts(res);
        setShuffledProducts([...res].sort(() => Math.random() - 0.5));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setProductLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoryLoading(true);
        const res = await getAllCategories();
        setCategories(res);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // auto rotate offers every 5 seconds (only if multiple offers)
  useEffect(() => {
    if (offers.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [offers]);

  // auto rotate banners every 5 seconds (only if multiple banners)
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setBannerLoading(true);
        const res = await axios.get("/api/banners");
        setBanners(res.data || []);
      } catch (err) {
        console.error("Error fetching banners:", err);
      } finally {
        setBannerLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // ------------------- FETCH OFFERS (UPDATED FOR MULTIPLE OFFERS) ------------------- //
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setOfferLoading(true);
        const res = await axios.get("/api/offer");
        const offerData = res.data || [];

        if (offerData.length > 0) {
          // Filter only non-expired offers
          const validOffers = offerData.filter((offer: any) => {
            const endDate = new Date(offer.date).getTime();
            const now = Date.now();
            return endDate > now;
          });

          if (validOffers.length > 0) {
            setOffers(validOffers);
            // Set timer for the first offer
            const firstOfferEnd = new Date(validOffers[0].date).getTime();
            const diff = Math.floor((firstOfferEnd - Date.now()) / 1000);
            setTimeLeft(diff);
            setOfferExpired(false);
          } else {
            setOffers([]);
            setOfferExpired(true);
          }
        } else {
          setOffers([]);
          setOfferExpired(true);
        }
      } catch (err) {
        console.error("Error fetching offer:", err);
      } finally {
        setOfferLoading(false);
      }
    };
    fetchOffers();
  }, []);

  // ------------------- OFFER COUNTDOWN ------------------- //
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setOfferExpired(true);
          setOffers([]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // ------------------- SEARCH HANDLERS ------------------- //
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setIsSearching(value.length > 0);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setIsSearching(false);
  };

  const filteredProducts = products.filter((product) =>
    product.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (days > 0) {
      return `${days}d ${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    } else {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
  };

  // ------------------- RENDER ------------------- //
  return (
    <div className="  min-h-screen pb-20">
      {/* ---------- HEADER ---------- */}
      <div className="sticky top-0 z-20  shadow pb-1">
        <header className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold  ">Roop Shree</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Link href={"/my-cart"}>
                <FiShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[var(--color-brand)]   text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
            <Link href={"/wishlist"}>
              <BiHeart size={22} />
            </Link>
          </div>
        </header>

        {/* Search Bar */}
        <div className="flex items-center  rounded-xl mx-4 mb-3 px-3 py-2">
          <AiOutlineSearch size={20} className="text-red-500" />
          <input
            type="text"
            placeholder="Search cosmetics..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="flex-1 bg-transparent outline-none ml-3 text-sm"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="  hover:text-gray-700 ml-2"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ---------- SEARCH RESULTS ---------- */}
      {isSearching ? (
        <div className="px-4 mt-4">
          <h3 className="font-semibold text-lg   mb-3">
            Results for "{searchTerm}"
          </h3>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.title}
                  description={product.description}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  image={product.images?.[0] || "/images/placeholder_image.png"}
                />
              ))}
            </div>
          ) : (
            <p className="  text-sm mt-10 text-center">
              No products found for "{searchTerm}"
            </p>
          )}
        </div>
      ) : (
        <>
          {/* ---------- BANNER CAROUSEL ---------- */}
          <div className="relative mx-4 mt-3 h-38  overflow-hidden rounded-2xl">
            {bannerLoading ? (
              <div className="h-40   animate-pulse rounded-xl"></div>
            ) : banners.length > 0 ? (
              <>
                {/* Carousel Container */}
                <div
                  className="flex w-full transition-transform duration-700 ease-in-out"
                  style={{
                    transform: `translateX(-${currentBannerIndex * 100}%)`,
                  }}
                >
                  {banners.map((banner, i) => (
                    <div key={i} className="min-w-full flex-shrink-0">
                      <div className="relative">
                        <Image
                          width={500}
                          height={300}
                          src={banner.image}
                          alt={banner.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-[var(--color-brand)]/20"></div>
                        <div className="relative z-10 p-6 flex flex-col items-start">
                          <h2 className="text-xl font-bold mb-2 text-white  ">
                            {banner.title}
                          </h2>
                          {banner.subtitle && (
                            <p className="text-sm mb-4 text-white ">
                              {banner.subtitle}
                            </p>
                          )}
                          <button className="px-4 py-2   text-[var(--color-brand)] rounded-lg text-sm font-semibold hover:bg-gray-200 hover:text-black transition-colors">
                            Shop Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Indicator Dots */}
                {banners.length > 1 && (
                  <div className="flex justify-center mt-3 space-x-2">
                    {banners.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          currentBannerIndex === i
                            ? "bg-[var(--color-brand)] scale-110"
                            : "bg-gray-300"
                        }`}
                      ></div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="h-40 flex items-center justify-center  ">
                No banner available
              </div>
            )}
          </div>

          {/* ---------- CATEGORIES ---------- */}
          <div className="mt-6 px-4">
            <h3 className="font-semibold text-lg mb-3">Categories</h3>
            <div className="flex gap-6 overflow-x-auto scrollbar-hide">
              {categoryLoading ? (
                <CategorySkeleton />
              ) : (
                <CategoryList categories={categories} />
              )}
            </div>
          </div>

          {/* ---------- FLASH SALE ---------- */}
          {!offerExpired && offers.length > 0 && (
            <div className="relative  mt-6 overflow-hidden rounded-xl">
              {/* Carousel Container */}
              <div
                className="flex w-full transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentOfferIndex * 100}%)`,
                }}
              >
                {offers.map((offer, i) => (
                  <div key={i} className="min-w-full flex-shrink-0 px-4 mt-6">
                    <div className="bg-gradient-to-r from-[var(--color-brand-hover)] to-[var(--color-brand)]  p-4 rounded-xl flex justify-between items-center">
                      {offerLoading ? (
                        <div className="w-full flex justify-between animate-pulse">
                          <div className="space-y-2">
                            <div className="h-4 bg-white/40 w-24 rounded"></div>
                            <div className="h-3 bg-white/30 w-32 rounded"></div>
                          </div>
                          <div className="h-5 bg-white/40 w-20 rounded"></div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <h4 className="font-semibold text-base text-white sm:text-lg">
                              {offer.title}
                            </h4>
                            {offer.subtitle && (
                              <p className="text-sm w-[11rem] opacity-90 text-white">
                                {offer.subtitle}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col text-end">
                            <span className="text-xs sm:text-sm opacity-90 text-white">
                              Ends in
                            </span>
                            <span className="font-bold text-base sm:text-lg whitespace-nowrap text-white">
                              {formatTime(timeLeft)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Indicator Dots */}
              {offers.length > 1 && (
                <div className="flex justify-center mt-3 space-x-2">
                  {offers.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentOfferIndex === i
                          ? "bg-[var(--color-brand)] scale-110"
                          : "bg-gray-300"
                      }`}
                    ></div>
                  ))}
                </div>
              )}
            </div>
          )}

       

          {/* ---------- FEATURED PRODUCTS ---------- */}
          <div className="mt-6 px-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg  ">
                Featured Products
              </h3>
              <button
                className="text-[var(--color-brand)] text-sm font-medium hover:text-[var(--color-brand-hover)]"
                onClick={() => setShowAllProducts(!showAllProducts)}
              >
                {showAllProducts ? "Show Less" : "View All"}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {productLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))
                : (showAllProducts ? products : products.slice(0, 4)).map(
                    (product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.title}
                        description={product.description}
                        price={product.price}
                        oldPrice={product.oldPrice}
                        image={
                          product.images?.[0] || "/images/placeholder_image.png"
                        }
                      />
                    )
                  )}
            </div>
          </div>

            {/* Trending Now */}

        <div className="mt-6 relative px-4">
          {/* Header */}
          <div className="mb-4">
            <h3 className="font-bold text-xl  ">Trending Now</h3>
          </div>

          {/* Horizontal Scrollable Container */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {productLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <TrendingCardSkeleton key={i} />
                ))
              : shuffledProducts.map((product) => (
                  <TrendingCard
                    key={product.id}
                    id={product.id}
                    name={product.title}
                    price={product.price}
                    oldPrice={product.oldPrice}
                    image={
                      product.images?.[0] || "/images/placeholder_image.png"
                    }
                  />
                ))}
          </div>
        </div>
        </>
      )}
    </div>
  );
}