'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import Sidebar from '@/components/Sidebar';
import OverviewTab from '@/components/OverviewTab';
import ProductTab from '@/components/ProductTab';
import ProfileTab from '@/components/ProfileTab';
import ShopTab from '@/components/ShopTab';
import UserOrdersTab from '@/components/UserOrdersTab';
import AdminOrdersTab from '@/components/AdminOrdersTab';
import UserManagementTab from '@/components/UserManagementTab';


export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState({ username: '', phone: '', bio: '' });
  const [products, setProducts] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 1. Fetch Profile Data
        const userRes = await axios.get('http://localhost:5000/api/auth/profile', config);
        const userData = userRes.data;
        setUser(userData);
        setProfileData({
          username: userData.username || '',
          phone: userData.phone || '',
          bio: userData.bio || ''
        });

        // 2. Admin කෙනෙක් නම් පමණක් Products fetch කරගැනීම
        if (userData.role === 'admin') {
          const productRes = await axios.get('http://localhost:5000/api/products', config);
          setProducts(productRes.data);
        }

      } catch (err) {
        console.error("Auth or Fetch Error:", err.response?.data || err.message);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setUser(null);
          window.location.href = '/login';
        }
      }
    };
    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.clear();
    setUser(null);
    window.location.href = '/?logout=success';
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* TOP HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white font-bold p-2.5 rounded-xl text-xl">SP</div>
          <span className="text-xl font-bold text-gray-800">Seller Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">{user.username}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition border border-red-200"
          >
            Logout
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 w-full p-6 gap-6 items-start justify-start">

        {/* SIDEBAR COMPONENT */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 min-w-0">
          {activeTab === 'overview' && (
            <OverviewTab username={user.username} totalProducts={products.length} />
          )}

          {/* Admin කෙනෙක් නම් පමණක් Product Tab එක පෙන්වයි */}
          {activeTab === 'products' && user.role === 'admin' && (
            <ProductTab products={products} setProducts={setProducts} />
          )}

          {activeTab === 'my-orders' && user?.role !== 'admin' && <UserOrdersTab />}
          {activeTab === 'admin-orders' && user?.role === 'admin' && <AdminOrdersTab />}

          {activeTab === 'shop' && <ShopTab user={user} />}

          {activeTab === 'profile' && (
            <ProfileTab
              user={user}
              setUser={setUser}
              profileData={profileData}
              setProfileData={setProfileData}
            />
          )}
          {activeTab === 'users' && <UserManagementTab />}


        </main>
      </div>
    </div>
  );
}