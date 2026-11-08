import axios from 'axios';
import { API_URL } from '@/lib/api';

const ADMIN_API_URL = `${API_URL}/api/admin`;

// සියලුම Users ලා ලබා ගැනීම
export const getAllUsers = async () => {
    const token = localStorage.getItem('accessToken'); // 👈 මෙතැන 'accessToken' ලෙස ලබා දී ඇත
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${ADMIN_API_URL}/users`, config);
    return response.data;
};

// User කෙනෙකුගේ Status එක (Active/Block) මාරු කිරීම
export const toggleUserStatus = async (userId) => {
    const token = localStorage.getItem('accessToken'); // 👈 මෙතැනත්
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${ADMIN_API_URL}/users/${userId}/status`, {}, config);
    return response.data;
};

// User කෙනෙකු මකා දැමීම
export const deleteUser = async (userId) => {
    const token = localStorage.getItem('accessToken'); // 👈 මෙතැනත්
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(`${ADMIN_API_URL}/users/${userId}`, config);
    return response.data;
};