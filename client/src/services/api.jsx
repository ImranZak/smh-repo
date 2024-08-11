import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

// User API
export const getUser = () => api.get('/user');

// Friends API
export const getFriends = (userId) => api.get(`/friends/${userId}`);
export const addFriend = (userId, friendData) => api.post(`/friends/${userId}`, friendData);

// Messages API
export const getMessages = (userId) => api.get(`/messages/${userId}`);
export const sendMessage = (userId, messageData) => api.post(`/messages/${userId}`, messageData);

// Notifications API
export const getNotifications = (userId) => api.get(`/notifications/${userId}`);

// Dashboard Layout API
export const getDashboardLayout = (userId) => api.get(`/dashboard-layout/${userId}`);
export const saveDashboardLayout = (userId, layoutData) => api.post(`/dashboard-layout/${userId}`, layoutData);

export default api;
