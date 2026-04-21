import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { ModeToggle } from './theme-toggle';
import { Flame, Bell } from 'lucide-react';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-md">
            <Flame className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic">HYROX<span className="text-primary">HUB</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full" />
          </Button>
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}