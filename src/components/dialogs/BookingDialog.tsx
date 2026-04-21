import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ClassSession } from '@/data/mockData';
import { useBookings } from '@/hooks/useBookings';
import { Check, X } from 'lucide-react';

interface BookingDialogProps {
  classSession: ClassSession;
  variant?: 'default' | 'sm';
  buttonText?: string;
}

export default function BookingDialog({ 
  classSession, 
  variant = 'default',
  buttonText 
}: BookingDialogProps) {
  const { hasBookedClass, isClassFullyBooked, bookClass, unbookClass } = useBookings();
  
  const alreadyBooked = hasBookedClass(classSession.id, classSession.date, classSession.time);
  const fullyBooked = isClassFullyBooked(classSession);
  const hasSpots = !fullyBooked;

  const handleBook = () => {
    bookClass(classSession);
  };

  const handleUnbook = () => {
    unbookClass(classSession.id);
  };

  // Small variant for map/list views
  if (variant === 'sm') {
    if (alreadyBooked) {
      return (
        <Button 
          size="sm" 
          variant="outline"
          className="h-6 text-[10px] px-2 bg-green-600 hover:bg-green-700 text-white border-green-600"
          onClick={handleUnbook}
        >
          <X className="h-3 w-3 mr-1" /> Cancel
        </Button>
      );
    }
    
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            size="sm" 
            className="h-6 text-[10px] px-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={!hasSpots}
          >
            {fullyBooked ? 'Full' : 'Book'}
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card border-border text-card-foreground">
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to book <strong>{classSession.title}</strong> on {classSession.date} at {classSession.time}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="border-border hover:bg-muted">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleBook}>
                Confirm Booking
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Default variant
  if (alreadyBooked) {
    return (
      <Button 
        variant="outline" 
        className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
        onClick={handleUnbook}
      >
        <X className="h-4 w-4 mr-2" />
        Cancel Booking
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={!hasSpots}
        >
          {buttonText || (fullyBooked ? 'Class Full' : `Book • £${classSession.price}`)}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border text-card-foreground">
        <DialogHeader>
          <DialogTitle>Confirm Booking</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {fullyBooked ? (
              <span className="text-red-500">This class is fully booked. You cannot book at this time.</span>
            ) : (
              <>Are you sure you want to book <strong>{classSession.title}</strong> on {classSession.date} at {classSession.time}?</>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="border-border hover:bg-muted">Cancel</Button>
          </DialogClose>
          {hasSpots && (
            <DialogClose asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleBook}>
                Confirm Booking
              </Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}