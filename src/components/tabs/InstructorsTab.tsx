import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { MOCK_INSTRUCTORS, Instructor } from '@/data/mockData';
import InstructorCard from '../cards/InstructorCard';
import InstructorDetailModal from '../dialogs/InstructorDetailModal';

interface InstructorsTabProps {
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
}

export default function InstructorsTab({ isFavorite, onToggleFavorite }: InstructorsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    MOCK_INSTRUCTORS.forEach(inst => {
      inst.specialties.forEach(tag => tags.add(tag));
      inst.certifications.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  const filteredInstructors = useMemo(() => {
    return MOCK_INSTRUCTORS.filter(inst => {
      const matchesSearch = !searchQuery ||
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        inst.certifications.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.every(tag => 
          inst.specialties.includes(tag) || inst.certifications.includes(tag)
        );
      
      return matchesSearch && matchesTags;
    });
  }, [searchQuery, selectedTags]);

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

  const handleInstructorClick = (inst: Instructor) => {
    setSelectedInstructor(inst);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search coaches by name, specialty, or profile..."
            className="pl-10 bg-card border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">Filter by:</span>
          {allTags.map(tag => (
            <Badge 
              key={tag}
              className={`cursor-pointer transition-all ${
                selectedTags.includes(tag) 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/80' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
              {selectedTags.includes(tag) && <X className="h-3 w-3 ml-1" />}
            </Badge>
          ))}
          {(selectedTags.length > 0 || searchQuery) && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
              onClick={clearFilters}
            >
              <X className="h-3 w-3 mr-1" /> Clear
            </Button>
          )}
        </div>

        {(searchQuery || selectedTags.length > 0) && (
          <p className="text-sm text-muted-foreground">
            Showing {filteredInstructors.length} of {MOCK_INSTRUCTORS.length} coaches
          </p>
        )}
      </div>

      {/* Coaches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstructors.length > 0 ? (
          filteredInstructors.map(inst => (
            <div key={inst.id} onClick={() => handleInstructorClick(inst)} className="cursor-pointer">
              <InstructorCard 
                instructor={inst}
                isFavorite={isFavorite(inst.id)}
                onToggleFavorite={onToggleFavorite}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-muted-foreground bg-card border border-border rounded-xl">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium text-foreground/80">No coaches found</h3>
            <p>Try adjusting your search or filters.</p>
            {(searchQuery || selectedTags.length > 0) && (
              <Button variant="ghost" className="mt-4" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>

      {selectedInstructor && (
        <InstructorDetailModal
          instructor={selectedInstructor}
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
        />
      )}
    </div>
  );
}