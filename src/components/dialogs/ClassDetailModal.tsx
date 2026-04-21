import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MapPin, Calendar, Clock, Dumbbell, Users, Star, 
  Activity, Target, Flame, Timer, Wallet, ChevronRight, Map
} from 'lucide-react';
import { ClassSession, Instructor, Location } from '@/data/mockData';
import { getLocationName, getInstructorName, getInstructorById, getLocationById } from '@/utils/dataHelpers';
import BookingDialog from './BookingDialog';
import ReviewDialog from './ReviewDialog';
import MiniMap from '../MiniMap';

interface ClassDetailModalProps {
  classSession: ClassSession;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigateToMap?: (locationId: string) => void;
}

export default function ClassDetailModal({ classSession, open, onOpenChange, onNavigateToMap }: ClassDetailModalProps) {
  const instructor = getInstructorById(classSession.instructorId);
  const location = getLocationById(classSession.locationId);

  const difficultyColors = {
    Beginner: 'bg-green-600',
    Intermediate: 'bg-yellow-600',
    Advanced: 'bg-red-600',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-card-foreground max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10">
              {classSession.type}
            </Badge>
            <Badge className={`${difficultyColors[classSession.difficulty]} text-white`}>
              {classSession.difficulty}
            </Badge>
          </div>
          <DialogTitle className="text-2xl">{classSession.title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm">{classSession.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm">{classSession.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-primary" />
                <span className="text-sm">{classSession.duration} min</span>
              </div>
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" />
                <span className="text-sm">£{classSession.price}</span>
              </div>
            </div>

            {/* Class Description */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Class Description
              </h3>
              <p className="text-sm text-muted-foreground">
                This {classSession.type} class is designed for {classSession.difficulty.toLowerCase()} athletes. 
                Focus on building functional strength and endurance through high-intensity functional fitness movements.
                Perfect for those preparing for HYROX events or looking to improve overall conditioning.
              </p>
            </div>

            {/* Focus Areas */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Flame className="h-4 w-4 text-primary" />
                Focus Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Functional Strength</Badge>
                <Badge variant="secondary">Endurance</Badge>
                <Badge variant="secondary">Speed</Badge>
                <Badge variant="secondary">Mental Toughness</Badge>
              </div>
            </div>

            {/* Suitability */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Suitability
              </h3>
              <p className="text-sm text-muted-foreground">
                {classSession.difficulty === 'Beginner' && 'Perfect for those new to HYROX. No prior experience required.'}
                {classSession.difficulty === 'Intermediate' && 'Requires basic fitness. Some HYROX experience recommended.'}
                {classSession.difficulty === 'Advanced' && 'For experienced athletes only. High intensity guaranteed.'}
              </p>
            </div>

            {/* Location with Mini Map */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Location
                </h3>
                {onNavigateToMap && location && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-primary border-primary/30 hover:bg-primary/10"
                    onClick={() => onNavigateToMap(classSession.locationId)}
                  >
                    <Map className="h-4 w-4 mr-1" /> Map
                  </Button>
                )}
              </div>
              <div className="bg-muted/30 p-3 rounded-lg border border-border">
                <p className="font-medium">{location?.name || getLocationName(classSession.locationId)}</p>
                <p className="text-sm text-muted-foreground">{location?.address}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {location?.facilities.map(fac => (
                    <Badge key={fac} variant="outline" className="text-xs">{fac}</Badge>
                  ))}
                </div>
                {location && <MiniMap location={location} />}
              </div>
            </div>

            {/* Coach Details */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-primary" />
                Coach
              </h3>
              {instructor && (
                <div className="flex items-center gap-4 p-3 rounded-lg border border-border">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={instructor.image} />
                    <AvatarFallback>{instructor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{instructor.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{instructor.bio}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      <span className="text-xs">{instructor.rating}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Availability */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Availability
              </h3>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <span>Spots Booked</span>
                <span className={classSession.spotsBooked >= classSession.spotsTotal ? 'text-red-500' : 'text-green-500'}>
                  {classSession.spotsBooked} / {classSession.spotsTotal}
                </span>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="border-t border-border pt-4 mt-4 flex gap-2">
          <BookingDialog classSession={classSession} />
          <ReviewDialog 
            title={classSession.title}
            targetId={classSession.id}
            targetType="class"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}