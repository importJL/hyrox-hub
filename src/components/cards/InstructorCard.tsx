import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Heart } from 'lucide-react';
import { Instructor } from '@/data/mockData';

interface InstructorCardProps {
  instructor: Instructor;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function InstructorCard({ instructor, isFavorite, onToggleFavorite }: InstructorCardProps) {
  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="h-32 overflow-hidden relative">
        <img src={instructor.image} alt={instructor.name} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>
      <CardHeader className="relative -mt-12 pb-2">
        <div className="flex justify-between items-end mb-2">
          <Avatar className="h-20 w-20 border-4 border-background">
            <AvatarImage src={instructor.image} />
            <AvatarFallback>{instructor.name[0]}</AvatarFallback>
          </Avatar>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-primary"
            onClick={() => onToggleFavorite(instructor.id)}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
          </Button>
        </div>
        <CardTitle className="text-xl">{instructor.name}</CardTitle>
        <CardDescription className="flex items-center gap-1 text-primary font-medium">
          <Star className="h-4 w-4 fill-primary text-primary" /> {instructor.rating} Rating
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-card-foreground/80 mb-4 line-clamp-2">{instructor.bio}</p>
        <div className="flex flex-wrap gap-2">
          {instructor.specialties.map(spec => (
            <Badge key={spec} variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted/80">
              {spec}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}