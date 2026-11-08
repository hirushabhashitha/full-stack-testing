'use client';
import { useState } from 'react';
import axios from 'axios';
import CustomModal from './CustomModal'; // CustomModal එක නිවැරදි Path එකෙන් import කරගන්න

export default function ProfileTab({ user, setUser, profileData, setProfileData }) {
  const [isEditing, setIsEditing] = useState(false);

  // Modal State Management
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');

  const showModal = (message, type = 'success') => {
    setModalMessage(message);
    setModalType(type);
    setModalOpen(true);
  };

  const handleStartEditing = () => {
    setProfileData({
      username: user?.username || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
    });
    setIsEditing(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken'); // ⭐ 'accessToken' ලෙස නිවැරදි කර ඇත

    try {
      const res = await axios.put('http://localhost:5000/api/auth/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setIsEditing(false);
      showModal('Profile updated successfully!', 'success'); // ⭐ Modal එක හරහා පෙන්වයි
    } catch (err) {
      console.error('Profile update error:', err);
      showModal('Error updating profile. Please try again.', 'error'); // ⭐ Modal එක හරහා පෙන්වයි
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>

      {!isEditing ? (
        <div className="flex flex-col gap-6 max-w-2xl">
          {/* Top Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl">
              <p className="text-xs font-bold text-blue-600 uppercase">Username</p>
              <p className="text-lg font-extrabold text-blue-900 mt-2">{user?.username}</p>
            </div>
            <div className="p-6 bg-green-50 border border-green-100 rounded-2xl">
              <p className="text-xs font-bold text-green-600 uppercase">Email Address</p>
              <p className="text-lg font-extrabold text-green-900 mt-2 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Bottom Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-purple-50 border border-purple-100 rounded-2xl">
              <p className="text-xs font-bold text-purple-600 uppercase">Phone Number</p>
              <p className="text-lg font-extrabold text-purple-900 mt-2">{user?.phone || 'Not specified'}</p>
            </div>
            <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl">
              <p className="text-xs font-bold text-amber-600 uppercase">Bio</p>
              <p className="text-sm font-semibold text-amber-900 mt-2 leading-relaxed">{user?.bio || 'No bio added yet.'}</p>
            </div>
          </div>

          <div className="flex gap-4 mt-2">
            <button
              onClick={handleStartEditing}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 text-sm"
            >
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpdateProfile} className="flex flex-col gap-5 max-w-lg bg-gray-50 p-6 rounded-2xl border border-gray-200">
          <div>
            <label className="block text-xs font-bold mb-1 text-gray-700 uppercase">Username</label>
            <input
              type="text"
              value={profileData?.username || ''}
              onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
              className="w-full p-3.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1 text-gray-700 uppercase">Phone Number</label>
            <input
              type="text"
              value={profileData?.phone || ''}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              className="w-full p-3.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1 text-gray-700 uppercase">Bio</label>
            <textarea
              value={profileData?.bio || ''}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              className="w-full p-3.5 bg-white border border-gray-300 rounded-xl text-sm h-28 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none"
            />
          </div>
          <div className="flex gap-3 mt-2">
            <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition text-sm shadow-md shadow-blue-600/20">
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 bg-white text-gray-700 border border-gray-300 font-semibold rounded-xl hover:bg-gray-100 transition text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ⭐ Custom Modal Component එක Pop-up පෙන්වීමට */}
      <CustomModal
        isOpen={modalOpen}
        type={modalType}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}