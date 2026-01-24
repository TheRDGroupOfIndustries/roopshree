"use client";

import { useState } from "react";
import Image from "next/image";
import { BiHeart } from "react-icons/bi";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import SmallLoadingSpinner from "./SmallLoadingSpinner";

interface ProductImageCarouselProps {
  images: string[];
  video?: string | null; // ✅ YEH ADD HUA
  id: string;
  isWishlisted: boolean;
  onWishlistToggle: (e: React.MouseEvent) => void;
  loadingWishlist: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function ProductImageCarousel({
  images,
  video, // ✅ YEH ADD HUA
  id,
  isWishlisted,
  onWishlistToggle,
  loadingWishlist,
  isOpen,
  setIsOpen,
}: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Images aur video ko combine kiya
  const mediaItems = [
    ...images.map((img) => ({ type: "image" as const, url: img })),
    ...(video ? [{ type: "video" as const, url: video }] : []),
  ];

  const totalItems = mediaItems.length;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === totalItems - 1 ? 0 : prev + 1));
  };

  const currentMedia = mediaItems[currentIndex];

  return (
    <>
      {/* Main Carousel */}
      <div className="relative w-full h-96 bg-gray-50 flex items-center justify-center">
        {/* Wishlist Button */}
        <button
          className={`absolute top-4 right-4 z-20 rounded-full p-2 shadow-md ${
            isWishlisted
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
          onClick={onWishlistToggle}
          disabled={loadingWishlist}
        >
          {loadingWishlist ? (
            <SmallLoadingSpinner />
          ) : (
            <BiHeart className="w-5 h-5" />
          )}
        </button>

        {/* Media Display - Image ya Video */}
        {currentMedia?.type === "image" ? (
          <div
            className="relative w-full h-full cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <Image
              src={currentMedia.url}
              alt={`Product ${currentIndex + 1}`}
              fill
              className="object-contain p-4"
              priority={currentIndex === 0}
            />
          </div>
        ) : currentMedia?.type === "video" ? (
          <div className="relative w-full h-full p-4">
            <video
              src={currentMedia.url}
              controls
              className="w-full h-full object-contain bg-black rounded-lg"
              poster={images[0]}
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="bg-white/80 rounded-full p-4">
                <Play className="w-8 h-8 text-gray-800" />
              </div>
            </div>
          </div>
        ) : null}

        {/* Navigation Arrows */}
        {totalItems > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/70 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:bg-white transition z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/70 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:bg-white transition z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {mediaItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-[var(--color-brand)] w-6"
                  : "bg-gray-300"
              }`}
              aria-label={`Go to ${item.type} ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {totalItems > 1 && (
        <div className="bg-white px-3 py-3 overflow-x-auto">
          <div className="flex gap-2">
            {mediaItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                  index === currentIndex
                    ? "border-[var(--color-brand)]"
                    : "border-gray-200"
                }`}
              >
                {item.type === "image" ? (
                  <Image
                    src={item.url}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Modal */}
      {isOpen && currentMedia?.type === "image" && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white text-3xl z-50"
          >
            ×
          </button>

          <div className="relative w-full h-full p-8">
            <Image
              src={currentMedia.url}
              alt={`Product ${currentIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          {totalItems > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}