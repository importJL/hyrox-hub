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
};

export const useUser = () => {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);

  useEffect(() => {
    const saved = localStorage.getItem('hyrox_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
  }, []);

  const updateUser = useCallback((updates: Partial<UserProfile>) => {
    setUser(prev => {
      const newUser = { ...prev, ...updates };
      localStorage.setItem('hyrox_user', JSON.stringify(newUser));
      toast.success('Profile updated!');
      return newUser;
    });
  }, []);

  return { user, updateUser };
};