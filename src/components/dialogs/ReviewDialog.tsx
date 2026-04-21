import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { useBookings } from '@/hooks/useBookings';

interface ReviewDialogProps {
  title: string;
  targetId: string;
  targetType: 'class' | 'instructor' | 'location';
  description?: string;
  variant?: 'default' | 'sm';
}

export default function ReviewDialog({ 
  title, 
  targetId,
  targetType,
  description,
  variant = 'default' 
}: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const { hasUserReviewed, canReviewClass, submitReview } = useBookings();
  
  const canReview = targetType === 'class' ? canReviewClass(targetId) : true;
  const alreadyReviewed = hasUserReviewed(targetId, targetType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const comment = (form.elements.namedItem('comment') as HTMLTextAreaElement)?.value || '';
    
    const success = submitReview(targetId, targetType, rating, comment);
    if (success) {
      setRating(0);
    }
  };

  const renderStars = (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star} 
          className={`h-6 w-6 cursor-pointer transition-colors ${
            star <= rating ? 'fill-primary text-primary' : 'text-muted-foreground hover:text-primary'
          }`}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
  );

  if (alreadyReviewed) {
    return (
      <Button variant="outline" disabled className="border-border opacity-50">
        Reviewed
      </Button>
    );
  }

  if (!canReview && targetType === 'class') {
    return (
      <Button variant="outline" disabled className="border-border opacity-50">
        Book to Review
      </Button>
    );
  }

  if (variant === 'sm') {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full text-xs h-8 border-border hover:bg-background">Rate Location</Button>
        </DialogTrigger>
        <DialogContent className="bg-card border-border text-card-foreground">
          <DialogHeader>
            <DialogTitle>Review {title}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {description || 'Share your experience with this location.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {renderStars}
            <Textarea 
              name="comment"
              placeholder="What did you think of the equipment, showers, and overall vibe?" 
              className="bg-muted/50 border-border min-h-[100px]" 
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Submit Rating</Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-border hover:bg-muted">Review</Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border text-card-foreground">
        <DialogHeader>
          <DialogTitle>Review {title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {description || 'Share your experience with this.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {renderStars}
          <Textarea 
            name="comment"
            placeholder="Write your review here..." 
            className="bg-muted/50 border-border min-h-[100px]" 
          />
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Submit Review</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}