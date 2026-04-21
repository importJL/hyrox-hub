import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Search, Plus } from 'lucide-react';
import { MOCK_FORUM_POSTS, ForumPost } from '@/data/mockData';
import ForumPostCard from '../cards/ForumPostCard';
import CreatePostModal from '../dialogs/CreatePostModal';
import PostDetailModal from '../dialogs/PostDetailModal';

export default function ForumTab() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [posts, setPosts] = useState<ForumPost[]>(MOCK_FORUM_POSTS);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => {
      post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = !searchQuery || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.every(tag => post.tags.includes(tag));
      
      return matchesSearch && matchesTags;
    });
  }, [posts, searchQuery, selectedTags]);

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

  const handlePostClick = (post: ForumPost) => {
    setSelectedPost(post);
    setIsDetailModalOpen(true);
  };

  const handleCreatePost = (newPost: { title: string; content: string; tags: string[] }) => {
    const post: ForumPost = {
      id: `post_${Date.now()}`,
      title: newPost.title,
      content: newPost.content,
      author: 'You',
      date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
      replies: 0,
      likes: 0,
      tags: newPost.tags,
      replyData: [],
    };
    setPosts([post, ...posts]);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const handleToggleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isCurrentlyLiked = likedPosts.has(postId);
        if (isCurrentlyLiked) {
          setLikedPosts(prev => {
            const newSet = new Set(prev);
            newSet.delete(postId);
            return newSet;
          });
          return { ...post, likes: post.likes - 1 };
        } else {
          setLikedPosts(prev => new Set(prev).add(postId));
          return { ...post, likes: post.likes + 1 };
        }
      }
      return post;
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Community Discussions</h2>
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" /> New Post
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search posts by title, content, or tags..."
            className="pl-10 bg-card border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tags Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">Filter by tags:</span>
          {allTags.map(tag => (
            <Badge 
              key={tag}
              className={`cursor-pointer transition-all ${
                selectedTags.includes(tag) 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/80' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
              {selectedTags.includes(tag) && <X className="h-3 w-3 ml-1" />}
            </Badge>
          ))}
          {(selectedTags.length > 0 || searchQuery) && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
              onClick={clearFilters}
            >
              <X className="h-3 w-3 mr-1" /> Clear
            </Button>
          )}
        </div>

        {/* Results count */}
        {(searchQuery || selectedTags.length > 0) && (
          <p className="text-sm text-muted-foreground">
            Showing {filteredPosts.length} of {posts.length} posts
          </p>
        )}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <div 
              key={post.id} 
              onClick={() => handlePostClick(post)}
              className="cursor-pointer"
            >
              <ForumPostCard 
                post={post} 
                isLiked={likedPosts.has(post.id)}
                onToggleLike={handleToggleLike}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-muted-foreground bg-card border border-border rounded-xl">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium text-foreground/80">No posts found</h3>
            <p>Try adjusting your search or filters.</p>
            {(searchQuery || selectedTags.length > 0) && (
              <Button 
                variant="ghost" 
                className="mt-4"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>

      <CreatePostModal 
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreatePost}
      />

      {selectedPost && (
        <PostDetailModal 
          post={selectedPost}
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          onDeletePost={handleDeletePost}
        />
      )}
    </div>
  );
}