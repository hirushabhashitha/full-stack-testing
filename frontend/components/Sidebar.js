'use client';

export default function Sidebar({ activeTab, setActiveTab, user }) {
  const isAdmin = user?.role === 'admin';

  return (
    <aside className="dashboard-sidebar group relative h-auto sm:h-[calc(100vh-3rem)] sticky top-0 sm:top-6 w-full sm:w-20 sm:hover:w-64 bg-white rounded-2xl shadow-sm border border-gray-200 p-2 sm:p-4 flex flex-row sm:flex-col gap-2 transition-all duration-300 ease-in-out overflow-x-auto sm:overflow-hidden shrink-0 z-40">

      {/* 1. Dashboard Overview */}
      <button
        onClick={() => setActiveTab('overview')}
        className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-4 min-w-[78px] sm:min-w-0 w-full p-2 sm:p-3.5 rounded-xl font-semibold text-[10px] sm:text-sm transition ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        title="Dashboard Overview"
      >
        <span className="text-xl shrink-0">📊</span>
        <span className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Dashboard Overview
        </span>
      </button>

      {/* 2. Manage & Sell Products (Admin කෙනෙක් නම් පමණක් පෙන්වයි) */}
      {isAdmin && (
        <button
          onClick={() => setActiveTab('products')}
          className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-4 min-w-[78px] sm:min-w-0 w-full p-2 sm:p-3.5 rounded-xl font-semibold text-[10px] sm:text-sm transition ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          title="Manage Products"
        >
          <span className="text-xl shrink-0">📦</span>
          <span className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Manage Products
          </span>
        </button>
      )}

      {/* 3. Shop / Store */}
      <button
        onClick={() => setActiveTab('shop')}
        className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-4 min-w-[78px] sm:min-w-0 w-full p-2 sm:p-3.5 rounded-xl font-semibold text-[10px] sm:text-sm transition ${activeTab === 'shop' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        title="Shop"
      >
        <span className="text-xl shrink-0">🛒</span>
        <span className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Shop
        </span>
      </button>

      {/* 4. Orders Tab (User නම් 'My Orders' සහ Admin නම් 'Manage Orders' පෙන්වයි) */}
      {!isAdmin ? (
        <button
          onClick={() => setActiveTab('my-orders')}
          className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-4 min-w-[78px] sm:min-w-0 w-full p-2 sm:p-3.5 rounded-xl font-semibold text-[10px] sm:text-sm transition ${activeTab === 'my-orders' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          title="My Orders"
        >
          <span className="text-xl shrink-0">🛍️</span>
          <span className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            My Orders
          </span>
        </button>
      ) : (
        <button
          onClick={() => setActiveTab('admin-orders')}
          className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-4 min-w-[78px] sm:min-w-0 w-full p-2 sm:p-3.5 rounded-xl font-semibold text-[10px] sm:text-sm transition ${activeTab === 'admin-orders' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          title="Manage Orders"
        >
          <span className="text-xl shrink-0">📋</span>
          <span className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Manage Orders
          </span>
        </button>
      )}

      {/* 5. Manage Users (Admin කෙනෙක් නම් පමණක් පෙන්වයි) */}
      {isAdmin && (
        <button
          onClick={() => setActiveTab('users')}
          className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-4 min-w-[78px] sm:min-w-0 w-full p-2 sm:p-3.5 rounded-xl font-semibold text-[10px] sm:text-sm transition ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          title="Manage Users"
        >
          <span className="text-xl shrink-0">👥</span>
          <span className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Manage Users
          </span>
        </button>
      )}

      {/* 6. Profile Settings */}
      <button
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-4 min-w-[78px] sm:min-w-0 w-full p-2 sm:p-3.5 rounded-xl font-semibold text-[10px] sm:text-sm transition ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        title="Profile Settings"
      >
        <span className="text-xl shrink-0">👤</span>
        <span className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Profile Settings
        </span>
      </button>

    </aside>
  );
}