import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  username: string;
  email: string;
  persona: 'student' | 'coach';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: User & { password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  verifyPassword: (password: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'hyroxhub_auth';
const USERS_KEY = 'hyroxhub_users';

interface StoredUser extends User {
  password: string;
}

function getStoredUsers(): StoredUser[] {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveStoredUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        if (userData && userData.username) {
          setUser(userData);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = getStoredUsers();
    const foundUser = users.find(u => u.username === username);
    
    if (!foundUser) {
      return { success: false, error: 'User not found' };
    }
    
    if (foundUser.password !== password) {
      return { success: false, error: 'Invalid password' };
    }
    
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
    
    return { success: true };
  };

  const register = async (userData: User & { password: string }): Promise<{ success: boolean; error?: string }> => {
    const users = getStoredUsers();
    
    if (users.some(u => u.username === userData.username)) {
      return { success: false, error: 'Username already exists' };
    }
    
    if (users.some(u => u.email === userData.email)) {
      return { success: false, error: 'Email already registered' };
    }
    
    users.push(userData);
    saveStoredUsers(users);
    
    const { password: _, ...userWithoutPassword } = userData;
    setUser(userWithoutPassword);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updatePassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    const users = getStoredUsers();
    const currentUser = user;
    
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' };
    }
    
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    
    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }
    
    if (users[userIndex].password !== oldPassword) {
      return { success: false, error: 'Incorrect old password' };
    }
    
    if (newPassword.length < 4) {
      return { success: false, error: 'New password must be at least 4 characters' };
    }
    
    users[userIndex].password = newPassword;
    saveStoredUsers(users);
    
    return { success: true };
  };

  const verifyPassword = async (password: string): Promise<{ success: boolean; error?: string }> => {
    const users = getStoredUsers();
    const currentUser = user;
    
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' };
    }
    
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    
    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }
    
    if (users[userIndex].password !== password) {
      return { success: false, error: 'Incorrect password' };
    }
    
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, updatePassword, verifyPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}