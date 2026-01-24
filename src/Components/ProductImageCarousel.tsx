'use client';

import Image from "next/image";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaPlay } from "react-icons/fa";

interface ProductImageCarouselProps {
  images: string[];
  video?: string | null;
  id: string;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
  loadingWishlist?: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function ProductImageCarousel({
  images,
  video,
  id,
  isWishlisted,
  onWishlistToggle,
  loadingWishlist,
  isOpen,
  setIsOpen,
}: ProductImageCarouselProps) {
  const mediaItems = [
    ...images.map((url) => ({ type: "image" as const, url })),
    ...(video ? [{ type: "video" as const, url: video! }] : []),
  ];

  const [current, setCurrent] = useState(0);
  const startX = useRef<number | null>(null);

  const currentMedia = mediaItems[current];

  const nextSlide = () => setCurrent((prev) => (prev + 1) % mediaItems.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);

  const handleTouchStart = (e: React.TouchEvent | React.PointerEvent) => {
    if ("touches" in e) startX.current = e.touches[0].clientX;
    else startX.current = e.clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent | React.PointerEvent) => {
    if (startX.current == null) return;
    const endX =
      "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const delta = endX - startX.current;
    if (delta > 50) prevSlide();
    else if (delta < -50) nextSlide();
    startX.current = null;
  };

  return (
    <>
      {/* Main Carousel */}
      <div
        className="relative w-full h-56 mt-1 overflow-hidden rounded-md"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onPointerDown={handleTouchStart}
        onPointerUp={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out cursor-pointer"
          style={{ transform: `translateX(-${current * 100}%)` }}
          onClick={() => setIsOpen(true)}
        >
          {mediaItems.map((item, index) => (
            <div key={index} className="relative w-full h-56 flex-shrink-0">
              {item.type === "image" ? (
                <Image
                  src={item.url}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="relative w-full h-full bg-black flex items-center justify-center">
                  <video
                    src={item.url}
                    className="w-full h-full object-contain"
                    controls
                    playsInline
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Wishlist Button */}
        <button
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-4 right-4 p-2 rounded-full shadow-md bg-white"
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle();
          }}
          disabled={loadingWishlist}
        >
          {loadingWishlist ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          ) : isWishlisted ? (
            <AiFillHeart className="text-red-500 w-5 h-5" />
          ) : (
            <AiOutlineHeart className="text-gray-600 w-5 h-5" />
          )}
        </button>

        {/* Navigation Arrows */}
        {mediaItems.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow hover:bg-gray-100"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow hover:bg-gray-100"
            >
              <FaChevronRight />
            </button>
          </>
        )}

        {/* Dots */}
        {mediaItems.length > 1 && (
          <div className="absolute bottom-2 w-full flex justify-center space-x-1">
            {mediaItems.map((item, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent(index);
                }}
                className={`transition-all rounded-full ${
                  current === index
                    ? "bg-[var(--color-brand)] w-3 h-2"
                    : "bg-gray-300 w-2 h-2"
                }`}
              >
                {item.type === "video" && current === index && (
                  <FaPlay className="w-2 h-2 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-[100]">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white text-4xl p-2 z-[101] hover:bg-white/10 rounded-full"
            aria-label="Close"
          >
            &times;
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-4">
            {currentMedia.type === "image" ? (
              <Image
                src={currentMedia.url}
                alt={`Full screen ${current + 1}`}
                fill
                className="object-contain"
              />
            ) : (
              <video
                src={currentMedia.url}
                controls
                autoPlay
                className="max-w-full max-h-full"
              />
            )}

            {/* Fullscreen Arrows */}
            {mediaItems.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl p-3 bg-black/50 rounded-full hover:bg-black/70 z-[101]"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl p-3 bg-black/50 rounded-full hover:bg-black/70 z-[101]"
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            {/* Fullscreen Dots */}
            {mediaItems.length > 1 && (
              <div className="absolute bottom-4 w-full flex justify-center space-x-2 z-[101]">
                {mediaItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      current === index ? "bg-[var(--color-brand)]" : "bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
