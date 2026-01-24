'use client';

import { useState } from "react";
import ProductImageCarousel from "./ProductImageCarousel";

export function ProductImageCarouselDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Product with Video</h2>
      <ProductImageCarousel
        images={[
          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
          "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800",
        ]}
        video="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        id="demo-1"
        isWishlisted={isWishlisted}
        onWishlistToggle={() => setIsWishlisted(!isWishlisted)}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </div>
  );
}
