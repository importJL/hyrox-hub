import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Heart } from 'lucide-react';
import { ForumPost } from '@/data/mockData';

interface ForumPostCardProps {
  post: ForumPost;
}

export default function ForumPostCard({ post }: ForumPostCardProps) {
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
          <span className="flex items-center gap-1"><Heart className="h-4 w-4 text-muted-foreground" /> {post.likes}</span>
        </div>
      </CardFooter>
    </Card>
  );
}