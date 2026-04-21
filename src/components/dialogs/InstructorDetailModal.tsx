import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Mail, MapPin, Award, Calendar, Clock, Dumbbell } from 'lucide-react';
import { Instructor } from '@/data/mockData';
import { getLocationName, getClassById } from '@/utils/dataHelpers';

interface InstructorDetailModalProps {
  instructor: Instructor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InstructorDetailModal({ instructor, open, onOpenChange }: InstructorDetailModalProps) {
  const location = getLocationName(instructor.locationId);
  const upcomingClasses = instructor.classes
    .map(id => getClassById(id))
    .filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-card-foreground max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20 border-4 border-background">
              <AvatarImage src={instructor.image} />
              <AvatarFallback>{instructor.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{instructor.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-medium text-primary">{instructor.rating} Rating</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {/* Quick Info */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{instructor.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{location}</span>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-sm text-muted-foreground">{instructor.bio}</p>
            </div>

            {/* Experience */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-primary" />
                Experience
              </h3>
              <p className="text-sm text-muted-foreground">{instructor.experience}</p>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                Certifications
              </h3>
              <div className="flex flex-wrap gap-2">
                {instructor.certifications.map(cert => (
                  <Badge key={cert} variant="outline" className="border-primary/30 text-primary">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Award className="h-4 w-4 text-yellow-500" />
                Achievements
              </h3>
              <div className="flex flex-wrap gap-2">
                {instructor.achievements.map(ach => (
                  <Badge key={ach} className="bg-yellow-600 text-white">
                    {ach}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Specialties */}
            <div>
              <h3 className="font-semibold mb-2">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {instructor.specialties.map(spec => (
                  <Badge key={spec} variant="secondary">{spec}</Badge>
                ))}
              </div>
            </div>

            {/* Upcoming Classes */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Upcoming Classes
              </h3>
              <div className="space-y-2">
                {upcomingClasses.length > 0 ? (
                  upcomingClasses.map(cls => cls && (
                    <div key={cls.id} className="p-3 rounded-lg border border-border bg-muted/30">
                      <p className="font-medium">{cls.title}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3" /> {cls.date} at {cls.time}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-3 w-3" /> {location}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No upcoming classes scheduled.</p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="border-t border-border pt-4 mt-4">
          <Button className="bg-primary hover:bg-primary/90 w-full">
            Follow {instructor.name.split(' ')[0]}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}