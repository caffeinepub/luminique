import React, { useState } from 'react';
import { Heart, MessageCircle, Trophy, Share2 } from 'lucide-react';
import BottomTabBar from '../components/layout/BottomTabBar';
import { useCommunityStore, Post } from '../stores/communityStore';
import { useUserStore } from '../stores/userStore';
import { useShopStore } from '../stores/shopStore';

function TierBadge({ tier }: { tier: 'Starter' | 'GlowUp' | 'GlowPro' }) {
  const styles = {
    Starter: { bg: 'rgba(235,203,179,0.4)', color: '#7B4BB7', label: '🌱 Starter' },
    GlowUp: { bg: 'rgba(188,166,230,0.3)', color: '#7B4BB7', label: '⭐ GlowUp' },
    GlowPro: { bg: 'linear-gradient(135deg, rgba(123,75,183,0.2), rgba(91,45,145,0.2))', color: '#5B2D91', label: '👑 GlowPro' },
  };
  const s = styles[tier];
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  const [heartAnim, setHeartAnim] = useState(false);

  const handleLike = () => {
    setHeartAnim(true);
    onLike(post.id);
    setTimeout(() => setHeartAnim(false), 300);
  };

  return (
    <div className="glass-card rounded-3xl p-4 mb-3">
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 bg-gradient-to-br ${post.avatarGradient}`}
        >
          {post.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold" style={{ color: '#111111' }}>@{post.username}</span>
            <TierBadge tier={post.tier} />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs" style={{ color: '#6B6B8A' }}>🔥 {post.streak} day streak</span>
            <span className="text-xs" style={{ color: '#6B6B8A' }}>· {post.timestamp}</span>
          </div>
        </div>
      </div>

      <p className="text-sm leading-relaxed mb-3" style={{ color: '#111111' }}>{post.content}</p>

      {post.taggedProduct && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl" style={{ background: 'rgba(123,75,183,0.08)' }}>
          <span className="text-xs">🏷️</span>
          <span className="text-xs font-medium" style={{ color: '#7B4BB7' }}>{post.taggedProduct}</span>
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 transition-all ${heartAnim ? 'animate-heart-pop' : ''}`}
        >
          <Heart
            size={18}
            fill={post.likedByUser ? '#ef4444' : 'none'}
            style={{ color: post.likedByUser ? '#ef4444' : '#6B6B8A' }}
          />
          <span className="text-xs font-medium" style={{ color: '#6B6B8A' }}>{post.likes}</span>
        </button>
        <button className="flex items-center gap-1.5">
          <MessageCircle size={18} style={{ color: '#6B6B8A' }} />
          <span className="text-xs font-medium" style={{ color: '#6B6B8A' }}>{post.comments}</span>
        </button>
        <button className="flex items-center gap-1.5 ml-auto">
          <Share2 size={16} style={{ color: '#6B6B8A' }} />
        </button>
      </div>
    </div>
  );
};

const CommunityScreen: React.FC = () => {
  const { posts, leaderboard, likePost } = useCommunityStore();
  const { name, glowPoints, streak: userStreak, tier } = useUserStore();
  const { products } = useShopStore();

  const trendingProducts = products.filter((p) => p.isBestSeller).slice(0, 5);

  return (
    <div className="mobile-container">
      <div className="screen-content overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="px-5 pt-12 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: '#111111' }}>Glow Community 🌸</h1>
            <p className="text-xs" style={{ color: '#6B6B8A' }}>Connect & inspire</p>
          </div>
          <button
            className="px-3 py-2 rounded-2xl text-white text-xs font-semibold"
            style={{ background: 'linear-gradient(135deg, #7B4BB7, #5B2D91)' }}
          >
            + Post
          </button>
        </div>

        {/* Trending Products */}
        <div className="mb-4">
          <div className="px-5 mb-2 flex items-center gap-2">
            <span className="text-base">🔥</span>
            <p className="text-sm font-semibold" style={{ color: '#111111' }}>Trending Products</p>
          </div>
          <div className="flex gap-3 px-5 overflow-x-auto no-scrollbar pb-1">
            {trendingProducts.map((p) => (
              <div
                key={p.id}
                className="flex-shrink-0 glass-card rounded-2xl p-3"
                style={{ width: 110 }}
              >
                <div className={`h-14 bg-gradient-to-br ${p.gradient} rounded-xl flex items-center justify-center mb-2`}>
                  <span className="text-2xl">{p.icon}</span>
                </div>
                <p className="text-[10px] font-semibold truncate" style={{ color: '#111111' }}>{p.name}</p>
                <p className="text-[10px]" style={{ color: '#7B4BB7' }}>₹{p.price}</p>
                <div className="flex items-center gap-0.5 mt-0.5">
                  <span className="text-[9px]" style={{ color: '#D4A843' }}>★</span>
                  <span className="text-[9px]" style={{ color: '#6B6B8A' }}>{p.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Sharing Card */}
        <div className="mx-5 mb-4 rounded-3xl p-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #7B4BB7, #5B2D91)' }}>
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20" style={{ background: 'rgba(255,255,255,0.3)', transform: 'translate(30%, -30%)' }} />
          <p className="text-white font-semibold mb-1">🏆 Share Your Achievement</p>
          <p className="text-white/70 text-xs mb-3">
            {userStreak > 0 ? `You're on a ${userStreak}-day streak! Share your progress.` : 'Start your streak and share your journey!'}
          </p>
          <button
            className="px-4 py-2 rounded-xl text-xs font-semibold"
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            Generate Card ✨
          </button>
        </div>

        {/* Feed */}
        <div className="px-5 mb-4">
          <p className="text-sm font-semibold mb-3" style={{ color: '#111111' }}>✨ Community Feed</p>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onLike={likePost} />
          ))}
        </div>

        {/* Leaderboard */}
        <div className="mx-5 mb-6 glass-card rounded-3xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={18} style={{ color: '#D4A843' }} />
            <p className="font-semibold" style={{ color: '#111111' }}>Top GlowAchievers This Week</p>
          </div>
          {leaderboard.map((entry) => {
            const isCurrentUser = name && entry.displayName.toLowerCase().includes(name.split(' ')[0].toLowerCase());
            return (
              <div
                key={entry.rank}
                className="flex items-center gap-3 p-3 rounded-2xl mb-2 transition-all"
                style={{
                  background: isCurrentUser ? 'rgba(123,75,183,0.1)' : 'rgba(255,255,255,0.4)',
                  border: isCurrentUser ? '1px solid rgba(123,75,183,0.3)' : '1px solid transparent',
                }}
              >
                <span
                  className="text-sm font-bold w-6 text-center"
                  style={{ color: entry.rank <= 3 ? '#D4A843' : '#6B6B8A' }}
                >
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                </span>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br ${entry.avatarGradient}`}
                >
                  {entry.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: '#111111' }}>{entry.displayName}</p>
                  <p className="text-[10px]" style={{ color: '#6B6B8A' }}>🔥 {entry.streak} days · {entry.points} pts</p>
                </div>
                <TierBadge tier={entry.tier} />
              </div>
            );
          })}
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
};

export default CommunityScreen;
