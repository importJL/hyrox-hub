import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Bold, Italic, List, Link } from 'lucide-react';
import { toast } from 'sonner';

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (post: { title: string; content: string; tags: string[] }) => void;
}

export default function CreatePostModal({ open, onOpenChange, onSubmit }: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!content.trim()) {
      toast.error('Please enter content');
      return;
    }
    
    onSubmit({ title: title.trim(), content: content.trim(), tags });
    setTitle('');
    setContent('');
    setTags([]);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setTags([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-card-foreground max-w-4xl w-[80vw] max-h-[90vh] overflow-hidden">
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="text-xl">Create New Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Title */}
          <div>
            <Input 
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-muted/50 border-border text-lg font-semibold"
            />
          </div>

          {/* Rich Text Toolbar */}
          <div className="flex items-center gap-1 p-2 bg-muted/30 rounded-lg border border-border">
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Bold className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Italic className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
              <List className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Link className="h-4 w-4" />
            </Button>
            <div className="flex-1" />
            <span className="text-xs text-muted-foreground">Use markdown for formatting</span>
          </div>

          {/* Content */}
          <Textarea 
            placeholder="Write your post content here... (Supports Markdown)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-muted/50 border-border min-h-[200px] resize-none"
          />

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Add tags..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="bg-muted/50 border-border"
              />
              <Button type="button" onClick={handleAddTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                  {tag} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <DialogFooter className="border-t border-border pt-4 mt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Submit Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}