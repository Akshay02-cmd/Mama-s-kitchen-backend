# Frontend Integration Guide

## Overview

This guide helps frontend developers integrate with the Mama's Kitchen Backend API.

---

## 🔌 API Connection Setup

### Base Configuration

```javascript
// config/api.js
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};

export default API_CONFIG;
```

### Axios Setup (Recommended)

```javascript
// services/api.js
import axios from 'axios';
import API_CONFIG from '../config/api';

const api = axios.create(API_CONFIG);

// Request interceptor - Add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 🔐 Authentication Service

### Auth Service Implementation

```javascript
// services/authService.js
import api from './api';

class AuthService {
  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise}
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success) {
        // Token is in cookie, but you can also extract from response
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * Login user
   * @param {Object} credentials - Email, password, role
   * @returns {Promise}
   */
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  /**
   * Get current user
   * @returns {Object|null}
   */
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getCurrentUser();
  }

  /**
   * Check if user has specific role
   * @param {string} role - CUSTOMER or OWNER
   * @returns {boolean}
   */
  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.role === role;
  }
}

export default new AuthService();
```

---

## 👤 Profile Service

```javascript
// services/profileService.js
import api from './api';

class ProfileService {
  /**
   * Create customer profile
   */
  async createCustomerProfile(data) {
    const response = await api.post('/profile/customer', data);
    return response.data;
  }

  /**
   * Get customer profile
   */
  async getCustomerProfile() {
    const response = await api.get('/profile/customer');
    return response.data;
  }

  /**
   * Update customer profile
   */
  async updateCustomerProfile(data) {
    const response = await api.put('/profile/customer', data);
    return response.data;
  }

  /**
   * Create owner profile
   */
  async createOwnerProfile(data) {
    const response = await api.post('/profile/owner', data);
    return response.data;
  }

  /**
   * Get owner profile
   */
  async getOwnerProfile() {
    const response = await api.get('/profile/owner');
    return response.data;
  }

  /**
   * Update owner profile
   */
  async updateOwnerProfile(data) {
    const response = await api.put('/profile/owner', data);
    return response.data;
  }
}

export default new ProfileService();
```

---

## 🍽️ Mess Service

```javascript
// services/messService.js
import api from './api';

class MessService {
  /**
   * Get all messes
   */
  async getAllMesses() {
    const response = await api.get('/mess');
    return response.data;
  }

  /**
   * Get single mess
   */
  async getMess(messId) {
    const response = await api.get(`/mess/${messId}`);
    return response.data;
  }

  /**
   * Create mess (Owner only)
   */
  async createMess(data) {
    const response = await api.post('/mess', data);
    return response.data;
  }

  /**
   * Update mess (Owner only)
   */
  async updateMess(messId, data) {
    const response = await api.put(`/mess/${messId}`, data);
    return response.data;
  }

  /**
   * Delete mess (Owner only)
   */
  async deleteMess(messId) {
    const response = await api.delete(`/mess/${messId}`);
    return response.data;
  }
}

export default new MessService();
```

---

## 🥘 Meal Service

```javascript
// services/mealService.js
import api from './api';

class MealService {
  /**
   * Get all meals for a mess
   */
  async getMeals(messId) {
    const response = await api.get(`/mess/${messId}/meals`);
    return response.data;
  }

  /**
   * Get single meal
   */
  async getMeal(messId, mealId) {
    const response = await api.get(`/mess/${messId}/meals/${mealId}`);
    return response.data;
  }

  /**
   * Create meal (Owner only)
   */
  async createMeal(messId, data) {
    const response = await api.post(`/mess/${messId}/meals`, data);
    return response.data;
  }

  /**
   * Update meal (Owner only)
   */
  async updateMeal(messId, mealId, data) {
    const response = await api.put(`/mess/${messId}/meals/${mealId}`, data);
    return response.data;
  }

  /**
   * Delete meal (Owner only)
   */
  async deleteMeal(messId, mealId) {
    const response = await api.delete(`/mess/${messId}/meals/${mealId}`);
    return response.data;
  }
}

export default new MealService();
```

---

## 🎣 React Hooks Examples

### useAuth Hook

```javascript
// hooks/useAuth.js
import { useState, useEffect } from 'react';
import authService from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    hasRole: (role) => user?.role === role,
    login,
    register,
    logout
  };
};
```

### useMesses Hook

```javascript
// hooks/useMesses.js
import { useState, useEffect } from 'react';
import messService from '../services/messService';

export const useMesses = () => {
  const [messes, setMesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMesses();
  }, []);

  const fetchMesses = async () => {
    try {
      setLoading(true);
      const data = await messService.getAllMesses();
      setMesses(data.messes);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch messes');
    } finally {
      setLoading(false);
    }
  };

  return { messes, loading, error, refetch: fetchMesses };
};
```

---

## 🛡️ Protected Route Component

```javascript
// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, hasRole, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

---

## 📝 Form Examples

### Login Form

```javascript
// components/LoginForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'CUSTOMER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Password"
        required
      />
      <select
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
      >
        <option value="CUSTOMER">Customer</option>
        <option value="OWNER">Owner</option>
      </select>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
```

---

## ⚠️ Error Handling

### Global Error Handler

```javascript
// utils/errorHandler.js
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.errors?.join(', ') || data.message || 'Invalid request';
      case 401:
        return 'Please login to continue';
      case 403:
        return 'You do not have permission to perform this action';
      case 404:
        return 'Resource not found';
      case 500:
        return 'Server error. Please try again later';
      default:
        return data.message || 'Something went wrong';
    }
  } else if (error.request) {
    // Request made but no response
    return 'Network error. Please check your connection';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};
```

---

## 🎨 TypeScript Types (Optional)

```typescript
// types/index.ts

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'OWNER';
}

export interface Profile {
  _id: string;
  userId: string;
  phone: string;
  address: string;
  isProfileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Mess {
  _id: string;
  ownerId: string;
  name: string;
  area: string;
  phone: string;
  address: string;
  description: string;
  is_Active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Meal {
  _id: string;
  messId: string;
  name: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  is_Veg: boolean;
  description: string;
  price: number;
  is_Available: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

## 🔗 Environment Variables

```env
# .env.local (Frontend)
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

---

## 📱 Mobile App Integration (React Native)

```javascript
// services/api.js (React Native)
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Change for production
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

export default api;
```

---

## 🚀 Production Deployment

### Environment Variables
```javascript
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.mamaskitchen.com'
  : 'http://localhost:5000';
```

### CORS Configuration
Backend will need to whitelist your frontend domain:
```javascript
// Backend: app.js (to be added)
const corsOptions = {
  origin: ['https://mamaskitchen.com', 'https://www.mamaskitchen.com'],
  credentials: true
};
```

---

## 📞 Support

- Backend API Docs: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- Issues: [GitHub Issues](https://github.com/Akshay02-cmd/Mama-s-kitchen-backend/issues)
- Maintainer: [@Akshay02-cmd](https://github.com/Akshay02-cmd)

---

**Last Updated:** January 13, 2026
