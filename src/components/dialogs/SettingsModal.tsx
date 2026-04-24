import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, Lock, Bell, Moon, Sun, Monitor, CheckCircle, XCircle } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PasswordChangeState = 'idle' | 'changing' | 'verifying' | 'success' | 'error';

export default function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { user } = useUser();
  const { updatePassword, verifyPassword } = useAuth();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  
  const [passwordState, setPasswordState] = useState<PasswordChangeState>('idle');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleVerifyOldPassword = async () => {
    setPasswordError('');
    const result = await verifyPassword(oldPassword);
    
    if (result.success) {
      setPasswordState('verifying');
      setPasswordError('');
      toast.success('Password verified');
    } else {
      setPasswordError(result.error || 'Incorrect password');
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    
    if (newPassword.length < 4) {
      setPasswordError('New password must be at least 4 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    const result = await updatePassword(oldPassword, newPassword);
    
    if (result.success) {
      setPasswordState('success');
      toast.success('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordError(result.error || 'Failed to change password');
      setPasswordState('error');
    }
  };

  const handleCancelPasswordChange = () => {
    setPasswordState('idle');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
  };

  const handleClose = () => {
    setPasswordState('idle');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border text-card-foreground max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Email - Read Only */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email
            </label>
            <Input 
              value={user.email}
              disabled
              className="mt-1 bg-muted"
            />
          </div>

          {/* Password Change */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <Lock className="h-4 w-4" /> Password
            </label>
            
            {passwordState === 'idle' && (
              <Button 
                variant="outline" 
                onClick={() => setPasswordState('changing')}
                className="mt-1 w-full"
              >
                Change Password
              </Button>
            )}

            {passwordState === 'changing' && (
              <div className="space-y-2 mt-1">
                <Input 
                  type="password"
                  placeholder="Enter old password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <Button 
                  onClick={handleVerifyOldPassword}
                  disabled={!oldPassword}
                  className="w-full"
                >
                  Verify Old Password
                </Button>
              </div>
            )}

            {passwordState === 'verifying' && (
              <div className="space-y-2 mt-1">
                <Input 
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input 
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={handleCancelPasswordChange}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleChangePassword}
                    disabled={!newPassword || !confirmPassword}
                    className="flex-1"
                  >
                    Update Password
                  </Button>
                </div>
              </div>
            )}

            {passwordState === 'success' && (
              <div className="flex items-center gap-2 mt-1 text-green-500">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Password changed successfully</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleCancelPasswordChange}
                  className="ml-auto"
                >
                  Done
                </Button>
              </div>
            )}

            {passwordError && (
              <div className="flex items-center gap-2 mt-1 text-red-500">
                <XCircle className="h-4 w-4" />
                <span className="text-sm">{passwordError}</span>
              </div>
            )}
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