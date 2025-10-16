export default function ProductCardSkeleton() {
  return (
    <div className="  rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full animate-pulse">
      {/* Image Placeholder */}
      <div className="w-full h-40  "></div>

      {/* Product Info Placeholder */}
      <div className="p-3 flex flex-col flex-grow">
        <div className="h-4 rounded w-3/4 mb-2"></div>
        <div className="h-3 rounded w-full mb-3"></div>
        <div className="h-3 rounded w-5/6 mb-4"></div>
        <div className="flex items-center justify-between mt-auto">
          <div className="h-4 w-16 rounded"></div>
          <div className="h-8 w-8 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
