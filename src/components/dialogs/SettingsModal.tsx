import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, Lock, Bell, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useUser } from '@/hooks/useUser';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { user, updateUser } = useUser();
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState(user.email);
  const [notifications, setNotifications] = useState(true);

  const handleSaveEmail = () => {
    updateUser({ email });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-card-foreground max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Email */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email
            </label>
            <Input 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleSaveEmail}
              className="mt-1"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <Lock className="h-4 w-4" /> Password
            </label>
            <Input 
              type="password"
              placeholder="••••••••"
              className="mt-1"
            />
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <Bell className="h-4 w-4" /> Push Notifications
            </label>
            <button 
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-primary' : 'bg-muted'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* Theme */}
          <div>
            <label className="text-sm font-medium mb-2 block">Appearance</label>
            <div className="flex gap-2">
              <Button 
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('light')}
                className="flex-1"
              >
                <Sun className="h-4 w-4 mr-2" /> Light
              </Button>
              <Button 
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('dark')}
                className="flex-1"
              >
                <Moon className="h-4 w-4 mr-2" /> Dark
              </Button>
              <Button 
                variant={theme === 'system' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('system')}
                className="flex-1"
              >
                <Monitor className="h-4 w-4 mr-2" /> System
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}