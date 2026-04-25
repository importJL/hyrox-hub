import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Star, Search } from 'lucide-react';
import { useMapFilters } from '@/hooks/useFilters';
import { getClassesByLocation, getLocationName } from '@/utils/dataHelpers';
import { getLocationById } from '@/utils/dataHelpers';
import Map from '../Map';
import BookingDialog from '../dialogs/BookingDialog';
import ReviewDialog from '../dialogs/ReviewDialog';
import GymDetailModal from '../dialogs/GymDetailModal';

interface MapTabProps {
  initialSelectedLocation?: string | null;
  onLocationSelect?: (id: string) => void;
}

export default function MapTab({ initialSelectedLocation, onLocationSelect }: MapTabProps) {
  const {
    mapSearchQuery,
    setMapSearchQuery,
    selectedMapLocation,
    setSelectedMapLocation,
    filteredMapLocations,
  } = useMapFilters();

  const [gymModalOpen, setGymModalOpen] = useState(false);
  const [selectedGymForModal, setSelectedGymForModal] = useState<string | null>(null);

  useEffect(() => {
    if (initialSelectedLocation) {
      setSelectedMapLocation(initialSelectedLocation);
    }
  }, [initialSelectedLocation, setSelectedMapLocation]);

  const handleGymClick = (locId: string) => {
    setSelectedGymForModal(locId);
    setGymModalOpen(true);
  };

  return (
    <div className="h-[600px] animate-in fade-in-50 duration-500 flex flex-col md:flex-row gap-4">
      {/* Sidebar */}
      <Card className="w-full md:w-80 h-full overflow-hidden flex flex-col bg-card border-border shrink-0">
        <CardHeader className="p-4 border-b border-border space-y-2">
          <CardTitle className="text-lg">Gym Locations</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Find a gym..."
              className="pl-9 h-9 border-border bg-background"
              value={mapSearchQuery}
              onChange={(e) => setMapSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <ScrollArea className="flex-1 p-0">
          <div className="flex flex-col">
            {filteredMapLocations.map(loc => (
              <div
                key={loc.id}
                className={`p-4 border-b border-border transition-colors hover:bg-muted/50 ${selectedMapLocation === loc.id ? 'bg-muted border-l-4 border-l-primary' : ''}`}
              >
                <div className="cursor-pointer" onClick={() => handleGymClick(loc.id)}>
                  <h3 className="font-semibold text-sm mb-1">{loc.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {loc.address}
                  </p>
                  <div className="flex items-center text-xs mt-3">
                    <span className="flex items-center gap-1 text-primary font-medium">
                      <Star className="h-3 w-3 fill-primary" /> {loc.rating}
                    </span>
                  </div>
                </div>

                {/* Expanded Section */}
                {selectedMapLocation === loc.id && (
                  <div className="mt-4 pt-4 border-t border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <h4 className="text-xs font-semibold mb-2 text-foreground/90">Upcoming Classes</h4>
                    <div className="space-y-2 mb-4">
                      {getClassesByLocation(loc.id).length > 0 ? (
                        getClassesByLocation(loc.id).map(cls => (
                          <div key={cls.id} className="text-xs bg-background p-2 rounded border border-border flex justify-between items-center">
                            <div>
                              <span className="font-medium text-foreground">{cls.title}</span>
                              <span className="block text-muted-foreground mt-0.5">{cls.date} @ {cls.time}</span>
                            </div>
                            <BookingDialog classSession={cls} variant="sm" />
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-muted-foreground">No upcoming classes.</div>
                      )}
                    </div>

                    <ReviewDialog
                      title={loc.name}
                      description="Share your experience with this gym and its facilities."
                      variant="sm"
                    />
                  </div>
                )}
              </div>
            ))}
            {filteredMapLocations.length === 0 && (
              <div className="p-4 text-sm text-muted-foreground text-center">No locations found.</div>
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Map container */}
      <Card className="flex-1 h-full bg-card border-border overflow-hidden">
        <Map
          locations={filteredMapLocations}
          userLocation={undefined}
          selectedLocationId={selectedMapLocation}
          onLocationSelect={(id) => handleGymClick(id)}
        />
      </Card>

      <GymDetailModal
        location={selectedGymForModal ? getLocationById(selectedGymForModal) : null}
        open={gymModalOpen}
        onOpenChange={setGymModalOpen}
      />
    </div>
  );
}