import { useState, useMemo } from 'react';
import { MOCK_CLASSES, LOCATIONS, ClassSession, Location } from '@/data/mockData';

export const useClassFilters = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filteredClasses = useMemo(() => {
    return MOCK_CLASSES.filter((c: ClassSession) => {
      const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = filterLocation === 'all' || c.locationId === filterLocation;
      const matchesType = filterType === 'all' || c.type === filterType;
      return matchesSearch && matchesLocation && matchesType;
    });
  }, [searchQuery, filterLocation, filterType]);

  return {
    searchQuery,
    setSearchQuery,
    filterLocation,
    setFilterLocation,
    filterType,
    setFilterType,
    filteredClasses,
  };
};

export const useMapFilters = () => {
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [selectedMapLocation, setSelectedMapLocation] = useState<string | null>(null);

  const filteredMapLocations = useMemo(() => {
    return LOCATIONS.filter((loc: Location) => {
      const matchesSearch =
        loc.name.toLowerCase().includes(mapSearchQuery.toLowerCase()) ||
        loc.address.toLowerCase().includes(mapSearchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [mapSearchQuery]);

  return {
    mapSearchQuery,
    setMapSearchQuery,
    selectedMapLocation,
    setSelectedMapLocation,
    filteredMapLocations,
  };
};