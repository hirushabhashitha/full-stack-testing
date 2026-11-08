'use client';

export default function OverviewTab({ username, totalProducts }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome Back, {username}! 👋</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl">
          <p className="text-xs font-bold text-blue-600 uppercase">Total Listed Products</p>
          <p className="text-3xl font-extrabold text-blue-900 mt-2">{totalProducts}</p>
        </div>
        <div className="p-6 bg-green-50 border border-green-100 rounded-2xl">
          <p className="text-xs font-bold text-green-600 uppercase">Total Sales</p>
          <p className="text-3xl font-extrabold text-green-900 mt-2">$2,450.00</p>
        </div>
        <div className="p-6 bg-purple-50 border border-purple-100 rounded-2xl">
          <p className="text-xs font-bold text-purple-600 uppercase">Active Orders</p>
          <p className="text-3xl font-extrabold text-purple-900 mt-2">14</p>
        </div>
      </div>
    </div>
  );
}