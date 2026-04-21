import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, Users, Calendar, MessageSquare } from 'lucide-react';
import { useUser, UserProfile } from '@/hooks/useUser';

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const { user, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>({
    id: 'usr_current',
    name: 'You',
    handle: '@your_handle',
    email: 'you@example.com',
    bio: 'Training for HYROX!',
    image: 'https://github.com/shadcn.png',
    classesCompleted: 12,
    friendsCount: 3,
    postsCount: 5,
  });

  const handleSave = () => {
    updateUser(editForm);
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-card-foreground max-w-md">
        <DialogHeader>
          <DialogTitle>Your Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avatar and Name */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-4 border-background">
              <AvatarImage src={user.image} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              {isEditing ? (
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="font-semibold"
                />
              ) : (
                <h2 className="text-xl font-semibold">{user.name}</h2>
              )}
              {isEditing ? (
                <Input
                  value={editForm.handle}
                  onChange={(e) => setEditForm({ ...editForm, handle: e.target.value })}
                  className="text-sm text-muted-foreground"
                />
              ) : (
                <p className="text-sm text-muted-foreground">{user.handle}</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <Calendar className="h-5 w-5 mx-auto text-primary mb-1" />
              <p className="text-lg font-semibold">{user.classesCompleted}</p>
              <p className="text-xs text-muted-foreground">Classes</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <Users className="h-5 w-5 mx-auto text-primary mb-1" />
              <p className="text-lg font-semibold">{user.friendsCount}</p>
              <p className="text-xs text-muted-foreground">Friends</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <MessageSquare className="h-5 w-5 mx-auto text-primary mb-1" />
              <p className="text-lg font-semibold">{user.postsCount}</p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Bio</label>
            {isEditing ? (
              <Textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-sm">{user.bio || 'No bio yet'}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="flex-1 bg-primary">
                  Save
                </Button>
              </>
            ) : (
              <Button onClick={() => { setEditForm(user); setIsEditing(true); }} className="w-full bg-primary">
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}