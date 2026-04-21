import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { MOCK_LOCATIONS } from '@/data/mockData';
import { useClassFilters } from '@/hooks/useFilters';
import ClassCard from '../cards/ClassCard';

interface ClassesTabProps {
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onNavigateToMap?: (locationId: string) => void;
}

export default function ClassesTab({ isFavorite, onToggleFavorite, onNavigateToMap }: ClassesTabProps) {
  const {
    searchQuery,
    setSearchQuery,
    filterLocation,
    setFilterLocation,
    filterType,
    setFilterType,
    filteredClasses,
  } = useClassFilters();

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search classes..." 
            className="pl-10 bg-card border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterLocation} onValueChange={setFilterLocation}>
          <SelectTrigger className="w-full md:w-[200px] bg-card border-border">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Locations</SelectItem>
            {MOCK_LOCATIONS.map(loc => (
              <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full md:w-[200px] bg-card border-border">
            <SelectValue placeholder="Class Type" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Foundation">Foundation</SelectItem>
            <SelectItem value="Endurance">Endurance</SelectItem>
            <SelectItem value="Skills">Skills</SelectItem>
            <SelectItem value="Simulation">Simulation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map(cls => (
<ClassCard 
              key={cls.id} 
              classSession={cls} 
              isFavorite={isFavorite(cls.id)}
              onToggleFavorite={onToggleFavorite}
              onNavigateToMap={onNavigateToMap}
            />
        ))}
      </div>
    </div>
  );
}