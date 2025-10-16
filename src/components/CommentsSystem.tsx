"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Heart,
  Reply,
  MoreVertical
} from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
  parentId?: string;
}

interface CommentsSystemProps {
  postId: string;
}

export function CommentsSystem({ postId }: CommentsSystemProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');

  // Mock comments data
  useEffect(() => {
    const mockComments: Comment[] = [
      {
        id: '1',
        author: 'Sarah Johnson',
        avatar: '/api/placeholder/40/40',
        content: 'This is such an insightful article! I especially loved the part about modern UI design principles. Have you considered writing about accessibility in web design?',
        createdAt: '2024-01-15T14:30:00Z',
        likes: 12,
        isLiked: false,
        replies: [
          {
            id: '1-1',
            author: 'Admin',
            content: 'Thank you Sarah! I\'m glad you found it helpful. Accessibility is definitely on my list for future articles - it\'s such an important topic in modern web development.',
            createdAt: '2024-01-15T15:45:00Z',
            likes: 8,
            isLiked: true,
            parentId: '1'
          }
        ]
      },
      {
        id: '2',
        author: 'Mike Chen',
        avatar: '/api/placeholder/40/40',
        content: 'Great read! The examples you provided really helped me understand the concepts better. Looking forward to more content like this.',
        createdAt: '2024-01-15T16:20:00Z',
        likes: 5,
        isLiked: false
      },
      {
        id: '3',
        author: 'Emma Davis',
        avatar: '/api/placeholder/40/40',
        content: 'I disagree with the point about flat design being outdated. In my experience, it still works well for certain types of applications, especially mobile apps where simplicity is key.',
        createdAt: '2024-01-15T18:10:00Z',
        likes: 3,
        isLiked: false,
        replies: [
          {
            id: '3-1',
            author: 'Alex Rodriguez',
            content: 'I think both have their place. Flat design for mobile and material design for more complex desktop applications.',
            createdAt: '2024-01-15T19:25:00Z',
            likes: 6,
            isLiked: false,
            parentId: '3'
          }
        ]
      }
    ];

    // Simulate loading
    setTimeout(() => {
      setComments(mockComments);
      setLoading(false);
    }, 1000);
  }, [postId]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'You', // In a real app, this would come from auth
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const handleSubmitReply = (parentId: string) => {
    if (!replyContent.trim()) return;

    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      author: 'You',
      content: replyContent,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      parentId
    };

    setComments(prev => prev.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply]
        };
      }
      return comment;
    }));

    setReplyTo(null);
    setReplyContent('');
  };

  const toggleLike = (commentId: string, isReply = false, parentId?: string) => {
    setComments(prev => prev.map(comment => {
      if (isReply && parentId) {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies?.map(reply => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                  isLiked: !reply.isLiked
                };
              }
              return reply;
            })
          };
        }
        return comment;
      } else if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !comment.isLiked
        };
      }
      return comment;
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'popular':
        return b.likes - a.likes;
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="w-6 h-6 text-accent" />
        <h3 className="text-2xl font-playfair font-bold text-textPrimary">
          Comments ({comments.length + comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0)})
        </h3>
      </div>

      {/* Comment Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmitComment}
        className="mb-8"
      >
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this post..."
            rows={4}
            className="w-full resize-none border-0 focus:outline-none focus:ring-0 text-gray-700 placeholder:text-gray-400"
          />
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-textSecondary">
              {newComment.length}/1000 characters
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!newComment.trim() || newComment.length > 1000}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Post Comment
            </motion.button>
          </div>
        </div>
      </motion.form>

      {/* Sort Options */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {(['newest', 'oldest', 'popular'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`px-4 py-2 text-sm rounded-xl font-medium transition-colors ${
                sortBy === option
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-textSecondary hover:bg-gray-200'
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="animate-pulse">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedComments.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-textPrimary mb-2">No comments yet</h4>
            <p className="text-textSecondary">Be the first to share your thoughts!</p>
          </div>
        ) : (
          sortedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onLike={toggleLike}
              onReply={setReplyTo}
              replyTo={replyTo}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              onSubmitReply={handleSubmitReply}
              formatDate={formatDate}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string, isReply?: boolean, parentId?: string) => void;
  onReply: (commentId: string | null) => void;
  replyTo: string | null;
  replyContent: string;
  setReplyContent: (content: string) => void;
  onSubmitReply: (parentId: string) => void;
  formatDate: (date: string) => string;
}

function CommentItem({
  comment,
  onLike,
  onReply,
  replyTo,
  replyContent,
  setReplyContent,
  onSubmitReply,
  formatDate
}: CommentItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
            <span className="text-accent font-semibold text-sm">
              {comment.author.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-textPrimary">{comment.author}</span>
            <span className="text-textSecondary text-sm">•</span>
            <span className="text-textSecondary text-sm">{formatDate(comment.createdAt)}</span>
          </div>

          <p className="text-textPrimary mb-4 leading-relaxed">{comment.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onLike(comment.id)}
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                comment.isLiked ? 'text-red-600' : 'text-textSecondary hover:text-red-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
              {comment.likes}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onReply(replyTo === comment.id ? null : comment.id)}
              className="flex items-center gap-1 text-sm font-medium text-textSecondary hover:text-accent transition-colors"
            >
              <Reply className="w-4 h-4" />
              Reply
            </motion.button>

            <div className="ml-auto">
              <button className="p-1 text-textSecondary hover:text-textPrimary rounded">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Reply Form */}
          <AnimatePresence>
            {replyTo === comment.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-100"
              >
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-accent font-semibold text-xs">Y</span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      rows={3}
                      className="w-full resize-none border border-gray-200 rounded-xl p-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => onReply(null)}
                        className="px-4 py-2 text-sm text-textSecondary hover:text-textPrimary"
                      >
                        Cancel
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSubmitReply(comment.id)}
                        disabled={!replyContent.trim()}
                        className="px-4 py-2 text-sm bg-accent hover:bg-accent/90 text-white rounded-xl font-medium disabled:opacity-50"
                      >
                        Reply
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <motion.div
                  key={reply.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 font-semibold text-xs">
                      {reply.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-textPrimary text-sm">{reply.author}</span>
                      <span className="text-textSecondary text-xs">•</span>
                      <span className="text-textSecondary text-xs">{formatDate(reply.createdAt)}</span>
                    </div>
                    <p className="text-textPrimary text-sm leading-relaxed">{reply.content}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onLike(reply.id, true, comment.id)}
                        className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                          reply.isLiked ? 'text-red-600' : 'text-textSecondary hover:text-red-600'
                        }`}
                      >
                        <Heart className={`w-3 h-3 ${reply.isLiked ? 'fill-current' : ''}`} />
                        {reply.likes}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}