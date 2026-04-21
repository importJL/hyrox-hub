import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Clock, Dumbbell, Users, Heart, Check } from 'lucide-react';
import { ClassSession } from '@/data/mockData';
import { getLocationName, getInstructorName } from '@/utils/dataHelpers';
import BookingDialog from '../dialogs/BookingDialog';
import ReviewDialog from '../dialogs/ReviewDialog';
import ClassDetailModal from '../dialogs/ClassDetailModal';
import { useBookings } from '@/hooks/useBookings';

interface ClassCardProps {
  classSession: ClassSession;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onNavigateToMap?: (locationId: string) => void;
}

export default function ClassCard({ classSession, isFavorite, onToggleFavorite, onNavigateToMap }: ClassCardProps) {
  const [showDetail, setShowDetail] = useState(false);
  const { hasBookedClass } = useBookings();
  const isBooked = hasBookedClass(classSession.id, classSession.date, classSession.time);
  const spotsAvailable = classSession.spotsBooked < classSession.spotsTotal;

  return (
    <>
      <Card 
        className={`bg-card border-border overflow-hidden group hover:border-primary/50 transition-colors cursor-pointer ${
          isBooked ? 'border-green-500 bg-green-500/10' : ''
        }`}
        onClick={() => setShowDetail(true)}
      >
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10">
                  {classSession.type}
                </Badge>
                {isBooked && (
                  <Badge variant="secondary" className="bg-green-600 text-white">
                    <Check className="h-3 w-3 mr-1" /> Booked
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl">{classSession.title}</CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-primary -mt-2 -mr-2"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(classSession.id);
              }}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
            </Button>
          </div>
          <CardDescription className="flex items-center gap-1 text-muted-foreground mt-2">
            <MapPin className="h-3 w-3" /> {getLocationName(classSession.locationId)}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-card-foreground/80">
              <Calendar className="h-4 w-4 text-primary" />
              {classSession.date}
            </div>
            <div className="flex items-center gap-2 text-card-foreground/80">
              <Clock className="h-4 w-4 text-primary" />
              {classSession.time} ({classSession.duration}m)
            </div>
            <div className="flex items-center gap-2 text-card-foreground/80">
              <Dumbbell className="h-4 w-4 text-primary" />
              {getInstructorName(classSession.instructorId)}
            </div>
            <div className={`flex items-center gap-2 ${spotsAvailable ? 'text-card-foreground/80' : 'text-red-500'}`}>
              <Users className="h-4 w-4 text-primary" />
              {classSession.spotsBooked}/{classSession.spotsTotal} spots
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 flex gap-2" onClick={(e) => e.stopPropagation()}>
          <BookingDialog 
            classSession={classSession}
          />
          <ReviewDialog 
            title={classSession.title}
            targetId={classSession.id}
            targetType="class"
          />
        </CardFooter>
      </Card>

      <ClassDetailModal
        classSession={classSession}
        open={showDetail}
        onOpenChange={setShowDetail}
        onNavigateToMap={onNavigateToMap}
      />
    </>
  );
}