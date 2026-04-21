import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Heart } from 'lucide-react';
import { ForumPost } from '@/data/mockData';

interface ForumPostCardProps {
  post: ForumPost;
  isLiked: boolean;
  onToggleLike: (postId: string) => void;
}

export default function ForumPostCard({ post, isLiked, onToggleLike }: ForumPostCardProps) {
  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{post.title}</CardTitle>
          <span className="text-xs text-muted-foreground">{post.date}</span>
        </div>
        <CardDescription className="text-primary">by {post.author}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-card-foreground/80 line-clamp-2">{post.content}</p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        <div className="flex gap-2">
          {post.tags.map(tag => (
            <Badge key={tag} variant="outline" className="border-border text-muted-foreground text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /> {post.replies}</span>
          <button 
            className={`flex items-center gap-1 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(post.id);
            }}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500' : ''}`} /> {post.likes}
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}