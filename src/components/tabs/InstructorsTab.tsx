import { MOCK_INSTRUCTORS } from '@/data/mockData';
import InstructorCard from '../cards/InstructorCard';

interface InstructorsTabProps {
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
}

export default function InstructorsTab({ isFavorite, onToggleFavorite }: InstructorsTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_INSTRUCTORS.map(inst => (
          <InstructorCard 
            key={inst.id} 
            instructor={inst}
            isFavorite={isFavorite(inst.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}