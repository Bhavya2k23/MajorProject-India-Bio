// ============================================================
// FILE: india-s-wild-explorer/src/hooks/useAdmin.ts  ← NEW FILE
// ============================================================
import { useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AdminState {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAdmin = () => {
  const [state, setState] = useState<AdminState>({
    admin: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // On mount: restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminStr = localStorage.getItem('adminUser');
    if (token && adminStr) {
      try {
        const admin = JSON.parse(adminStr);
        setState({ admin, token, isAuthenticated: true, isLoading: false });
      } catch {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setState((s) => ({ ...s, isLoading: false }));
      }
    } else {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await fetch(`${API_BASE}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Login failed');

    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminUser', JSON.stringify(data.admin));
    setState({ admin: data.admin, token: data.token, isAuthenticated: true, isLoading: false });
    return data.admin;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setState({ admin: null, token: null, isAuthenticated: false, isLoading: false });
  }, []);

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }, []);

  // Generic authenticated fetch
  const adminFetch = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    const defaultHeaders = getAuthHeaders();
    let finalHeaders = { ...defaultHeaders, ...(options.headers || {}) };

    if (options.body instanceof FormData) {
      delete finalHeaders['Content-Type'];
    }

    const res = await fetch(`${API_BASE}/admin${endpoint}`, {
      ...options,
      headers: finalHeaders,
    });
    let data;
    try {
      data = await res.json();
    } catch (err) {
      throw new Error(`Server returned non-JSON response (Status: ${res.status})`);
    }
    if (res.status === 401) {
      logout();
      throw new Error('Session expired. Please login again.');
    }
    if (!data.success) throw new Error(data.message || 'Request failed');
    return data;
  }, [getAuthHeaders, logout]);

  return { ...state, login, logout, adminFetch, getAuthHeaders };
};

export default useAdmin;