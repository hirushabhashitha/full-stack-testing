'use client';
import { useState, useEffect } from 'react';
import { getAllUsers, toggleUserStatus, deleteUser } from './adminServices';

export default function UserManagementTab() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal සඳහා අවශ්‍ය State 
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleStatus = async (userId) => {
        try {
            await toggleUserStatus(userId);
            fetchUsers(); // Refresh list automatically
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    // Delete බටන් එක එබූ විට Modal එක පෙන්වීම
    const confirmDelete = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    // Modal එකේ Confirm කළ විට ඇත්තටම Delete වීම
    const handleDeleteConfirmed = async () => {
        if (!userToDelete) return;
        try {
            await deleteUser(userToDelete._id);
            setShowDeleteModal(false);
            setUserToDelete(null);
            fetchUsers(); // Refresh list automatically
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    if (loading) {
        return <div className="p-6 text-center">Loading users...</div>;
    }

    return (
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200 relative">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">User Management</h2>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                            <th className="p-3">Username</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 text-sm">
                                <td className="p-3 font-medium text-gray-800">{user.username}</td>
                                <td className="p-3 text-gray-600">{user.email}</td>
                                <td className="p-3">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.status === 'blocked' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                        {user.status === 'blocked' ? 'Blocked' : 'Active'}
                                    </span>
                                </td>
                                <td className="p-3 text-center space-x-2">
                                    <button
                                        onClick={() => handleToggleStatus(user._id)}
                                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-medium transition cursor-pointer"
                                    >
                                        Toggle Status
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(user)}
                                        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Custom Delete Confirmation Popup Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4 border border-gray-100 animate-in fade-in zoom-in duration-200">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                !
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete User</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Are you sure you want to delete <span className="font-semibold text-gray-700">{userToDelete?.username}</span>? This action cannot be undone.
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirmed}
                                    className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-red-500/20"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}