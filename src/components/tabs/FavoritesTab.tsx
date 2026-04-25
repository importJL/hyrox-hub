import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Heart, MapPin, Search, Dumbbell, Users } from 'lucide-react';
import { MOCK_CLASSES, MOCK_INSTRUCTORS, LOCATIONS } from '@/data/mockData';
import { getLocationName } from '@/utils/dataHelpers';

interface FavoritesTabProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export default function FavoritesTab({ favorites, onToggleFavorite }: FavoritesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const favoriteClasses = MOCK_CLASSES.filter(c => favorites.includes(c.id));
  const favoriteInstructors = MOCK_INSTRUCTORS.filter(i => favorites.includes(i.id));
  const favoriteLocations = LOCATIONS.filter(l => favorites.includes(l.id));

  const filterBySearch = <T extends { title?: string; name?: string; bio?: string }>(items: T[]): T[] => {
    if (!searchQuery) return items;
    return items.filter(item => {
      const searchTarget = (item.title || item.name || item.bio || '').toLowerCase();
      return searchTarget.includes(searchQuery.toLowerCase());
    });
  };

  const filteredClasses = filterBySearch(favoriteClasses);
  const filteredInstructors = filterBySearch(favoriteInstructors);
  const filteredLocations = filterBySearch(favoriteLocations);

  const hasFavorites = favorites.length === 0;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {hasFavorites ? (
        <div className="text-center py-20 text-muted-foreground">
          <Heart className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-medium text-foreground/80">No favorites yet</h3>
          <p>Save classes and instructors to find them easily later.</p>
        </div>
      ) : (
        <>
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search saved items..."
              className="pl-10 bg-card border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Columnar Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Classes Column */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                <Calendar className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Classes</h3>
                <span className="text-xs text-muted-foreground ml-auto">
                  ({filteredClasses.length})
                </span>
              </div>
              <ScrollArea className="flex-1 h-[400px] pr-4">
                <div className="space-y-4">
                  {filteredClasses.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No classes saved</p>
                  ) : (
                    filteredClasses.map(cls => (
                      <Card key={cls.id} className="bg-card border-border">
                        <CardHeader className="p-3">
                          <CardTitle className="text-sm">{cls.title}</CardTitle>
                          <CardDescription className="text-xs">
                            {cls.date} @ {cls.time}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="p-3 pt-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full border-border hover:bg-muted text-xs h-7"
                            onClick={() => onToggleFavorite(cls.id)}
                          >
                            Remove
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Coaches Column */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                <Dumbbell className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Coaches</h3>
                <span className="text-xs text-muted-foreground ml-auto">
                  ({filteredInstructors.length})
                </span>
              </div>
              <ScrollArea className="flex-1 h-[400px] pr-4">
                <div className="space-y-4">
                  {filteredInstructors.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No coaches saved</p>
                  ) : (
                    filteredInstructors.map(inst => (
                      <Card key={inst.id} className="bg-card border-border">
                        <CardHeader className="p-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={inst.image} />
                              <AvatarFallback>{inst.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-sm">{inst.name}</CardTitle>
                              <CardDescription className="text-xs">Coach</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardFooter className="p-3 pt-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full border-border hover:bg-muted text-xs h-7"
                            onClick={() => onToggleFavorite(inst.id)}
                          >
                            Remove
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Locations Column */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Gyms</h3>
                <span className="text-xs text-muted-foreground ml-auto">
                  ({filteredLocations.length})
                </span>
              </div>
              <ScrollArea className="flex-1 h-[400px] pr-4">
                <div className="space-y-4">
                  {filteredLocations.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No gyms saved</p>
                  ) : (
                    filteredLocations.map(loc => (
                      <Card key={loc.id} className="bg-card border-border">
                        <CardHeader className="p-3">
                          <CardTitle className="text-sm">{loc.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {loc.address}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          <div className="flex flex-wrap gap-1">
                            {loc.facilities.slice(0, 3).map(fac => (
                              <span key={fac} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                                {fac}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="p-3 pt-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full border-border hover:bg-muted text-xs h-7"
                            onClick={() => onToggleFavorite(loc.id)}
                          >
                            Remove
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </>
      )}
    </div>
  );
}