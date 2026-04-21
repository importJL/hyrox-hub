import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MOCK_FORUM_POSTS, ForumPost } from '@/data/mockData';
import ForumPostCard from '../cards/ForumPostCard';
import CreatePostModal from '../dialogs/CreatePostModal';

export default function ForumTab() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [posts, setPosts] = useState<ForumPost[]>(MOCK_FORUM_POSTS);

  const handleCreatePost = (newPost: { title: string; content: string; tags: string[] }) => {
    const post: ForumPost = {
      id: `post_${Date.now()}`,
      title: newPost.title,
      content: newPost.content,
      author: 'You',
      date: new Date().toLocaleDateString(),
      replies: 0,
      likes: 0,
      tags: newPost.tags,
    };
    setPosts([post, ...posts]);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Community Discussions</h2>
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => setIsCreateModalOpen(true)}
        >
          New Post
        </Button>
      </div>
      <div className="space-y-4">
        {posts.map(post => (
          <ForumPostCard key={post.id} post={post} />
        ))}
      </div>

      <CreatePostModal 
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}