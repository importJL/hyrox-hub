import * as React from 'react';
import { cn } from '@/lib/utils';

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  return <>{children}</>;
}

export function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps) {
  return <>{children}</>;
}

export function DropdownMenuContent({ children, className }: DropdownMenuContentProps) {
  return (
    <div className={cn("absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-50", className)}>
      {children}
    </div>
  );
}

export function DropdownMenuItem({ children, onClick, className }: DropdownMenuItemProps) {
  return (
    <div 
      className={cn("px-4 py-2 text-sm cursor-pointer hover:bg-muted", className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator() {
  return <div className="border-t border-border my-1" />;
}

export function DropdownMenuLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-4 py-2 text-sm font-medium text-muted-foreground", className)}>
      {children}
    </div>
  );
}