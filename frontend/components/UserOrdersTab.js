'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/lib/api';

export default function UserOrdersTab() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    // Selected order for popup modal
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchMyOrders();
    }, []);

    const fetchMyOrders = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await axios.get(`${API_URL}/api/orders/my-orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Fetch Orders Error:', err);
            setError('Failed to fetch order history.');
            setLoading(false);
        }
    };

    const handleCopyId = (e, id) => {
        e.stopPropagation(); // Prevents modal from opening when clicking copy
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Confirmed':
                return <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">Confirmed</span>;
            case 'Rejected':
                return <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full font-semibold">Rejected</span>;
            default:
                return <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-semibold">Pending</span>;
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Loading your orders...</div>;
    if (error) return <div className="p-8 text-center text-red-500 font-medium">{error}</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800">My Order History</h1>
                <p className="text-xs text-gray-400 mt-0.5">Track the status of your recent orders here</p>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white p-12 text-center text-gray-400 rounded-2xl border border-gray-100">
                    You have not placed any orders yet.
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map((order) => {
                        const shortId = `#ORD-${order._id.slice(-5).toUpperCase()}`;

                        return (
                            <div
                                key={order._id}
                                onClick={() => setSelectedOrder(order)}
                                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center cursor-pointer hover:border-blue-300 transition duration-200"
                            >
                                {/* Left Side: Order ID & Copy */}
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-gray-400">ORDER ID:</span>
                                    <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                                        {shortId}
                                    </span>
                                    <button
                                        onClick={(e) => handleCopyId(e, order._id)}
                                        className="text-[11px] text-gray-400 hover:text-blue-600 font-medium transition"
                                        title="Copy full ID"
                                    >
                                        {copiedId === order._id ? '✓ Copied' : '📋 Copy'}
                                    </button>
                                </div>

                                {/* Right Side: Date & Status & View Details button */}
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-gray-400">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </span>
                                    {getStatusBadge(order.status)}
                                    <button className="text-xs font-medium text-blue-600 hover:underline">
                                        View Details →
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* POPUP MODAL SCREEN */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">

                        {/* Modal Header */}
                        <div className="flex justify-between items-start border-b pb-3">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">
                                    Order Details
                                </h2>
                                <p className="text-xs text-gray-400 font-mono mt-0.5">
                                    #ORD-{selectedOrder._id.slice(-5).toUpperCase()} ({new Date(selectedOrder.createdAt).toLocaleDateString()})
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none p-1"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body: Order Status */}
                        <div className="flex justify-between items-center py-1">
                            <span className="text-xs font-bold text-gray-500">Status:</span>
                            {getStatusBadge(selectedOrder.status)}
                        </div>

                        {/* Modal Body: Order Items */}
                        <div className="border-t pt-3">
                            <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Ordered Items</h3>
                            <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto">
                                {selectedOrder.items?.map((item, idx) => (
                                    <div key={idx} className="py-2 flex justify-between text-sm">
                                        <span className="font-medium text-gray-800">{item.name} × {item.quantity}</span>
                                        <span className="font-semibold text-gray-600">${item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Modal Body: Order Total */}
                        <div className="flex justify-between items-center pt-3 border-t text-sm font-bold">
                            <span className="text-gray-600">Total Amount:</span>
                            <span className="text-blue-600 text-lg">${selectedOrder.totalAmount}</span>
                        </div>

                        {/* Modal Body: Rejection Reason (If Rejected) */}
                        {selectedOrder.status === 'Rejected' && selectedOrder.rejectionReason && (
                            <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-medium">
                                <strong>Reason for rejection:</strong> {selectedOrder.rejectionReason}
                            </div>
                        )}

                        {/* Modal Footer */}
                        <div className="pt-2 flex justify-end">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}