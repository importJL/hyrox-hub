import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

export type FollowType = 'class' | 'instructor' | 'location' | 'user';

export type FollowItem = {
  type: FollowType;
  id: string;
  name: string;
  timestamp: number;
};

const STORAGE_KEY = 'hyrox_follows';

export const useFollows = () => {
  const [followingClasses, setFollowingClasses] = useState<string[]>([]);
  const [followingInstructors, setFollowingInstructors] = useState<string[]>([]);
  const [followingLocations, setFollowingLocations] = useState<string[]>([]);
  const [followingUsers, setFollowingUsers] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setFollowingClasses(data.classes || []);
        setFollowingInstructors(data.instructors || []);
        setFollowingLocations(data.locations || []);
        setFollowingUsers(data.users || []);
      } catch (e) {
        console.error('Failed to load follows', e);
      }
    }
  }, []);

  const saveFollows = useCallback((classes: string[], instructors: string[], locations: string[], users: string[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      classes: classes,
      instructors,
      locations,
      users,
    }));
  }, []);

  const toggleFollow = useCallback((type: FollowType, id: string, name: string) => {
    switch (type) {
      case 'class':
        setFollowingClasses(prev => {
          const newClasses = prev.includes(id) 
            ? prev.filter(f => f !== id) 
            : [...prev, id];
          saveFollows(newClasses, followingInstructors, followingLocations, followingUsers);
          if (prev.includes(id)) {
            toast.info(`Unfollowed ${name}`);
          } else {
            toast.success(`Following ${name}!`);
          }
          return newClasses;
        });
        break;
      case 'instructor':
        setFollowingInstructors(prev => {
          const newInstructors = prev.includes(id)
            ? prev.filter(f => f !== id)
            : [...prev, id];
          saveFollows(followingClasses, newInstructors, followingLocations, followingUsers);
          if (prev.includes(id)) {
            toast.info(`Unfollowed ${name}`);
          } else {
            toast.success(`Following ${name}!`);
          }
          return newInstructors;
        });
        break;
      case 'location':
        setFollowingLocations(prev => {
          const newLocations = prev.includes(id)
            ? prev.filter(f => f !== id)
            : [...prev, id];
          saveFollows(followingClasses, followingInstructors, newLocations, followingUsers);
          if (prev.includes(id)) {
            toast.info(`Unfollowed ${name}`);
          } else {
            toast.success(`Following ${name}!`);
          }
          return newLocations;
        });
        break;
      case 'user':
        setFollowingUsers(prev => {
          const newUsers = prev.includes(id)
            ? prev.filter(f => f !== id)
            : [...prev, id];
          saveFollows(followingClasses, followingInstructors, followingLocations, newUsers);
          if (prev.includes(id)) {
            toast.info(`Unfollowed ${name}`);
          } else {
            toast.success(`Following ${name}!`);
          }
          return newUsers;
        });
        break;
    }
  }, [followingClasses, followingInstructors, followingLocations, followingUsers, saveFollows]);

  const isFollowing = useCallback((type: FollowType, id: string) => {
    switch (type) {
      case 'class': return followingClasses.includes(id);
      case 'instructor': return followingInstructors.includes(id);
      case 'location': return followingLocations.includes(id);
      case 'user': return followingUsers.includes(id);
      default: return false;
    }
  }, [followingClasses, followingInstructors, followingLocations, followingUsers]);

  return {
    followingClasses,
    followingInstructors,
    followingLocations,
    followingUsers,
    toggleFollow,
    isFollowing,
  };
};