import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Calendar, Heart, MessageSquare, Share2, TrendingUp, RefreshCw, BarChart3, Activity, Eye, ChevronRight } from 'lucide-react';

// Mock data for demonstration
const mockPagePosts = [
  {
    id: '1',
    created_time: '2025-10-04T10:30:00',
    message: 'Excited to announce our new product launch! Check out the amazing features we have been working on. #Innovation #TechLaunch',
    type: 'photo',
    full_picture: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
    likes: { summary: { total_count: 1245 } },
    comments: { summary: { total_count: 87 } },
    shares: { count: 156 },
    link: 'https://facebook.com'
  },
  {
    id: '2',
    created_time: '2025-10-03T14:20:00',
    message: 'Thank you to all our amazing customers for your continued support! We could not do this without you. ❤️',
    type: 'status',
    likes: { summary: { total_count: 892 } },
    comments: { summary: { total_count: 54 } },
    shares: { count: 89 }
  },
  {
    id: '3',
    created_time: '2025-10-02T09:15:00',
    message: 'Join us for our live webinar tomorrow at 3 PM! Learn about the latest industry trends and best practices.',
    type: 'link',
    full_picture: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=400',
    likes: { summary: { total_count: 567 } },
    comments: { summary: { total_count: 32 } },
    shares: { count: 234 },
    link: 'https://facebook.com'
  },
  {
    id: '4',
    created_time: '2025-10-01T16:45:00',
    message: 'Behind the scenes look at our team working hard to bring you the best experience possible! 🚀',
    type: 'photo',
    full_picture: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
    likes: { summary: { total_count: 1089 } },
    comments: { summary: { total_count: 76 } },
    shares: { count: 123 }
  },
  {
    id: '5',
    created_time: '2025-09-30T11:30:00',
    message: 'Weekend vibes! Hope everyone has a fantastic weekend ahead. What are your plans?',
    type: 'status',
    likes: { summary: { total_count: 734 } },
    comments: { summary: { total_count: 98 } },
    shares: { count: 45 }
  }
];

