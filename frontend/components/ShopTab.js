// components/ShopTab.js
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './shop/ProductCard';
import ShopFilters from './shop/ShopFilters';
import CartDrawer from './shop/CartDrawer';
import ProductDetailModal from './shop/ProductDetailModal';
import { API_URL } from '@/lib/api';
import ProductReviewsModal from './ratings/ProductReviewsModal';

export default function ShopTab({ user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Quick View Modal States
  const [selectedProductForView, setSelectedProductForView] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Review Modal States
  const [selectedProductForReview, setSelectedProductForReview] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.username || '',
    phone: '',
    address: '',
    city: '',
  });

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🛠️ Reviews dynamically fetch කර ගණනය කිරීම
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/products/shop`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();

      const updatedProducts = await Promise.all(
        data.map(async (prod) => {
          try {
            const prodId = prod._id || prod.id;
            const ratingRes = await axios.get(`${API_URL}/api/products/${prodId}/ratings`);
            const ratingsList = ratingRes.data || [];

            const count = ratingsList.length;
            const avg = count > 0
              ? ratingsList.reduce((acc, curr) => acc + (curr.rating || 0), 0) / count
              : 0;

            return {
              ...prod,
              reviewCount: count,
              averageRating: avg
            };
          } catch (e) {
            return { ...prod, reviewCount: 0, averageRating: 0 };
          }
        })
      );

      setProducts(updatedProducts);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Could not load products. Please check backend.');
      setLoading(false);
    }
  };

  const handleOpenQuickView = (product) => {
    setSelectedProductForView(product);
    setIsQuickViewOpen(true);
  };

  const handleOpenReviews = (product) => {
    setSelectedProductForReview(product);
    setIsReviewModalOpen(true);
  };

  const handleAddToCart = (productWithDetails) => {
    if (isAdmin) return;

    const productId = productWithDetails._id || productWithDetails.id;
    const selectedColor = productWithDetails.selectedColor || 'Default';
    const quantityToAdd = productWithDetails.quantity || 1;

    const existingIndex = cart.findIndex(
      (item) => (item._id === productId || item.id === productId) && item.selectedColor === selectedColor
    );

    if (existingIndex > -1) {
      if (cart[existingIndex].quantity + quantityToAdd > productWithDetails.stock) {
        alert('Stock limit exceeded!');
        return;
      }
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantityToAdd;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...productWithDetails, quantity: quantityToAdd }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          const itemId = item._id || item.id;
          if (itemId === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => (item._id || item.id) !== id));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (isAdmin || cart.length === 0) return;

    setSubmitting(true);
    setSuccessMsg('');

    try {
      const token = localStorage.getItem('accessToken');
      const orderData = {
        items: cart.map((item) => ({
          product: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
        })),
        totalAmount,
        shippingAddress,
      };

      await axios.post(`${API_URL}/api/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMsg('Order placed successfully!');
      setCart([]);
      setIsCheckoutOpen(false);
    } catch (err) {
      console.error('Order submit error:', err);
      alert('Failed to place order.');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ['All', ...new Set(products.map((p) => p.category || 'General'))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || (product.category || 'General') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="p-8 text-gray-600 font-medium text-center">Loading store catalog...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500 font-medium text-center">{error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Store / Shop Catalog</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {isAdmin ? 'Product Stock & Price Monitoring (Admin Mode)' : 'Browse items and place your orders'}
          </p>
        </div>

        {!isAdmin && (
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition flex items-center gap-2 text-sm"
          >
            🛒 Cart
            {cart.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
        )}
      </div>

      <ShopFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <p className="text-gray-400 text-center col-span-full py-10 text-sm">No products found.</p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              isAdmin={isAdmin}
              onAddToCart={handleAddToCart}
              onQuickView={handleOpenQuickView}
              onViewReviews={() => handleOpenReviews(product)}
            />
          ))
        )}
      </div>

      {/* Quick View Modal */}
      <ProductDetailModal
        product={selectedProductForView}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        onAddToCart={handleAddToCart}
      />

      {/* Product Reviews Modal */}
      <ProductReviewsModal
        productId={selectedProductForReview?._id || selectedProductForReview?.id}
        productName={selectedProductForReview?.name || selectedProductForReview?.title}
        user={user}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewSubmitted={() => {
          fetchProducts();
        }}
      />

      {!isAdmin && (
        <CartDrawer
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          shippingAddress={shippingAddress}
          setShippingAddress={setShippingAddress}
          handlePlaceOrder={handlePlaceOrder}
          submitting={submitting}
          totalAmount={totalAmount}
        />
      )}
    </div>
  );
}