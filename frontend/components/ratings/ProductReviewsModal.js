// components/ratings/ProductReviewsModal.js
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import StarRating from './StarRating';

export default function ProductReviewsModal({ productId, productName, user, isOpen, onClose, onReviewSubmitted }) {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState(null);

    // States para ti Admin Reply
    const [replyText, setReplyText] = useState({});
    const [submittingReplyId, setSubmittingReplyId] = useState(null);

    // State para ti Professional Delete Confirmation Modal
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const isAdmin = user?.role === 'admin';

    const fetchReviews = async () => {
        try {
            setFetching(true);
            const res = await axios.get(`http://localhost:5000/api/products/${productId}/ratings`);
            setReviews(res.data || []);
        } catch (err) {
            console.error('Error fetching reviews:', err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        if (isOpen && productId) {
            fetchReviews();
        }
    }, [isOpen, productId]);

    // Logged-in user මේ product එකට මීට පෙර review එකක් දීලා තියෙනවද බැලීම
    const existingUserReview = reviews.find(
        (rev) => (rev.user?._id || rev.user?.id || rev.user) === (user?._id || user?.id)
    );

    // Modal එක open වෙද්දී හෝ reviews load වෙද්දී, user ගේ කලින් review එකක් තියෙනවා නම් form එකට auto-fill කිරීම
    useEffect(() => {
        if (existingUserReview) {
            setRating(existingUserReview.rating);
            setReviewText(existingUserReview.review || existingUserReview.comment || '');
        } else {
            setRating(5);
            setReviewText('');
        }
    }, [existingUserReview, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('accessToken');
            await axios.post(
                `http://localhost:5000/api/products/${productId}/ratings`,
                { rating, review: reviewText },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            await fetchReviews(); // Modal එක ඇතුළේ reviews list එක instant update කරගැනීමට
            if (onReviewSubmitted) onReviewSubmitted(); // Shop catalog card එකේ count/stars update කිරීමට
        } catch (err) {
            setError(err.response?.data?.message || 'Review එක ඇතුළත් කිරීමට නොහැකි විය.');
        } finally {
            setLoading(false);
        }
    };

    const handleAdminReply = async (ratingId) => {
        const reply = replyText[ratingId];
        if (!reply) return;

        try {
            setSubmittingReplyId(ratingId);
            const token = localStorage.getItem('accessToken');
            await axios.put(
                `http://localhost:5000/api/admin/ratings/${ratingId}/reply`,
                { adminReply: reply },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setReplyText({ ...replyText, [ratingId]: '' });
            fetchReviews();
        } catch (err) {
            console.error('Admin reply error:', err);
            alert('Reply එක යැවීමට අපොහොසත් විය.');
        } finally {
            setSubmittingReplyId(null);
        }
    };

    const confirmDelete = (ratingId) => {
        setReviewToDelete(ratingId);
        setDeleteModalOpen(true);
    };

    const handleDeleteExecute = async () => {
        if (!reviewToDelete) return;
        setDeleting(true);

        try {
            const token = localStorage.getItem('accessToken');
            await axios.delete(`http://localhost:5000/api/admin/ratings/${reviewToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDeleteModalOpen(false);
            setReviewToDelete(null);
            fetchReviews();
            if (onReviewSubmitted) onReviewSubmitted();
        } catch (err) {
            console.error('Delete error:', err);
            alert('Review එක මකා දැමීමට අපොහොසත් විය.');
        } finally {
            setDeleting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">

                    {/* Modal Header */}
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <div>
                            <h3 className="font-bold text-gray-800 text-base">
                                {isAdmin ? 'Manage Reviews (Admin)' : 'Reviews & Ratings'}
                            </h3>
                            <p className="text-xs text-gray-500 capitalize">{productName}</p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg text-lg leading-none cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-5 overflow-y-auto space-y-5 flex-1">

                        {/* Customer Reviews List (සියලු දෙනාගේම reviews මෙහි පෙනේ) */}
                        <div>
                            <h4 className="font-semibold text-xs text-gray-700 uppercase tracking-wider mb-3">
                                {isAdmin ? 'All Customer Reviews' : 'Customer Reviews'}
                            </h4>
                            {fetching ? (
                                <p className="text-xs text-gray-400 text-center py-4">Reviews ලබාගනිමින් පවතී...</p>
                            ) : reviews.length === 0 ? (
                                <p className="text-xs text-gray-400 py-3 text-center bg-gray-50 rounded-xl">තවම Reviews කිසිවක් නැත.</p>
                            ) : (
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                    {reviews.map((rev) => (
                                        <div key={rev._id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-gray-800">{rev.user?.username || 'Customer'}</span>
                                                <div className="flex items-center gap-2">
                                                    <StarRating rating={rev.rating} readOnly={true} size="sm" />
                                                    {isAdmin && (
                                                        <button
                                                            onClick={() => confirmDelete(rev._id)}
                                                            className="text-red-500 hover:text-red-700 font-medium text-[11px] px-2 py-0.5 bg-red-50 rounded border border-red-200 cursor-pointer"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-gray-600">{rev.review}</p>

                                            {rev.adminReply ? (
                                                <div className="mt-2 p-2.5 bg-blue-50 border-l-2 border-blue-500 rounded-r-lg text-[11px] text-gray-700">
                                                    <span className="font-bold text-blue-600 block mb-0.5">Admin Reply:</span>
                                                    {rev.adminReply}
                                                </div>
                                            ) : (
                                                isAdmin && (
                                                    <div className="pt-2 flex gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Write a reply as admin..."
                                                            value={replyText[rev._id] || ''}
                                                            onChange={(e) => setReplyText({ ...replyText, [rev._id]: e.target.value })}
                                                            className="flex-1 text-xs p-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        />
                                                        <button
                                                            onClick={() => handleAdminReply(rev._id)}
                                                            disabled={submittingReplyId === rev._id}
                                                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-[11px] rounded-lg transition disabled:opacity-50 cursor-pointer"
                                                        >
                                                            {submittingReplyId === rev._id ? 'Sending...' : 'Reply'}
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Add or Edit Review Form (සෑම පාරිභෝගිකයෙකුටම එක review එකක් පමණි) */}
                        {!isAdmin && (
                            <form onSubmit={handleSubmit} className="space-y-3 pt-4 border-t border-gray-100">
                                <h4 className="font-bold text-xs text-gray-800">
                                    {existingUserReview ? 'Edit Your Review' : 'Write a Review'}
                                </h4>
                                {error && <div className="text-red-500 text-xs bg-red-50 p-2 rounded-lg">{error}</div>}

                                <div>
                                    <label className="block text-[11px] font-medium text-gray-500 mb-1">Select Rating</label>
                                    <StarRating rating={rating} readOnly={false} size="md" onRateChange={(val) => setRating(val)} />
                                </div>

                                <div>
                                    <textarea
                                        rows={3}
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        placeholder="භාණ්ඩය ගැන ඔබේ අදහස ලියන්න..."
                                        className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl transition shadow-sm disabled:opacity-50 cursor-pointer"
                                >
                                    {loading ? 'Submitting...' : (existingUserReview ? 'Update Review' : 'Submit Review')}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Professional Custom Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4 border border-gray-100">
                        <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                            ⚠️
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-base">Delete Review?</h3>
                            <p className="text-xs text-gray-500 mt-1">
                                මෙම Review එක සදාකාලිකවම මකා දැමීමට අවශ්‍ය බව ස්ථිරද?
                            </p>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setDeleteModalOpen(false)}
                                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteExecute}
                                deleting={deleting}
                                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50"
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}