const MobilePostsAnalytics = () => {
  const [activeView, setActiveView] = useState('posts'); // 'posts' or 'analytics'
  const [expandedPost, setExpandedPost] = useState(null);
  const pagePosts = mockPagePosts;
  const postsLoading = false;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Calculate analytics data
  const getAnalyticsData = () => {
    if (!pagePosts || pagePosts.length === 0) return null;

    // Engagement over time
    const engagementTrend = pagePosts.map(post => ({
      date: new Date(post.created_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      likes: post.likes?.summary?.total_count || 0,
      comments: post.comments?.summary?.total_count || 0,
      shares: post.shares?.count || 0,
      total: (post.likes?.summary?.total_count || 0) + 
             (post.comments?.summary?.total_count || 0) + 
             (post.shares?.count || 0)
    })).reverse();

    // Total engagement by type
    const totalEngagement = pagePosts.reduce((acc, post) => {
      acc.likes += post.likes?.summary?.total_count || 0;
      acc.comments += post.comments?.summary?.total_count || 0;
      acc.shares += post.shares?.count || 0;
      return acc;
    }, { likes: 0, comments: 0, shares: 0 });

    const engagementByType = [
      { name: 'Likes', value: totalEngagement.likes, color: '#ec4899' },
      { name: 'Comments', value: totalEngagement.comments, color: '#3b82f6' },
      { name: 'Shares', value: totalEngagement.shares, color: '#10b981' }
    ];

    // Post type distribution
    const postTypes = pagePosts.reduce((acc, post) => {
      const type = post.type || 'status';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const postTypeData = Object.entries(postTypes).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count
    }));

    // Average engagement per post
    const avgEngagement = {
      likes: Math.round(totalEngagement.likes / pagePosts.length),
      comments: Math.round(totalEngagement.comments / pagePosts.length),
      shares: Math.round(totalEngagement.shares / pagePosts.length)
    };

    return {
      engagementTrend,
      engagementByType,
      postTypeData,
      avgEngagement,
      totalEngagement
    };
  };

  const analytics = getAnalyticsData();
  const COLORS = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];

  const renderAnalytics = () => {
    if (!analytics) return null;

    return (
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-4 text-white">
            <Heart className="w-6 h-6 mb-2 opacity-90" />
            <p className="text-2xl font-bold">{analytics.totalEngagement.likes.toLocaleString()}</p>
            <p className="text-xs opacity-90">Total Likes</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
            <MessageSquare className="w-6 h-6 mb-2 opacity-90" />
            <p className="text-2xl font-bold">{analytics.totalEngagement.comments.toLocaleString()}</p>
            <p className="text-xs opacity-90">Total Comments</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
            <Share2 className="w-6 h-6 mb-2 opacity-90" />
            <p className="text-2xl font-bold">{analytics.totalEngagement.shares.toLocaleString()}</p>
            <p className="text-xs opacity-90">Total Shares</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl p-4 text-white">
            <TrendingUp className="w-6 h-6 mb-2 opacity-90" />
            <p className="text-2xl font-bold">{pagePosts.length}</p>
            <p className="text-xs opacity-90">Total Posts</p>
          </div>
        </div>

        {/* Engagement Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Engagement Over Time
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={analytics.engagementTrend}>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10, fill: '#6b7280' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#6b7280' }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ 
                  fontSize: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="likes" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="comments" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="shares" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-4 mt-2">
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full bg-pink-500 mr-1"></div>
              <span className="text-gray-600">Likes</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
              <span className="text-gray-600">Comments</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span className="text-gray-600">Shares</span>
            </div>
          </div>
        </div>

        {/* Engagement Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
            Engagement Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={analytics.engagementByType}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                {analytics.engagementByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ 
                  fontSize: '12px',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-4 mt-2">
            {analytics.engagementByType.map((item, index) => (
              <div key={index} className="flex items-center text-xs">
                <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: item.color }}></div>
                <span className="text-gray-600">{item.name}: {item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Average Engagement */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
            Average Per Post
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={[analytics.avgEngagement]}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ 
                  fontSize: '12px',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="likes" fill="#ec4899" radius={[8, 8, 0, 0]} />
              <Bar dataKey="comments" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="shares" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderPosts = () => {
    if (!pagePosts || pagePosts.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No posts available</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {pagePosts.map((post, index) => {
          const isExpanded = expandedPost === post.id;
          const totalEngagement = (post.likes?.summary?.total_count || 0) +
                                 (post.comments?.summary?.total_count || 0) +
                                 (post.shares?.count || 0);

          return (
            <div
              key={post.id || index}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            >
              {/* Post Header */}
              <div 
                className="p-4 active:bg-gray-50 transition-colors"
                onClick={() => setExpandedPost(isExpanded ? null : post.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-gray-600 font-medium">
                      {formatDate(post.created_time)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                      {post.type || "post"}
                    </span>
                    <ChevronRight 
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Post Message */}
                {post.message && (
                  <p className="text-sm text-gray-900 leading-relaxed mb-3">
                    {isExpanded ? post.message : truncateText(post.message, 120)}
                  </p>
                )}

                {/* Post Image Preview */}
                {post.full_picture && !isExpanded && (
                  <div className="mb-3">
                    <img
                      src={post.full_picture}
                      alt="Post"
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => e.target.style.display = "none"}
                    />
                  </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-pink-50 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center space-x-1 text-pink-600">
                      <Heart className="w-3 h-3" />
                      <span className="font-bold text-sm">
                        {post.likes?.summary?.total_count || 0}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">Likes</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center space-x-1 text-blue-600">
                      <MessageSquare className="w-3 h-3" />
                      <span className="font-bold text-sm">
                        {post.comments?.summary?.total_count || 0}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">Comments</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center space-x-1 text-green-600">
                      <Share2 className="w-3 h-3" />
                      <span className="font-bold text-sm">
                        {post.shares?.count || 0}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">Shares</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center space-x-1 text-purple-600">
                      <TrendingUp className="w-3 h-3" />
                      <span className="font-bold text-sm">{totalEngagement}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">Total</p>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  {post.full_picture && (
                    <div className="mt-3 mb-3">
                      <img
                        src={post.full_picture}
                        alt="Post content"
                        className="w-full rounded-lg"
                        onError={(e) => e.target.style.display = "none"}
                      />
                    </div>
                  )}
                  {post.link && (
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-block mt-2"
                    >
                      View on Facebook →
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-4">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-bold text-gray-900">Recent Posts</h2>
            {postsLoading && (
              <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
            )}
          </div>
          
          {/* View Toggle */}
          <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveView('posts')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                activeView === 'posts'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-1" />
              Posts
            </button>
            <button
              onClick={() => setActiveView('analytics')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                activeView === 'analytics'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-1" />
              Analytics
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeView === 'posts' ? renderPosts() : renderAnalytics()}
        </div>
      </div>
    </div>
  );
};

export default MobilePostsAnalytics;