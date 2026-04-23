import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { ModeToggle } from './theme-toggle';
import { Flame, Bell, User, Settings, LogOut, Bookmark, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ProfileModal from './dialogs/ProfileModal';
import SettingsModal from './dialogs/SettingsModal';
import { useFollows } from '@/hooks/useFollows';
import { useAuth } from '@/hooks/useAuth';

interface AppHeaderProps {
  onNavigateToTab?: (tab: string) => void;
}

export default function AppHeader({ onNavigateToTab }: AppHeaderProps) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const { followingClasses, followingInstructors, followingLocations } = useFollows();
  const { user, logout } = useAuth();

  const notifications = [
    { id: 1, type: 'class', text: 'New HYROX Foundation class scheduled', time: '2h ago', read: false },
    { id: 2, type: 'instructor', text: 'Marcus Vance posted a new workout', time: '5h ago', read: false },
    { id: 3, type: 'friend', text: 'Alex Rivera booked a new class', time: '1d ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    onNavigateToTab?.('classes');
  };

  const handleSavedClick = () => {
    setShowProfileMenu(false);
    onNavigateToTab?.('favorites');
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'class': return '🏋️';
      case 'instructor': return '👨‍🏫';
      case 'friend': return '👤';
      case 'location': return '📍';
      default: return '🔔';
    }
  };

  const getInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={handleLogoClick} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-primary p-1.5 rounded-md">
              <Flame className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">HYROX<span className="text-primary">HUB</span></h1>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full" />
              )}
            </Button>
            
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50">
                <div className="flex items-center justify-between p-3 border-b border-border">
                  <h3 className="font-semibold">Notifications</h3>
                  <button onClick={() => setShowNotifications(false)}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="max-h-80 overflow-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`p-3 border-b border-border hover:bg-muted/50 cursor-pointer ${!notif.read ? 'bg-primary/5' : ''}`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-lg">{getNotificationIcon(notif.type)}</span>
                          <div className="flex-1">
                            <p className="text-sm">{notif.text}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                          </div>
                          {!notif.read && <span className="h-2 w-2 bg-primary rounded-full mt-1" />}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      No notifications yet
                    </div>
                  )}
                </div>
                <div className="p-2 border-t border-border">
                  <Button variant="ghost" size="sm" className="w-full text-sm">
                    View all notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>{user ? getInitials(user.username) : 'U'}</AvatarFallback>
              </Avatar>
            </button>
            
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                <div className="p-2 border-b border-border">
                  <p className="text-sm font-medium">{user?.username || 'User'}</p>
                  <p className="text-xs text-muted-foreground">@{user?.username || 'handle'}</p>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {user?.persona === 'coach' ? 'Coach' : 'Student'}
                  </Badge>
                </div>
                <div className="py-1">
                  <button 
                    className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center gap-2"
                    onClick={() => { setShowProfileMenu(false); setShowProfileModal(true); }}
                  >
                    <User className="h-4 w-4" /> Profile
                  </button>
                  <button 
                    className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center gap-2"
                    onClick={handleSavedClick}
                  >
                    <Bookmark className="h-4 w-4" /> Saved
                  </button>
                  <button 
                    className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center gap-2"
                    onClick={() => { setShowProfileMenu(false); setShowSettingsModal(true); }}
                  >
                    <Settings className="h-4 w-4" /> Settings
                  </button>
                </div>
                <div className="border-t border-border py-1">
                  <button 
                    className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center gap-2 text-red-500"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProfileModal open={showProfileModal} onOpenChange={setShowProfileModal} />
      <SettingsModal open={showSettingsModal} onOpenChange={setShowSettingsModal} />
    </header>
  );
}