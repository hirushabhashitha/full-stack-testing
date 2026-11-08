// components/shop/ProductCard.js
'use client';

export default function ProductCard({
  product,
  isAdmin,
  onAddToCart,
  onQuickView
}) {
  const isOutOfStock = product.stock <= 0;
  const title = product.name || product.title || 'Product';
  const imageUrl = product.image || product.imageUrl || product.img;

  return (
    <div
      onClick={() => onQuickView && onQuickView(product)} // 👈 කාඩ් එකේ ඕනෑම තැනක ක්ලික් කළ විට Quick View Modal එක ඕපන් වේ
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-4 flex flex-col justify-between cursor-pointer group"
    >
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-[11px] font-semibold uppercase bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md">
            {product.category || 'General'}
          </span>
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${isOutOfStock ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
              }`}
          >
            {isOutOfStock ? 'Out of Stock' : `Stock: ${product.stock}`}
          </span>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gray-50 h-48 flex items-center justify-center border border-gray-100 mb-3 p-2">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="text-gray-300 text-xs font-medium">No Image Uploaded</div>
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <span className="bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
              Quick View
            </span>
          </div>
        </div>

        <h3 className="font-bold text-gray-800 text-base line-clamp-1 mb-2">{title}</h3>
      </div>

      <div className="pt-2 border-t border-gray-50 flex justify-between items-center">
        <span className="text-lg font-bold text-gray-900">${product.price}</span>

        {isAdmin ? (
          <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-md font-semibold">
            Admin
          </span>
        ) : (
          <button
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation(); // 👈 කාඩ් එකේ ක්ලික් වීම වැළැක්වීමට සහ Add to Cart පමණක් ක්‍රියාත්මක කිරීමට
              onAddToCart && onAddToCart(product);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition cursor-pointer ${!isOutOfStock ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
              }`}
          >
            {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
}