import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

if (typeof window !== 'undefined') {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

export const login = (credentials: { username: string; password: string }) => {
  return api.post('/auth/login', credentials);
};

export const register = (userData: {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}) => {
  return api.post('/auth/register', userData);
};

export const getPackageById = (id: number) => {
  return api.get(`/packages/${id}`);
};


export const getBookings = () => {
  return api.get('/bookings');
};

export const createBooking = (bookingData: {
  packageId: number;
  numberOfTravelers: number;
}) => {
  return api.post('/bookings', bookingData);
};

export const deleteBooking = (id: number) => {
  return api.delete(`/bookings/${id}`);
};

export const updateBooking = (id: number, bookingData: {
  packageId?: number;
  numberOfTravelers?: number;
}) => {
  return api.patch(`/bookings/${id}`, bookingData);
};

export const getUserProfile = () => {
  return api.get('/users/profile');
};

export const updateUserProfile = (userData: {}) => {
  return api.patch('/users', userData);
};

export const deleteUserProfile = () => {
  return api.delete('/users');
};

export const getComments = (packageId: number) => {
  return api.get(`/comments/${packageId}`);
};

export const addComment = (packageId: number, commentData: {
  packageId: number;
  content: string;
}) => {
  return api.post('/comments', commentData);
};

export const deleteComment = (commentId: number) => {
  return api.delete(`/comments/${commentId}`);
};

export const findAllWithFilters = (filters: {
  destination?: string;
  minPrice?: string;
  maxPrice?: string;
  startDate?: string;
  endDate?: string;
}) => {
  return api.get('/packages', { params: filters });
};


export const getUserBookings = (userId: number) => {
  return api.get(`/bookings/user/${userId}`);
};

export const createPackage = (packageData: {
  name: string;
  description: string;
  price: number;
  startDate: string;
  endDate: string;
  destination: string;
}) => {
  return api.post('/packages', packageData);
};

export const updatePackage = (id: number, packageData: {
  name?: string;
  description?: string;
  price?: number;
  startDate?: string;
  endDate?: string;
  destination?: string;
}) => {
  return api.patch(`/packages/${id}`, packageData);
};

export const deletePackage = (id: number) => {
  return api.delete(`/packages/${id}`);
};

export default api;
