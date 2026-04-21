import { useState, useCallback } from 'react';
import { MOCK_USERS } from '@/data/mockData';
import { toast } from 'sonner';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [friends, setFriends] = useState<string[]>(
    MOCK_USERS.filter(u => u.isFriend).map(u => u.id)
  );

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id)
        ? prev.filter(f => f !== id)
        : [...prev, id];
      
      if (!prev.includes(id)) {
        toast.success('Added to favorites!');
      }
      
      return newFavorites;
    });
  }, []);

  const toggleFriend = useCallback((id: string, name: string) => {
    setFriends(prev => {
      const isCurrentlyFriend = prev.includes(id);
      if (isCurrentlyFriend) {
        toast.info(`Removed ${name} from friends`);
        return prev.filter(f => f !== id);
      } else {
        toast.success(`Added ${name} to friends!`);
        return [...prev, id];
      }
    });
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);
  const isFriend = useCallback((id: string) => friends.includes(id), [friends]);

  return {
    favorites,
    friends,
    toggleFavorite,
    toggleFriend,
    isFavorite,
    isFriend,
  };
};