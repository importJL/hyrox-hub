import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, MapPin, Users, X, Ticket, Star } from 'lucide-react';
import { useBookings, Booking } from '@/hooks/useBookings';
import { getLocationName, getInstructorName } from '@/utils/dataHelpers';
import BookingDialog from '../dialogs/BookingDialog';
import ClassDetailModal from '../dialogs/ClassDetailModal';
import ReviewDialog from '../dialogs/ReviewDialog';
import { ClassSession } from '@/data/mockData';
import { useState } from 'react';

export default function BookingsTab() {
  const { bookings, unbookClass } = useBookings();
  const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null);

  const handleCancelBooking = (classId: string) => {
    unbookClass(classId);
  };

  if (bookings.length === 0) {
    return (
      <div className="space-y-6 animate-in fade-in-50 duration-500">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Bookings</h2>
        </div>
        <div className="text-center py-20 text-muted-foreground">
          <Ticket className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-medium text-foreground/80">No bookings yet</h3>
          <p>Book a class to see it here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Bookings</h2>
        <Badge variant="secondary">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking: Booking) => (
          <Card 
            key={booking.classId} 
            className="bg-card border-green-500/50 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-green-600 border-r-transparent" />
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="outline" className="mb-2 text-primary border-primary/30 bg-primary/10">
                    {booking.classSession.type}
                  </Badge>
                  <CardTitle className="text-xl">{booking.classSession.title}</CardTitle>
                </div>
              </div>
              <CardDescription className="flex items-center gap-1 text-muted-foreground mt-2">
                <MapPin className="h-3 w-3" /> {getLocationName(booking.classSession.locationId)}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-card-foreground/80">
                  <Calendar className="h-4 w-4 text-green-500" />
                  {booking.classSession.date}
                </div>
                <div className="flex items-center gap-2 text-card-foreground/80">
                  <Clock className="h-4 w-4 text-green-500" />
                  {booking.classSession.time} ({booking.classSession.duration}m)
                </div>
                <div className="flex items-center gap-2 text-card-foreground/80">
                  <Users className="h-4 w-4 text-green-500" />
                  {booking.classSession.spotsBooked}/{booking.classSession.spotsTotal} spots
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Booked on {booking.bookedAt.toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 border-border hover:bg-muted"
                onClick={() => setSelectedClass(booking.classSession)}
              >
                View Details
              </Button>
              <ReviewDialog 
                title={booking.classSession.title}
                targetId={booking.classId}
                targetType="class"
                classSession={booking.classSession}
              />
              <Button 
                variant="outline" 
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                onClick={() => handleCancelBooking(booking.classId)}
              >
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedClass && (
        <ClassDetailModal
          classSession={selectedClass}
          open={!!selectedClass}
          onOpenChange={(open) => !open && setSelectedClass(null)}
        />
      )}
    </div>
  );
}