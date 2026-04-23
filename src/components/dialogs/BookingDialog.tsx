import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ClassSession } from '@/data/mockData';
import { useBookings } from '@/hooks/useBookings';
import { X } from 'lucide-react';
import { useState } from 'react';

interface BookingDialogProps {
  classSession: ClassSession;
  variant?: 'default' | 'sm';
  buttonText?: string;
  onBookingComplete?: () => void;
}

export default function BookingDialog({ 
  classSession, 
  variant = 'default',
  buttonText,
  onBookingComplete
}: BookingDialogProps) {
  const { hasBookedClass, isClassFullyBooked, bookClass, unbookClass } = useBookings();
  const [open, setOpen] = useState(false);
  
  const alreadyBooked = hasBookedClass(classSession.id, classSession.date, classSession.time);
  const fullyBooked = isClassFullyBooked(classSession);
  const hasSpots = !fullyBooked;

  const handleBook = () => {
    bookClass(classSession);
    setOpen(false);
    onBookingComplete?.();
  };

  const handleUnbook = () => {
    unbookClass(classSession.id);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
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
      <>
        <button 
          type="button"
          onClick={() => setOpen(true)}
          disabled={!hasSpots}
          className={`h-6 text-[10px] px-2 rounded-md font-medium transition-colors ${
            hasSpots 
              ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          {fullyBooked ? 'Full' : 'Book'}
        </button>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogContent className="bg-card border-border text-card-foreground">
            <DialogHeader>
              <DialogTitle>Confirm Booking</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Are you sure you want to book <strong>{classSession.title}</strong> on {classSession.date} at {classSession.time}?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4 gap-2">
              <Button variant="outline" className="border-border hover:bg-muted" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleBook}>
                Confirm Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
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
    <>
      <button 
        type="button"
        onClick={() => setOpen(true)}
        disabled={!hasSpots}
        className={`w-full h-10 px-4 py-2 rounded-md font-medium transition-colors ${
          hasSpots 
            ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        }`}
      >
        {buttonText || (fullyBooked ? 'Class Full' : `Book • £${classSession.price}`)}
      </button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
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
            <Button variant="outline" className="border-border hover:bg-muted" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            {hasSpots && (
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleBook}>
                Confirm Booking
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}