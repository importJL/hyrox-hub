import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Search, Calendar, MapPin, Flame, X, Plus } from 'lucide-react';
import { MOCK_USERS, UserProfile } from '@/data/mockData';
import { getClassById, getLocationName } from '@/utils/dataHelpers';
import BookingDialog from '../dialogs/BookingDialog';
import UserCard from '../cards/UserCard';

interface FriendsTabProps {
  friends: string[];
  onToggleFriend: (id: string, name: string) => void;
}

export default function FriendsTab({ friends, onToggleFriend }: FriendsTabProps) {
  const [showFindFriends, setShowFindFriends] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const friendUsers = MOCK_USERS.filter(u => friends.includes(u.id));
  const friendsWithUpcoming = friendUsers.filter(u => u.upcomingClasses.length > 0);
  const friendsWithPast = friendUsers.filter(u => u.pastClasses.length > 0);

  const filteredUsers = searchQuery && showFindFriends
    ? MOCK_USERS.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.bio.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : MOCK_USERS;

  const filteredFriendActivities = !showFindFriends
    ? (searchQuery 
        ? friendUsers.filter(u => {
            const matchesUser = 
              u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              u.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
              u.bio.toLowerCase().includes(searchQuery.toLowerCase());
            
            const hasMatchingClasses = u.upcomingClasses.some(classId => {
              const cls = getClassById(classId);
              return cls && (
                cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cls.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                getLocationName(cls.locationId).toLowerCase().includes(searchQuery.toLowerCase())
              );
            }) || u.pastClasses.some(classId => {
              const cls = getClassById(classId);
              return cls && (
                cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cls.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                getLocationName(cls.locationId).toLowerCase().includes(searchQuery.toLowerCase())
              );
            });
            
            return matchesUser || hasMatchingClasses;
          })
        : friendUsers)
    : [];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Friends Activity</h2>
          <p className="text-muted-foreground">Keep up with your training partners</p>
        </div>
        <Button 
          variant="outline" 
          className="border-border"
          onClick={() => setShowFindFriends(!showFindFriends)}
        >
          {showFindFriends ? (
            <>
              <X className="h-4 w-4 mr-2" /> Close Search
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" /> Find Friends
            </>
          )}
        </Button>
      </div>

      {/* Find Friends Search Bar - Animated Transition */}
      <div 
        className={`overflow-hidden transition-all duration-300 ${
          showFindFriends ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, handle, or bio..."
            className="pl-10 bg-card border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {searchQuery && (
          <div className="mt-2 text-sm text-muted-foreground">
            Found {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Friends List Column */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-semibold border-b border-border pb-2">
            {showFindFriends ? 'Search Results' : 'Your Network'}
          </h3>
          {(showFindFriends ? filteredUsers : friends.length > 0 ? friendUsers : []).map(user => (
            <UserCard 
              key={user.id} 
              user={user as UserProfile}
              isFriend={friends.includes(user.id)}
              onToggleFriend={onToggleFriend}
            />
          ))}
        </div>

        {/* Feed Column */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold border-b border-border pb-2">
            {searchQuery && !showFindFriends ? 'Search Results' : 'Activity Feed'}
          </h3>
          {searchQuery && !showFindFriends ? (
            filteredFriendActivities.length > 0 ? (
              <div className="space-y-4">
                {filteredFriendActivities.map(friend => {
                  const latestClassId = friend.upcomingClasses[0] || friend.pastClasses[0];
                  const cls = getClassById(latestClassId);
                  return cls ? (
                    <Card key={`search-${friend.id}`} className="bg-card border-primary/30">
                      <CardHeader className="pb-3 flex flex-row items-center gap-4">
                        <Avatar>
                          <AvatarImage src={friend.image} />
                          <AvatarFallback>{friend.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">
                            <span className="font-semibold text-foreground">{friend.name}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Matched: "{searchQuery}"
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-muted/30 p-3 rounded-lg border border-border">
                          <h4 className="font-semibold text-foreground">{cls.title}</h4>
                          <p className="text-sm text-card-foreground/80 flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3 text-primary" /> {cls.date} at {cls.time}
                          </p>
                          <p className="text-sm text-card-foreground/80 flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3 text-primary" /> {getLocationName(cls.locationId)}
                          </p>
                        </div>
                      </CardContent>
                      <CardContent className="pt-0">
                        <BookingDialog classSession={cls} variant="sm" buttonText={`Book for £${cls.price}`} />
                      </CardContent>
                    </Card>
                  ) : null;
                })}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground bg-card border border-border rounded-xl">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium text-foreground/80">No results found</h3>
                <p>No activities matching "{searchQuery}"</p>
              </div>
            )
          ) : friends.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground bg-card border border-border rounded-xl">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-medium text-foreground/80">No friends yet</h3>
              <p>Add friends to see their recent classes and activity.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Upcoming classes feed */}
              {friendsWithUpcoming.map(friend => {
                const latestClassId = friend.upcomingClasses[0];
                const cls = getClassById(latestClassId);
                return cls ? (
                  <Card key={`feed-upcoming-${friend.id}`} className="bg-card border-border">
                    <CardHeader className="pb-3 flex flex-row items-center gap-4">
                      <Avatar>
                        <AvatarImage src={friend.image} />
                        <AvatarFallback>{friend.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm">
                          <span className="font-semibold text-foreground">{friend.name}</span> just booked a class
                        </p>
                        <p className="text-xs text-muted-foreground">Just now</p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted/30 p-3 rounded-lg border border-border">
                        <h4 className="font-semibold text-foreground">{cls.title}</h4>
                        <p className="text-sm text-card-foreground/80 flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3 text-primary" /> {cls.date} at {cls.time}
                        </p>
                        <p className="text-sm text-card-foreground/80 flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-primary" /> {getLocationName(cls.locationId)}
                        </p>
                      </div>
                    </CardContent>
                    <CardContent className="pt-0">
                      <BookingDialog classSession={cls} variant="sm" buttonText={`Join them for £${cls.price}`} />
                    </CardContent>
                  </Card>
                ) : null;
              })}
              
              {/* Past activity feed */}
              {friendsWithPast.map(friend => {
                const pastClassId = friend.pastClasses[0];
                const cls = getClassById(pastClassId);
                return cls ? (
                  <div key={`feed-past-${friend.id}`} className="flex gap-4 items-start p-4 bg-card border border-border rounded-xl opacity-75">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={friend.image} />
                      <AvatarFallback>{friend.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold text-foreground">{friend.name}</span> completed <span className="font-semibold">{cls.title}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Crushed it at {getLocationName(cls.locationId)}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary shrink-0 rounded-full hover:bg-primary/20">
                      <Flame className="h-4 w-4" />
                    </Button>
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}