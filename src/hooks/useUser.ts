import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

export type UserProfile = {
  id: string;
  name: string;
  handle: string;
  email: string;
  bio: string;
  image: string;
  classesCompleted: number;
  friendsCount: number;
  postsCount: number;
  isHandleLocked: boolean;
};

const DEFAULT_USER: UserProfile = {
  id: 'usr_current',
  name: 'You',
  handle: '@your_handle',
  email: 'you@example.com',
  bio: 'Training for HYROX!',
  image: 'https://github.com/shadcn.png',
  classesCompleted: 12,
  friendsCount: 3,
  postsCount: 5,
  isHandleLocked: false,
};

export const useUser = () => {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);

  useEffect(() => {
    const saved = localStorage.getItem('hyrox_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser({
          ...DEFAULT_USER,
          ...parsed,
          isHandleLocked: parsed.isHandleLocked ?? true,
        });
      } catch (e) {
        console.error('Failed to parse saved user', e);
        localStorage.removeItem('hyrox_user');
      }
    }
  }, []);

  const initializeUser = useCallback((initialData: { name: string; handle: string; email: string }) => {
    const newUser: UserProfile = {
      id: 'usr_current',
      name: initialData.name,
      handle: initialData.handle,
      email: initialData.email,
      bio: 'Training for HYROX!',
      image: 'https://github.com/shadcn.png',
      classesCompleted: 0,
      friendsCount: 0,
      postsCount: 0,
      isHandleLocked: true,
    };
    setUser(newUser);
    localStorage.setItem('hyrox_user', JSON.stringify(newUser));
  }, []);

  const updateUser = useCallback((updates: Partial<UserProfile>) => {
    setUser(prev => {
      const newUser = { ...prev, ...updates };
      localStorage.setItem('hyrox_user', JSON.stringify(newUser));
      toast.success('Profile updated!');
      return newUser;
    });
  }, []);

  return { user, updateUser, initializeUser };
};