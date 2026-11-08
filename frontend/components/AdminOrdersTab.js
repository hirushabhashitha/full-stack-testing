'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/lib/api';

export default function AdminOrdersTab() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    // Selected order for details modal
    const [detailsModalOrder, setDetailsModalOrder] = useState(null);

    // Custom Rejection Modal States
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const fetchAllOrders = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await axios.get(`${API_URL}/api/orders/admin/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Fetch All Orders Error:', err);
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus, reason = '') => {
        setUpdatingId(orderId);
        try {
            const token = localStorage.getItem('accessToken');
            await axios.put(
                `${API_URL}/api/orders/admin/${orderId}/status`,
                { status: newStatus, rejectionReason: reason },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Refresh orders list
            await fetchAllOrders();

            setRejectModalOpen(false);
            setRejectionReason('');
            setDetailsModalOrder(null); // Close details modal after action
        } catch (err) {
            console.error('Update Order Error:', err);
            alert('Failed to update order status.');
        } finally {
            setUpdatingId(null);
        }
    };

    const openRejectModal = (orderId, e) => {
        if (e) e.stopPropagation();
        setSelectedOrderId(orderId);
        setRejectionReason('');
        setRejectModalOpen(true);
    };

    const handleCopyId = (e, id) => {
        e.stopPropagation();
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (loading) {
        return (
            <div className="p-8 text-center text-gray-500 font-medium">
                Loading admin order list...
            </div>
        );
    }

    return (
        <div className="p-2 sm:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800">Admin Order Management</h1>
                <p className="text-xs text-gray-400 mt-0.5">
                    Review, confirm, or reject incoming customer orders
                </p>
            </div>

            {/* Orders Summary List */}
            <div className="space-y-3">
                {orders.length === 0 ? (
                    <div className="bg-white p-12 text-center text-gray-400 rounded-2xl border border-gray-100">
                        No orders found.
                    </div>
                ) : (
                    orders.map((order) => {
                        const shortId = `#ORD-${order._id.slice(-5).toUpperCase()}`;

                        return (
                            <div
                                key={order._id}
                                onClick={() => setDetailsModalOrder(order)}
                                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:border-blue-300 transition duration-200"
                            >
                                {/* Left Side: Order ID, Name, Phone */}
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex items-center gap-2">
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

                                    <div className="text-xs font-semibold text-gray-700 border-l pl-4 border-gray-200">
                                        Name: <span className="text-gray-900 font-bold">{order.user?.username || 'Guest'}</span>
                                    </div>

                                    <div className="text-xs font-semibold text-gray-700 border-l pl-4 border-gray-200">
                                        Phone: <span className="text-gray-900 font-mono">{order.shippingAddress?.phone || 'N/A'}</span>
                                    </div>
                                </div>

                                {/* Right Side: Status Badge & View Details */}
                                <div className="flex items-center gap-3 self-end md:self-auto">
                                    <span
                                        className={`text-xs font-bold px-3 py-1 rounded-full ${order.status === 'Confirmed'
                                            ? 'bg-green-100 text-green-700'
                                            : order.status === 'Rejected'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                            }`}
                                    >
                                        {order.status}
                                    </span>
                                    <button className="text-xs font-medium text-blue-600 hover:underline">
                                        View Details →
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* FULL ORDER DETAILS POPUP MODAL */}
            {detailsModalOrder && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">

                        {/* Header */}
                        <div className="flex justify-between items-start border-b pb-3">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">Order Details</h2>
                                <p className="text-xs text-gray-400 font-mono mt-0.5">
                                    #ORD-{detailsModalOrder._id.slice(-5).toUpperCase()}
                                </p>
                            </div>
                            <button
                                onClick={() => setDetailsModalOrder(null)}
                                className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1 leading-none"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Customer & Shipping Details */}
                        <div className="bg-gray-50 p-3.5 rounded-xl text-xs space-y-1 text-gray-700 border border-gray-100">
                            <div><strong>Customer:</strong> {detailsModalOrder.user?.username || 'Guest'} ({detailsModalOrder.user?.email || 'N/A'})</div>
                            <div><strong>Phone:</strong> {detailsModalOrder.shippingAddress?.phone || 'N/A'}</div>
                            <div><strong>Address:</strong> {detailsModalOrder.shippingAddress?.address}, {detailsModalOrder.shippingAddress?.city}</div>
                        </div>

                        {/* Items List */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ordered Items</h3>
                            <div className="divide-y divide-gray-100 max-h-40 overflow-y-auto pr-1">
                                {detailsModalOrder.items?.map((item, idx) => (
                                    <div key={idx} className="py-2 flex justify-between text-xs text-gray-700">
                                        <span className="font-medium">{item.name} (x{item.quantity})</span>
                                        <span className="font-semibold">${item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Total & Status */}
                        <div className="flex justify-between items-center border-t pt-3 text-sm font-bold">
                            <span className="text-gray-600">Total Amount:</span>
                            <span className="text-blue-600 text-lg">${detailsModalOrder.totalAmount}</span>
                        </div>

                        {/* Rejection Reason (If Rejected) */}
                        {detailsModalOrder.status === 'Rejected' && detailsModalOrder.rejectionReason && (
                            <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-medium">
                                <strong>Rejection Reason:</strong> {detailsModalOrder.rejectionReason}
                            </div>
                        )}

                        {/* Action Buttons inside Modal */}
                        <div className="flex justify-end gap-2 border-t pt-4">
                            {detailsModalOrder.status === 'Pending' ? (
                                <>
                                    <button
                                        disabled={updatingId === detailsModalOrder._id}
                                        onClick={() => openRejectModal(detailsModalOrder._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow disabled:opacity-50"
                                    >
                                        Reject Order
                                    </button>
                                    <button
                                        disabled={updatingId === detailsModalOrder._id}
                                        onClick={() => handleUpdateStatus(detailsModalOrder._id, 'Confirmed')}
                                        className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow disabled:opacity-50"
                                    >
                                        Confirm Order
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setDetailsModalOrder(null)}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
                                >
                                    Close
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            )}

            {/* Custom Rejection Modal */}
            {rejectModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800">Reject Order</h3>
                        <p className="text-xs text-gray-500">
                            Please state the reason for rejection (this will be visible to the customer):
                        </p>
                        <textarea
                            rows="3"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="E.g., Out of stock / Invalid shipping details"
                            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setRejectModalOpen(false)}
                                className="px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() =>
                                    handleUpdateStatus(selectedOrderId, 'Rejected', rejectionReason || 'Out of stock')
                                }
                                className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow transition"
                            >
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}