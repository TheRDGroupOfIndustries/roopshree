export default function SpotlightPage() {
  const products = [
    {
      id: 1,
      title: "Nykaa Long Lasting Lipstick",
      description:
        "Matte finish lipstick with intense color payoff and long stay.",
      image:
        "https://images.unsplash.com/photo-1611078489935-0cb964de46c4",
      rating: 4.5,
    },
    {
      id: 2,
      title: "Liquid Eye Liner",
      description:
        "Smudge-proof liquid eyeliner with rich intense color.",
      image:
        "https://images.unsplash.com/photo-1600185365483-26d7f42e8f02",
      rating: 4.8,
    },
    {
      id: 3,
      title: "Matte Longstay Mini Lipstick",
      description:
        "Mini lipstick with smooth matte texture and bold shade.",
      image:
        "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0",
      rating: 4.0,
    },
    {
      id: 4,
      title: "Silk Obsession Lipstick",
      description:
        "Premium creamy lipstick with silky smooth finish.",
      image:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be",
      rating: 4.7,
    },
  ];

  return (
    <div className="min-h-screen bg-white px-4 pb-24">
      {/* Page Title */}
      <h1 className="text-xl font-semibold mb-4 text-black">
        🌟 Spotlight Products
      </h1>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden relative"
          >
            {/* Wishlist Icon */}
            <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow text-sm">
              🤍
            </button>

            {/* Image */}
            <div className="bg-gray-50 flex items-center justify-center h-44">
              <img
                src={p.image}
                alt={p.title}
                className="h-40 object-contain"
              />
            </div>

            {/* Product Info */}
            <div className="p-3">
              <h3 className="text-sm font-medium text-black line-clamp-2">
                {p.title}
              </h3>

              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {p.description}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1 mt-2 text-xs">
                <span className="text-yellow-500">★★★★★</span>
                <span className="text-gray-500">
                  ({p.rating})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}