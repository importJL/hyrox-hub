import { MOCK_CLASSES, MOCK_INSTRUCTORS, MOCK_LOCATIONS, ClassSession, Instructor, Location } from '@/data/mockData';

export const getLocationName = (id: string): string => 
  MOCK_LOCATIONS.find(l => l.id === id)?.name || 'Unknown Location';

export const getInstructorName = (id: string): string => 
  MOCK_INSTRUCTORS.find(i => i.id === id)?.name || 'Unknown Instructor';

export const getClassById = (id: string): ClassSession | undefined => 
  MOCK_CLASSES.find(c => c.id === id);

export const getInstructorById = (id: string): Instructor | undefined => 
  MOCK_INSTRUCTORS.find(i => i.id === id);

export const getLocationById = (id: string): Location | undefined => 
  MOCK_LOCATIONS.find(l => l.id === id);

export const getClassesByLocation = (locationId: string): ClassSession[] => 
  MOCK_CLASSES.filter(c => c.locationId === locationId);