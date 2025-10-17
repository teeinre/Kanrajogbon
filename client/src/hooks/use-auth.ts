import { createContext, useContext, useState, useEffect, ReactNode, createElement } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void; // Added setUser to the type
  getToken: () => string | null; // Add getToken method
  refreshToken: () => Promise<string | null>; // Add refreshToken method
  refreshAuthToken: () => Promise<boolean>; // Add manual refresh function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'findermeister_token';

const AuthService = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  async register(data: any) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const result = await response.json();
    this.setToken(result.token);
    return result;
  },

  async login(data: any) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const result = await response.json();
    this.setToken(result.token);
    return result;
  },

  async getCurrentUser() {
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('/api/auth/me', {
      headers: this.getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token is invalid or expired, clear it
        this.clearToken();
      }
      const error = new Error('Failed to get current user');
      (error as any).status = response.status;
      throw error;
    }

    return response.json();
  },

  logout(): void {
    this.clearToken();
  },

  async refreshToken(): Promise<string | null> {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        // Refresh failed, clear token
        this.clearToken();
        return null;
      }

      const result = await response.json();
      if (result.token) {
        this.setToken(result.token);
        return result.token;
      }
      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearToken();
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated()); // Initialize with token check
  const queryClient = useQueryClient();

  // Manual token refresh function for components
  const refreshAuthToken = async () => {
    try {
      const newToken = await AuthService.refreshToken();
      if (newToken) {
        // Refetch user data to ensure it's fresh
        queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Manual token refresh failed:', error);
      return false;
    }
  };

  const { data, isLoading: isAuthLoading, error: authError } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: () => AuthService.getCurrentUser(),
    enabled: AuthService.isAuthenticated(),
    retry: (failureCount, error: any) => {
      // Retry on 401 errors to attempt token refresh
      if (error.status === 401 && failureCount < 2) {
        return true;
      }
      return false;
    },
    staleTime: 1000 * 60 * 5, // Keep data fresh for 5 minutes to prevent unnecessary refetches on page reload
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  useEffect(() => {
    console.log('Auth effect triggered:', { data, authError, isAuthLoading });
    if (data) {
      console.log('Setting user from auth data:', data.user);
      setUser(data.user);
      setProfile(data.profile);
      setIsAuthenticated(true);
    } else if (authError) {
      console.error('Auth error, clearing token:', authError);
      // Check if it's a 401 error (token expired/invalid)
      if ((authError as any).status === 401) {
        // Attempt to refresh token before clearing
        AuthService.refreshToken().then((newToken) => {
          if (newToken) {
            // Token refreshed successfully, refetch user data
            queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
          } else {
            // Refresh failed, clear token and redirect
            AuthService.clearToken();
            setUser(null);
            setProfile(null);
            setIsAuthenticated(false);
            window.location.href = '/login';
          }
        });
      } else {
        // Other errors, just clear state
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);
      }
    } else if (!isAuthLoading && !AuthService.isAuthenticated()) {
      // Clear state if no token exists
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
    }
  }, [data, authError, isAuthLoading, queryClient]);

  // Automatic token refresh - run every 4 minutes to prevent expiration
  useEffect(() => {
    let refreshInterval: NodeJS.Timeout;
    
    if (isAuthenticated && user) {
      refreshInterval = setInterval(() => {
        console.log('Running automatic token refresh...');
        AuthService.refreshToken().then((newToken) => {
          if (newToken) {
            console.log('Token refreshed successfully');
            // Refetch user data to ensure it's fresh
            queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
          } else {
            console.error('Automatic token refresh failed');
            // Refresh failed, redirect to login
            AuthService.logout();
            window.location.href = '/login';
          }
        }).catch((error) => {
          console.error('Automatic token refresh error:', error);
          AuthService.logout();
          window.location.href = '/login';
        });
      }, 4 * 60 * 1000); // 4 minutes
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [isAuthenticated, user, queryClient]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();

      // Store token in localStorage using the correct key
      AuthService.setToken(data.token);

      // Set user state
      setUser(data.user);
      setIsAuthenticated(true);

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });

      // Return the login data so components can access user info
      return data;

    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: any) => {
    const response = await AuthService.register(data);
    setUser(response.user);
    setIsAuthenticated(true); // Set isAuthenticated to true after registration
    queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
  };

  const logout = () => {
    // Clear state immediately
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false); // Set isAuthenticated to false on logout
    queryClient.clear();
    // Clear token and redirect
    AuthService.logout();
  };

  const authValue = {
    user,
    profile,
    isLoading: isAuthLoading && AuthService.isAuthenticated(),
    isAuthenticated: !!user,
    login,
    register,
    logout,
    setUser, // Added setUser to the context value
    getToken: AuthService.getToken, // Add getToken method
    refreshToken: AuthService.refreshToken, // Add refreshToken method
    refreshAuthToken, // Add manual refresh function
  };

  return createElement(AuthContext.Provider, { value: authValue }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}