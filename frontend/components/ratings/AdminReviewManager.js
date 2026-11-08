'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import StarRating from './StarRating';
import { API_URL } from '@/lib/api';

export default function AdminReviewManager({ productId, productName }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState({});
    const [submittingId, setSubmittingId] = useState(null);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/products/${productId}/ratings`);
            setReviews(res.data);
        } catch (err) {
            console.error('Error fetching reviews for admin:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) fetchReviews();
    }, [productId]);

    // Admin Reply එක දැමීම (PUT /api/admin/ratings/:ratingId/reply)
    const handleReplySubmit = async (ratingId) => {
        const reply = replyText[ratingId];
        if (!reply) return;

        try {
            setSubmittingId(ratingId);
            const token = localStorage.getItem('accessToken');
            await axios.put(
                `${API_URL}/api/admin/ratings/${ratingId}/reply`,
                { adminReply: reply },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setReplyText({ ...replyText, [ratingId]: '' });
            fetchReviews(); // List එක Refresh කිරීම
        } catch (err) {
            console.error('Reply error:', err);
            alert('Admin reply එක යැවීමට අපොහොසත් විය.');
        } finally {
            setSubmittingId(null);
        }
    };

    // Review එක මකා දැමීම (DELETE /api/admin/ratings/:ratingId)
    const handleDeleteReview = async (ratingId) => {
        if (!confirm('මෙම Review එක මකා දැමීමට අවශ්‍ය බව নিশ্চিতද?')) return;

        try {
            const token = localStorage.getItem('accessToken');
            await axios.delete(`${API_URL}/api/admin/ratings/${ratingId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchReviews();
        } catch (err) {
            console.error('Delete error:', err);
            alert('Review එක මකා දැමීමට අපොහොසත් විය.');
        }
    };

    return (
        <div className="space-y-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <h3 className="font-bold text-gray-800 text-sm">Manage Reviews: {productName} (Admin Mode)</h3>

            {loading ? (
                <p className="text-xs text-gray-400 text-center py-4">Reviews ලබාගනිමින් පවතී...</p>
            ) : reviews.length === 0 ? (
                <p className="text-xs text-gray-400 py-3 text-center bg-white rounded-xl">මෙම නිෂ්පාදනය සඳහා Reviews කිසිවක් නොමැත.</p>
            ) : (
                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                    {reviews.map((rev) => (
                        <div key={rev._id} className="p-3.5 bg-white rounded-xl border border-gray-200 text-xs space-y-2 shadow-sm">
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="font-semibold text-gray-800">{rev.user?.username || 'Customer'}</span>
                                    <span className="text-[10px] text-gray-400 ml-2">({rev.user?.email})</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <StarRating rating={rev.rating} readOnly={true} size="sm" />
                                    <button
                                        onClick={() => handleDeleteReview(rev._id)}
                                        className="text-red-500 hover:text-red-700 font-medium text-[11px] px-2 py-1 bg-red-50 rounded-lg transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <p className="text-gray-700 font-medium">{rev.review}</p>

                            {/* පවතින Admin Reply එක පෙන්වීම */}
                            {rev.adminReply && (
                                <div className="p-2 bg-blue-50 border-l-2 border-blue-500 rounded-r text-[11px] text-gray-700">
                                    <span className="font-bold text-blue-600">Admin Reply: </span>
                                    {rev.adminReply}
                                </div>
                            )}

                            {/* Admin Reply ලිවීමේ Box එක */}
                            <div className="pt-2 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Write a reply as admin..."
                                    value={replyText[rev._id] || ''}
                                    onChange={(e) => setReplyText({ ...replyText, [rev._id]: e.target.value })}
                                    className="flex-1 text-xs p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <button
                                    onClick={() => handleReplySubmit(rev._id)}
                                    disabled={submittingId === rev._id}
                                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-[11px] rounded-lg transition disabled:opacity-50"
                                >
                                    {submittingId === rev._id ? 'Sending...' : 'Reply'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}