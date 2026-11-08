// components/shop/ProductDetailModal.js
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProductDetailModal({ product, isOpen, onClose, onAddToCart, onReviewAdded }) {
    if (!isOpen || !product) return null;

    const colors = product.colors || [
        { name: 'Matte Black', hex: '#1E1E1E' },
        { name: 'Silver White', hex: '#E5E7EB' },
        { name: 'Space Gray', hex: '#6B7280' }
    ];

    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [quantity, setQuantity] = useState(1);

    const [reviewsList, setReviewsList] = useState([]);
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reviewError, setReviewError] = useState('');

    // Admin States
    const [adminReplies, setAdminReplies] = useState({});
    const [replyingId, setReplyingId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const imageUrl = product.image || product.imageUrl || product.img;

    // Robust Admin Check via LocalStorage
    useEffect(() => {
        const fetchReviewsAndUser = async () => {
            try {
                // 1. Fetch ratings/reviews
                const res = await axios.get(`http://localhost:5000/api/products/${product._id}/ratings`);
                setReviewsList(res.data || []);

                // 2. Read raw local storage values
                const rawUser = localStorage.getItem('user') || '';
                const userRole = localStorage.getItem('userRole') || '';
                const userType = localStorage.getItem('userType') || '';

                let userObj = {};
                try {
                    userObj = JSON.parse(rawUser);
                } catch (e) {
                    userObj = {};
                }

                const isUserAdmin =
                    rawUser.toLowerCase().includes('"role":"admin"') ||
                    rawUser.toLowerCase().includes('"isadmin":true') ||
                    rawUser.toLowerCase().includes('"type":"admin"') ||
                    userObj.role === 'admin' ||
                    userObj.isAdmin === true ||
                    userObj.isAdmin === 'true' ||
                    userObj.isAdmin === 1 ||
                    userRole === 'admin' ||
                    userType === 'admin' ||
                    userObj.type === 'admin';

                setIsAdmin(isUserAdmin);
            } catch (err) {
                console.error('Failed to fetch reviews or user:', err);
            }
        };

        if (isOpen && product._id) {
            fetchReviewsAndUser();
        }
    }, [isOpen, product._id]);

    const reviewCount = reviewsList.length;
    const totalRatingSum = reviewsList.reduce((acc, item) => acc + Number(item.rating || 0), 0);
    const avgRating = reviewCount > 0
        ? (totalRatingSum / reviewCount).toFixed(1)
        : Number(product.averageRating || product.rating || 0).toFixed(1);

    const getPercentage = (star) => {
        if (reviewCount === 0) return 0;
        const count = reviewsList.filter((r) => Math.round(Number(r.rating)) === star).length;
        return Math.round((count / reviewCount) * 100);
    };

    const handleAddToCart = () => {
        const itemToAdd = {
            ...product,
            selectedColor: selectedColor.name,
            quantity: quantity
        };
        onAddToCart(itemToAdd);
        onClose();
    };

    const handleAddReview = async (e) => {
        e.preventDefault();
        if (!reviewText.trim()) return;

        setIsSubmitting(true);
        setReviewError('');

        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const res = await axios.post(
                `http://localhost:5000/api/products/${product._id}/ratings`,
                { rating: Number(rating), review: reviewText },
                config
            );

            const updatedRes = await axios.get(`http://localhost:5000/api/products/${product._id}/ratings`);
            setReviewsList(updatedRes.data || []);

            setReviewText('');
            setRating(5);

            if (onReviewAdded) {
                onReviewAdded(res.data.rating);
            }
        } catch (err) {
            setReviewError(err.response?.data?.message || 'Failed to add review.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAdminReplySubmit = async (ratingId) => {
        const replyString = adminReplies[ratingId];
        if (!replyString || !replyString.trim()) return;

        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.put(
                `http://localhost:5000/api/admin/ratings/${ratingId}/reply`,
                { adminReply: replyString },
                config
            );

            setReviewsList(reviewsList.map(rev =>
                (rev._id === ratingId) ? { ...rev, adminReply: replyString } : rev
            ));

            setAdminReplies({ ...adminReplies, [ratingId]: '' });
            setReplyingId(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to send admin reply.');
        }
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md transition-opacity"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8 flex flex-col border border-gray-100"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2.5 transition z-10 cursor-pointer"
                >
                    ✕
                </button>

                {/* Product Main Details */}
                <div className="flex flex-col md:flex-row gap-8 mb-8 items-start">
                    <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50/80 rounded-2xl p-6 h-72 border border-gray-100 shadow-inner">
                        {imageUrl ? (
                            <img src={imageUrl} alt={product.name} className="max-h-full object-contain drop-shadow-sm" />
                        ) : (
                            <div className="text-gray-400 text-sm font-medium">No Image Available</div>
                        )}
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{product.name}</h2>
                            <p className="text-3xl font-black text-blue-600">${product.price}</p>
                            <p className="text-sm text-gray-500 leading-relaxed">{product.description || 'High performance electronic device.'}</p>

                            {/* Color Selection - Hidden for Admin */}
                            {!isAdmin && (
                                <div className="pt-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Color: <span className="text-gray-800 font-semibold">{selectedColor.name}</span>
                                    </label>
                                    <div className="flex gap-2.5">
                                        {colors.map((c) => (
                                            <button
                                                key={c.name}
                                                type="button"
                                                onClick={() => setSelectedColor(c)}
                                                className={`w-7 h-7 rounded-full border-2 transition cursor-pointer ${selectedColor.name === c.name ? 'border-blue-600 scale-110 shadow-md ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'}`}
                                                style={{ backgroundColor: c.hex }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quantity & Add to Cart - Hidden for Admin */}
                        {!isAdmin && (
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</span>
                                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold transition cursor-pointer"
                                        >
                                            -
                                        </button>
                                        <span className="px-5 text-sm font-semibold text-gray-800">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold transition cursor-pointer"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-2xl shadow-md transition-all transform active:scale-[0.99] cursor-pointer"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ratings & Reviews Section */}
                <div className="pt-6 border-t border-gray-100 space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">Customer Reviews & Ratings</h3>

                    {/* Breakdown & Percentage Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50/80 p-6 rounded-2xl border border-gray-100 items-center">
                        <div className="text-center md:border-r md:border-gray-200 pr-4">
                            <div className="text-5xl font-extrabold text-gray-900">{isNaN(avgRating) ? '0.0' : avgRating}</div>
                            <div className="text-amber-400 text-base my-1.5 tracking-widest">
                                {'★'.repeat(Math.round(Number(avgRating) || 0))}
                                {'☆'.repeat(5 - Math.round(Number(avgRating) || 0))}
                            </div>
                            <div className="text-xs text-gray-500 font-medium">Based on {reviewCount} Reviews</div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const pct = getPercentage(star);
                                return (
                                    <div key={star} className="flex items-center gap-3 text-xs">
                                        <span className="w-14 font-semibold text-gray-600">{star} Stars</span>
                                        <div className="flex-1 bg-gray-200 h-2.5 rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <span className="w-9 text-right text-gray-500 font-medium">{pct}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Write a Review Form - Hidden for Admin */}
                    {!isAdmin && (
                        <form onSubmit={handleAddReview} className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
                            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Write a Review</h4>

                            {reviewError && <p className="text-xs text-red-500 font-medium">{reviewError}</p>}

                            <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-gray-600">Your Rating:</span>
                                <div className="flex gap-1.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            type="button"
                                            key={s}
                                            onClick={() => setRating(s)}
                                            className={`text-xl cursor-pointer transition transform hover:scale-110 ${s <= rating ? 'text-amber-400' : 'text-gray-300'}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <textarea
                                rows="3"
                                placeholder="Share your experience about this product..."
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                className="w-full text-sm p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                required
                            />

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition shadow-sm disabled:opacity-50 cursor-pointer"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    )}

                    {/* Reviews List & Admin Replies */}
                    <div className="space-y-4">
                        {reviewsList.length === 0 ? (
                            <p className="text-xs text-gray-400 italic py-2">No reviews yet. Be the first to review this product!</p>
                        ) : (
                            reviewsList.map((rev, index) => {
                                const userName =
                                    rev.user?.username ||
                                    rev.user?.name ||
                                    rev.userName ||
                                    rev.name ||
                                    'Anonymous User';

                                const reviewComment = rev.review || rev.comment || '';

                                return (
                                    <div key={rev._id || index} className="p-4 sm:p-5 bg-gray-50/60 rounded-2xl border border-gray-100 space-y-3 transition hover:bg-gray-50">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-gray-900">{userName}</span>
                                            <span className="text-amber-400 text-xs tracking-wider">
                                                {'★'.repeat(Number(rev.rating) || 0)}{'☆'.repeat(5 - Math.round(Number(rev.rating) || 0))}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">{reviewComment}</p>

                                        {/* Admin Reply Display */}
                                        {rev.adminReply && (
                                            <div className="mt-3 ml-4 p-3.5 bg-blue-50/80 border-l-4 border-blue-600 rounded-r-2xl space-y-1 shadow-sm">
                                                <div className="text-xs font-bold text-blue-900 uppercase tracking-wide">Store Response (Admin)</div>
                                                <p className="text-xs text-gray-700 leading-relaxed">{rev.adminReply}</p>
                                            </div>
                                        )}

                                        {/* Admin Reply Form (Only visible to Admin) */}
                                        {isAdmin && (
                                            <div className="pt-2">
                                                {replyingId === rev._id ? (
                                                    <div className="space-y-3 mt-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                                        <textarea
                                                            rows="2"
                                                            placeholder="Write an admin reply..."
                                                            value={adminReplies[rev._id] || ''}
                                                            onChange={(e) => setAdminReplies({ ...adminReplies, [rev._id]: e.target.value })}
                                                            className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                                        />
                                                        <div className="flex gap-2.5">
                                                            <button
                                                                onClick={() => handleAdminReplySubmit(rev._id)}
                                                                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition"
                                                            >
                                                                Send Reply
                                                            </button>
                                                            <button
                                                                onClick={() => setReplyingId(null)}
                                                                className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg cursor-pointer transition"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setReplyingId(rev._id)}
                                                        className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-semibold cursor-pointer inline-flex items-center gap-1 mt-1"
                                                    >
                                                        {rev.adminReply ? 'Edit Reply' : '💬 Reply as Admin'}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}