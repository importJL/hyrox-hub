import { useState, useEffect } from 'react';
import { Dialog, DialogContentNoOverlay, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Phone, Globe, Star, Calendar, Clock, Users, Dumbbell, ArrowLeft, ExternalLink } from 'lucide-react';
import { Location } from '@/data/mockData';
import MiniMap from '../MiniMap';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getClassesByLocation, getInstructorName } from '@/utils/dataHelpers';
import BookingDialog from './BookingDialog';

interface GymDetailModalProps {
  location: Location | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatPhoneNumber(phone: number): string {
  const phoneStr = phone.toString();
  return `+852 ${phoneStr.slice(0, 4)} ${phoneStr.slice(4)}`;
}

export default function GymDetailModal({ location, open, onOpenChange }: GymDetailModalProps) {
  const [viewMode, setViewMode] = useState<'details' | 'classes'>('details');
  
  useEffect(() => {
    if (open) {
      setViewMode('details');
    }
  }, [open]);
  
  if (!location) return null;

  const classes = getClassesByLocation(location.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContentNoOverlay className="bg-card border-border text-card-foreground max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="border-b border-border pb-4">
          {viewMode === 'classes' && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-4 -mt-2 h-8 w-8 p-0"
              onClick={() => setViewMode('details')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <DialogTitle className={`text-2xl ${viewMode === 'classes' ? 'pl-8' : ''}`}>
            {viewMode === 'classes' ? `Classes at ${location.name}` : location.name}
          </DialogTitle>
        </DialogHeader>

        {viewMode === 'details' ? (
          <>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6 py-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="font-medium">{location.rating}</span>
                  <span className="text-muted-foreground text-sm">rating</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Address</p>
                      <p className="text-sm text-muted-foreground">{location.address}</p>
                    </div>
                  </div>

                  {location.location_phone_number && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Phone</p>
                        <p className="text-sm text-muted-foreground">
                          {formatPhoneNumber(location.location_phone_number)}
                        </p>
                      </div>
                    </div>
                  )}

                  {location.location_website && (
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Website</p>
                        <a
                          href={location.location_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          Visit Website
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Location
                  </h3>
                  <MiniMap location={location} />
                </div>

                {location.image && (
                  <div>
                    <h3 className="font-semibold mb-2">Photos</h3>
                    <img
                      src={location.image}
                      alt={location.name}
                      className="w-full h-48 object-cover rounded-lg border border-border"
                    />
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="border-t border-border pt-4 mt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setViewMode('classes')}
              >
                Check Available Classes
              </Button>
            </div>
          </>
        ) : (
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-3 py-4">
              {classes.length > 0 ? (
                classes.map(cls => (
                  <div key={cls.id} className="bg-muted/30 p-4 rounded-lg border border-border">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs text-primary border-primary/30 bg-primary/10">
                            {cls.type}
                          </Badge>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${
                              cls.difficulty === 'Beginner' ? 'bg-green-600' :
                              cls.difficulty === 'Intermediate' ? 'bg-yellow-600' : 'bg-red-600'
                            } text-white`}
                          >
                            {cls.difficulty}
                          </Badge>
                        </div>
                        <p className="font-semibold text-base">{cls.title}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {cls.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {cls.time} ({cls.duration}m)
                      </div>
                      <div className="flex items-center gap-2">
                        <Dumbbell className="h-4 w-4" />
                        {getInstructorName(cls.instructorId)}
                      </div>
                      <div className={`flex items-center gap-2 ${cls.spotsBooked >= cls.spotsTotal ? 'text-red-500' : ''}`}>
                        <Users className="h-4 w-4" />
                        {cls.spotsBooked}/{cls.spotsTotal} spots
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-lg">£{cls.price}</span>
                      <BookingDialog classSession={cls} useNoOverlay />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No upcoming classes at this location.
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </DialogContentNoOverlay>
    </Dialog>
  );
}