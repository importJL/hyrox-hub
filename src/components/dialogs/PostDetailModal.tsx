import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Heart, Trash2, Send } from 'lucide-react';
import { ForumPost } from '@/data/mockData';

interface PostDetailModalProps {
  post: ForumPost;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeletePost: (postId: string) => void;
}

export default function PostDetailModal({ post, open, onOpenChange, onDeletePost }: PostDetailModalProps) {
  const [replyContent, setReplyContent] = useState('');
  const isOwnPost = post.author === 'You' || post.author === 'HyroxRookie99';

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this post?')) {
      onDeletePost(post.id);
      onOpenChange(false);
    }
  };

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      alert('Reply submitted! (Demo - would save to state)');
      setReplyContent('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-card-foreground max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl pr-4">{post.title}</DialogTitle>
            {isOwnPost && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            by <span className="text-primary font-medium">{post.author}</span> • {post.date}
          </p>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-6 py-4">
            {/* Post Content */}
            <div className="bg-muted/30 p-4 rounded-lg border border-border">
              <p className="text-card-foreground leading-relaxed">{post.content}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Badge key={tag} variant="outline" className="border-primary/30 text-primary">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Likes */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4 fill-red-500 text-red-500" /> {post.likes} likes
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" /> {post.replies} replies
              </span>
            </div>

            {/* Replies */}
            <div className="border-t border-border pt-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Replies
              </h3>
              <div className="space-y-4">
                {post.replyData && post.replyData.length > 0 ? (
                  post.replyData.map(reply => (
                    <div key={reply.id} className="flex gap-3 p-3 rounded-lg bg-muted/20 border border-border/50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-foreground">{reply.author}</span>
                          <span className="text-xs text-muted-foreground">• {reply.date}</span>
                        </div>
                        <p className="text-sm text-card-foreground/80">{reply.content}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <Heart className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{reply.likes}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No replies yet. Be the first to reply!</p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Reply Input */}
        <div className="border-t border-border pt-4 mt-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Write a reply..."
              className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitReply()}
            />
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={handleSubmitReply}
              disabled={!replyContent.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}