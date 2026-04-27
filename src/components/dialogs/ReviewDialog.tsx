import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, X, Plus, Bold, Italic, List, Link, Eye, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { useBookings } from '@/hooks/useBookings';
import { ClassSession } from '@/data/mockData';
import ReactMarkdown from 'react-markdown';

interface ReviewDialogProps {
  title: string;
  targetId: string;
  targetType: 'class' | 'instructor' | 'location';
  description?: string;
  variant?: 'default' | 'sm';
  classSession?: ClassSession;
  onBookClick?: () => void;
}

export default function ReviewDialog({ 
  title, 
  targetId,
  targetType,
  description,
  variant = 'default',
  classSession,
  onBookClick
}: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { hasUserReviewed, hasAttendedClass, submitReview } = useBookings();
  
  const hasAttended = classSession ? hasAttendedClass(targetId, classSession.date, classSession.time) : false;
  const alreadyReviewed = hasUserReviewed(targetId, targetType);

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
    
    setContent(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a star rating');
      return;
    }
    if (!content.trim()) {
      toast.error('Please write your review');
      return;
    }
    
    const success = submitReview(targetId, targetType, rating, content.trim());
    if (success) {
      setRating(0);
      setContent('');
      setShowModal(false);
    }
  };

  const renderStars = (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star} 
          className={`h-8 w-8 cursor-pointer transition-colors ${
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

  if (!hasAttended && targetType === 'class') {
    return onBookClick ? (
      <Button variant="outline" className="border-border hover:bg-muted" onClick={onBookClick}>
        <Star className="h-4 w-4 mr-2" />
        Review Class
      </Button>
    ) : (
      <Button variant="outline" disabled className="border-border opacity-50">
        Review Class
      </Button>
    );
  }

  if (variant === 'sm') {
    return (
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-card border-border text-card-foreground max-w-2xl">
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
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs h-8 border-border hover:bg-background"
          onClick={() => setShowModal(true)}
        >
          <Star className="h-3 w-3 mr-1" />
          Rate Location
        </Button>
      </Dialog>
    );
  }

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="bg-card border-border text-card-foreground max-w-4xl w-[80vw] max-h-[90vh] overflow-hidden">
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="text-xl">Review {title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {description || 'Share your experience with this class.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Star Rating */}
          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border">
            <span className="text-sm font-medium">Your Rating:</span>
            {renderStars}
            {rating > 0 && (
              <span className="text-sm text-muted-foreground">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </span>
            )}
          </div>

          {/* Rich Text Toolbar */}
          <div className="flex items-center gap-1 p-2 bg-muted/30 rounded-lg border border-border">
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertMarkdown('**', '**')} title="Bold">
              <Bold className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertMarkdown('*', '*')} title="Italic">
              <Italic className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertMarkdown('- ')} title="Bullet List">
              <List className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertMarkdown('[', '](url)')} title="Link">
              <Link className="h-4 w-4" />
            </Button>
            <div className="flex-1" />
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="h-8 bg-transparent">
                <TabsTrigger type="button" value="write" className="h-7 px-3 text-xs data-[state=active]:bg-muted">
                  <Edit className="h-3 w-3 mr-1" /> Write
                </TabsTrigger>
                <TabsTrigger type="button" value="preview" className="h-7 px-3 text-xs data-[state=active]:bg-muted">
                  <Eye className="h-3 w-3 mr-1" /> Preview
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Content */}
          {activeTab === 'write' ? (
            <Textarea 
              ref={textareaRef}
              placeholder="Write your review here... (Supports Markdown: **bold**, *italic*, - bullet, [link](url))"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-muted/50 border-border min-h-[200px] resize-none"
            />
          ) : (
            <div className="min-h-[200px] p-4 bg-muted/30 border border-border rounded-lg overflow-auto">
              {content ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm italic">Nothing to preview...</p>
              )}
            </div>
          )}

          {/* Actions */}
          <DialogFooter className="border-t border-border pt-4 mt-4">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Submit Review
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      <Button 
        variant="outline" 
        className="border-border hover:bg-muted"
        onClick={() => setShowModal(true)}
      >
        <Star className="h-4 w-4 mr-2" />
        Review Class
      </Button>
    </Dialog>
  );
}