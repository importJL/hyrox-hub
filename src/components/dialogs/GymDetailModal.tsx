import { Dialog, DialogContentNoOverlay, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Phone, Globe, Star, ExternalLink } from 'lucide-react';
import { Location } from '@/data/mockData';
import MiniMap from '../MiniMap';
import { Button } from '@/components/ui/button';

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
  if (!location) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContentNoOverlay className="bg-card border-border text-card-foreground max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="text-2xl">{location.name}</DialogTitle>
        </DialogHeader>

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
            onClick={() => window.open(location.location_website, '_blank')}
          >
            <Globe className="h-4 w-4 mr-2" />
            Visit Website
          </Button>
        </div>
      </DialogContentNoOverlay>
    </Dialog>
  );
}