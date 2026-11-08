import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

// සියලුම Users ලා ලබා ගැනීම
export const getAllUsers = async () => {
    const token = localStorage.getItem('accessToken'); // 👈 මෙතැන 'accessToken' ලෙස ලබා දී ඇත
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${API_URL}/users`, config);
    return response.data;
};

// User කෙනෙකුගේ Status එක (Active/Block) මාරු කිරීම
export const toggleUserStatus = async (userId) => {
    const token = localStorage.getItem('accessToken'); // 👈 මෙතැනත්
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${API_URL}/users/${userId}/status`, {}, config);
    return response.data;
};

// User කෙනෙකු මකා දැමීම
export const deleteUser = async (userId) => {
    const token = localStorage.getItem('accessToken'); // 👈 මෙතැනත්
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(`${API_URL}/users/${userId}`, config);
    return response.data;
};