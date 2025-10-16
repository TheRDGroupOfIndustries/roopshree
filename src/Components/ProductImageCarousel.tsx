// import Image from "next/image";
// import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
// import { useState, useRef } from "react";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { addToWishlist, removeFromWishlist } from "@/services/wishlistService";
// import toast from "react-hot-toast";

// interface ProductImageCarouselProps {
//   images: string[];
//   id: string;
// }

// export default function ProductImageCarousel({ images, id }: ProductImageCarouselProps) {
//   const [current, setCurrent] = useState(0);
//   const [isWishlisted, setIsWishlisted] = useState(false); 
//   const startX = useRef<number | null>(null);

//   const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
//   const prevSlide = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

//   const handleTouchStart = (e: React.TouchEvent | React.PointerEvent) => {
//     if ("touches" in e) {
//       startX.current = e.touches[0].clientX;
//     } else {
//       startX.current = e.clientX;
//     }
//   };

//   const handleTouchEnd = (e: React.TouchEvent | React.PointerEvent) => {
//     if (startX.current == null) return;

//     let endX;
//     if ("changedTouches" in e) {
//       endX = e.changedTouches[0].clientX;
//     } else {
//       endX = e.clientX;
//     }

//     const delta = endX - startX.current;
//     if (delta > 50) {
//       prevSlide();
//     } else if (delta < -50) {
//       nextSlide();
//     }
//     startX.current = null;
//   };

//   const handleWishlistToggle = async () => {
//     if (isWishlisted) {
//       try {
//         const res = await removeFromWishlist(id);
//         toast.success(res.message || "Removed from wishlist");
//         setIsWishlisted(false);
//       } catch (error: any) {
//         toast.error(error.response?.data?.error || "Something went wrong");
//       }
//     } else {
//       try {
//         const res = await addToWishlist(id);
//         toast.success(res.message || "Added to wishlist");
//         setIsWishlisted(true);
//       } catch (error: any) {
//         toast.error(error.response?.data?.error || "Something went wrong");
//       }
//     }
//   };

//   return (
//     <div
//       className="relative w-full h-56 bg-white mt-1 overflow-hidden rounded-md"
//       onTouchStart={handleTouchStart}
//       onTouchEnd={handleTouchEnd}
//       onPointerDown={handleTouchStart}
//       onPointerUp={handleTouchEnd}
//     >
//       {/* Product Images */}
//       <div
//         className="flex transition-transform duration-500 ease-in-out"
//         style={{ transform: `translateX(-${current * 100}%)` }}
//       >
//         {images.map((img, index) => (
//           <div key={index} className="relative w-full h-56 flex-shrink-0">
//             <Image src={img} alt={`Product image ${index + 1}`} fill className="object-contain" />
//           </div>
//         ))}
//       </div>

//       {/* Wishlist Button */}
//       <button
//         aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
//         className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
//         onClick={handleWishlistToggle}
//       >
//         {isWishlisted ? (
//           <AiFillHeart className="text-xl text-red-500" />
//         ) : (
//           <AiOutlineHeart className="text-xl text-gray-600" />
//         )}
//       </button>

//       {/* Left / Right Arrows */}
//       {images.length > 1 && (
//         <>
//           <button
//             onClick={prevSlide}
//             className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow hover:bg-white"
//           >
//             <FaChevronLeft />
//           </button>
//           <button
//             onClick={nextSlide}
//             className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow hover:bg-white"
//           >
//             <FaChevronRight />
//           </button>
//         </>
//       )}

//       {/* Dots */}
//       {images.length > 1 && (
//         <div className="absolute bottom-2 w-full flex justify-center space-x-1">
//           {images.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrent(index)}
//               className={`w-2 h-2 rounded-full transition-all ${
//                 current === index ? "bg-[var(--color-brand)] w-3" : "bg-gray-300"
//               }`}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


import Image from "next/image";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import SmallLoadingSpinner from "./SmallLoadingSpinner";

interface ProductImageCarouselProps {
  images: string[];
  id: string;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
  loadingWishlist?: boolean;
}

export default function ProductImageCarousel({
  images,
  id,
  isWishlisted,
  onWishlistToggle,
  loadingWishlist,
}: ProductImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const startX = useRef<number | null>(null);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  const handleTouchStart = (e: React.TouchEvent | React.PointerEvent) => {
    if ("touches" in e) startX.current = e.touches[0].clientX;
    else startX.current = e.clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent | React.PointerEvent) => {
    if (startX.current == null) return;
    const endX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const delta = endX - startX.current;
    if (delta > 50) prevSlide();
    else if (delta < -50) nextSlide();
    startX.current = null;
  };

  return (
    <div
      className="relative w-full h-56  mt-1 overflow-hidden rounded-md"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onPointerDown={handleTouchStart}
      onPointerUp={handleTouchEnd}
    >
      {/* Product Images */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, index) => (
          <div key={index} className="relative w-full h-56 flex-shrink-0">
            <Image src={img} alt={`Product image ${index + 1}`} fill className="object-contain" />
          </div>
        ))}
      </div>

      {/* Wishlist Button */}
      <button
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute top-4 right-4   p-2 rounded-full shadow-md "
        onClick={onWishlistToggle}
        disabled={loadingWishlist}
      >
        {loadingWishlist ? (
        <SmallLoadingSpinner/>
        ) : isWishlisted ? (
          <AiFillHeart className=" text-red-500" />
        ) : (
          <AiOutlineHeart className=" text-gray-600" />
        )}
      </button>

      {/* Left / Right Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2  p-1 rounded-full shadow hover:bg-white"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2   p-1 rounded-full shadow hover:bg-white"
          >
            <FaChevronRight />
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2 w-full flex justify-center space-x-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                current === index ? "bg-[var(--color-brand)] w-3" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
