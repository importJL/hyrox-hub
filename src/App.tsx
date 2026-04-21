import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/sonner';
import { useFavorites } from '@/hooks/useFavorites';
import { BookingsProvider } from '@/hooks/useBookings';
import AppHeader from '@/components/AppHeader';
import ClassesTab from '@/components/tabs/ClassesTab';
import MapTab from '@/components/tabs/MapTab';
import InstructorsTab from '@/components/tabs/InstructorsTab';
import ForumTab from '@/components/tabs/ForumTab';
import FavoritesTab from '@/components/tabs/FavoritesTab';
import FriendsTab from '@/components/tabs/FriendsTab';
import BookingsTab from '@/components/tabs/BookingsTab';
import Chatbox from '@/components/Chatbox';

export default function App() {
  const [activeTab, setActiveTab] = useState('classes');
  const [userLocation, setUserLocation] = useState<[number, number] | undefined>(undefined);

  const { favorites, friends, toggleFavorite, toggleFriend, isFavorite } = useFavorites();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      });
    }
  }, []);

  return (
    <BookingsProvider>
      <div className="min-h-screen bg-background text-foreground font-sans pb-20 md:pb-0">
        <AppHeader />

        <main className="container mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-7 bg-muted mb-8">
              <TabsTrigger value="classes" className="data-[state=active]:bg-background data-[state=active]:text-primary text-xs sm:text-sm">Classes</TabsTrigger>
              <TabsTrigger value="bookings" className="data-[state=active]:bg-background data-[state=active]:text-primary text-xs sm:text-sm">Bookings</TabsTrigger>
              <TabsTrigger value="map" className="data-[state=active]:bg-background data-[state=active]:text-primary text-xs sm:text-sm">Map</TabsTrigger>
              <TabsTrigger value="instructors" className="data-[state=active]:bg-background data-[state=active]:text-primary text-xs sm:text-sm">Coaches</TabsTrigger>
              <TabsTrigger value="forum" className="data-[state=active]:bg-background data-[state=active]:text-primary text-xs sm:text-sm">Forum</TabsTrigger>
              <TabsTrigger value="favorites" className="data-[state=active]:bg-background data-[state=active]:text-primary text-xs sm:text-sm">Saved</TabsTrigger>
              <TabsTrigger value="friends" className="data-[state=active]:bg-background data-[state=active]:text-primary text-xs sm:text-sm">Friends</TabsTrigger>
            </TabsList>

            <TabsContent value="classes">
              <ClassesTab isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />
            </TabsContent>

            <TabsContent value="bookings">
              <BookingsTab />
            </TabsContent>

            <TabsContent value="map">
              <MapTab />
            </TabsContent>

            <TabsContent value="instructors">
              <InstructorsTab isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />
            </TabsContent>

            <TabsContent value="forum">
              <ForumTab />
            </TabsContent>

            <TabsContent value="favorites">
              <FavoritesTab favorites={favorites} onToggleFavorite={toggleFavorite} />
            </TabsContent>

            <TabsContent value="friends">
              <FriendsTab friends={friends} onToggleFriend={toggleFriend} />
            </TabsContent>
          </Tabs>
        </main>

        <Chatbox />
        <Toaster />
      </div>
    </BookingsProvider>
  );
}