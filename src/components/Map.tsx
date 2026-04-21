import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Location } from '../data/mockData';
import { useTheme } from './theme-provider';
import { Navigation, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

function SelectionUpdater({ selectedLocationId, locations }: { selectedLocationId?: string | null, locations: Location[] }) {
  const map = useMap();
  useEffect(() => {
    if (selectedLocationId) {
      const loc = locations.find(l => l.id === selectedLocationId);
      if (loc) {
        map.flyTo([loc.lat, loc.lng], 15, { animate: true });
      }
    }
  }, [selectedLocationId, locations, map]);
  return null;
}

function CustomControls({ userLocation, defaultCenter }: { userLocation?: [number, number], defaultCenter: [number, number] }) {
  const map = useMap();
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      L.DomEvent.disableClickPropagation(divRef.current);
      L.DomEvent.disableScrollPropagation(divRef.current);
    }
  }, []);

  return (
    <div ref={divRef} className="absolute right-4 bottom-4 z-[1000] flex flex-col gap-3">
      <Button
        variant="secondary"
        size="icon"
        className="rounded-full shadow-lg border border-border/50 bg-background/90 hover:bg-muted backdrop-blur-sm h-12 w-12 transition-all"
        onClick={() => userLocation ? map.flyTo(userLocation, 14) : map.flyTo(defaultCenter, 13)}
        title={userLocation ? "My Location" : "Default Location"}
      >
        <Navigation className="h-5 w-5 text-primary" />
      </Button>
      <div className="flex flex-col rounded-xl shadow-lg overflow-hidden border border-border/50 bg-background/90 backdrop-blur-sm">
        <Button
          variant="secondary"
          size="icon"
          className="rounded-none bg-transparent hover:bg-muted border-b border-border/50 h-10 w-10 transition-all"
          onClick={() => map.zoomIn()}
          title="Zoom In"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-none bg-transparent hover:bg-muted h-10 w-10 transition-all"
          onClick={() => map.zoomOut()}
          title="Zoom Out"
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

interface MapProps {
  locations: Location[];
  userLocation?: [number, number];
  onLocationSelect?: (locationId: string) => void;
  selectedLocationId?: string | null;
}

export default function Map({ locations, userLocation, onLocationSelect, selectedLocationId }: MapProps) {
  const defaultCenter: [number, number] = [51.5074, -0.1278]; // London
  const center = userLocation || defaultCenter;
  const { theme } = useTheme();

  // Resolve system theme to either light or dark
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const tileUrl = isDark 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-lg border border-border relative">
      <MapContainer center={center} zoom={13} zoomControl={false} style={{ height: '100%', width: '100%' }}>
        <CustomControls userLocation={userLocation} defaultCenter={defaultCenter} />
        <TileLayer
          key={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={tileUrl}
        />
        <MapUpdater center={center} />
        <SelectionUpdater selectedLocationId={selectedLocationId} locations={locations} />
        
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {locations.map((loc) => (
          <Marker 
            key={loc.id} 
            position={[loc.lat, loc.lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => onLocationSelect?.(loc.id),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-1">
                <h3 className="font-bold text-sm mb-1">{loc.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{loc.address}</p>
                <div className="flex items-center gap-1 text-xs font-medium text-primary">
                  ★ {loc.rating}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
