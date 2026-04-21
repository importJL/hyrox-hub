import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, UserMinus, Activity, Calendar, MapPin } from 'lucide-react';
import { UserProfile } from '@/data/mockData';
import { getClassById, getLocationName } from '@/utils/dataHelpers';
import BookingDialog from '../dialogs/BookingDialog';

interface UserCardProps {
  user: UserProfile;
  isFriend: boolean;
  onToggleFriend: (id: string, name: string) => void;
}

export default function UserCard({ user, isFriend, onToggleFriend }: UserCardProps) {
  const handleToggleFriend = () => onToggleFriend(user.id, user.name);

  return (
    <Card className={`bg-card border-border hover:border-primary/50 transition-colors ${isFriend ? 'border-l-4 border-l-primary' : ''}`}>
      <CardHeader className="p-4 bg-muted/20">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="border-2 border-background shadow-sm h-10 w-10">
              <AvatarImage src={user.image} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm">{user.name}</CardTitle>
              <CardDescription className="text-xs">{user.handle}</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full border border-border/50 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 shrink-0"
            onClick={handleToggleFriend}
            title={isFriend ? "Remove Friend" : "Add Friend"}
          >
            {isFriend ? <UserMinus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-xs text-card-foreground/80 mb-3">{user.bio}</p>
        {isFriend && (
          <div className="space-y-3">
            {user.upcomingClasses.length > 0 && (
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Upcoming Classes</div>
                {user.upcomingClasses.map(classId => {
                  const cls = getClassById(classId);
                  return cls ? (
                    <div key={cls.id} className="text-xs bg-background p-2 rounded border border-border flex justify-between items-center mb-1">
                      <div className="truncate pr-2">
                        <span className="font-medium">{cls.title}</span>
                        <span className="block text-muted-foreground truncate">{cls.date} @ {getLocationName(cls.locationId)}</span>
                      </div>
                      <BookingDialog classSession={cls} variant="sm" buttonText="Join" />
                    </div>
                  ) : null;
                })}
              </div>
            )}

            {user.pastClasses.length > 0 && (
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Recent Activity</div>
                <div className="flex gap-2 text-xs">
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    <Activity className="h-3 w-3 mr-1" /> {user.pastClasses.length} completed
                  </Badge>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}