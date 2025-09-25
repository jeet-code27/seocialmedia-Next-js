'use client'
import React, { useState, useEffect } from 'react';
import { Facebook, Eye, Heart, MessageCircle, Share2, Calendar, Image, Video, ExternalLink, AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react';

const FacebookAPITester = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('auth_token') || '');
  const [status, setStatus] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [insights, setInsights] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_BASE = 'https://api.seocialmedia.in';

  // Save auth token to localStorage
  useEffect(() => {
    if (authToken) {
      localStorage.setItem('auth_token', authToken);
    }
  }, [authToken]);

  const apiCall = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (err) {
      console.error('API Error:', err);
      throw err;
    }
  };

  const checkStatus = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/api/facebook/status');
      setStatus(data.data);
      if (data.data.pages?.length > 0) {
        setPages(data.data.pages);
      }
      setSuccess('Status checked successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getLoginUrl = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/api/facebook/login-url');
      window.open(data.data.loginUrl, '_blank');
      setSuccess('Facebook login opened in new tab');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPages = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/api/facebook/pages');
      setPages(data.data.pages);
      setSuccess(`${data.data.totalPages} pages retrieved!`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getInsights = async (pageId) => {
    setLoading(true);
    try {
      const data = await apiCall(`/api/facebook/pages/${pageId}/insights?period=28`);
      setInsights(data.data);
      setSuccess('Insights retrieved successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPosts = async (pageId) => {
    setLoading(true);
    try {
      const data = await apiCall(`/api/facebook/pages/${pageId}/posts?limit=20`);
      setPosts(data.data.posts);
      setSuccess(`${data.data.totalPosts} posts retrieved!`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    setLoading(true);
    try {
      await apiCall('/api/facebook/disconnect', { method: 'DELETE' });
      setStatus(null);
      setPages([]);
      setSelectedPage(null);
      setInsights(null);
      setPosts([]);
      setSuccess('Facebook disconnected successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const MediaDisplay = ({ media, postMessage }) => {
    if (!media || media.length === 0) return null;

    return (
      <div className="mt-3">
        {media.length === 1 ? (
          // Single media item
          <div className="rounded-lg overflow-hidden">
            {media[0].type === 'video' ? (
              <div className="relative bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                <Video className="w-12 h-12 text-gray-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium">Video Content</p>
                  <a href={media[0].url} target="_blank" rel="noopener noreferrer" 
                     className="text-xs text-blue-600 hover:underline flex items-center">
                    View Video <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="relative">
                <img 
                  src={media[0].url} 
                  alt={media[0].title || postMessage?.substring(0, 50) || 'Post image'}
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-64 bg-gray-100 rounded-lg flex-col items-center justify-center">
                  <Image className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Image unavailable</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Multiple media items (grid)
          <div className="grid grid-cols-2 gap-2">
            {media.slice(0, 4).map((item, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                {item.type === 'video' ? (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Video className="w-8 h-8 text-gray-400" />
                  </div>
                ) : (
                  <>
                    <img 
                      src={item.url} 
                      alt={`Media ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full bg-gray-100 flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                  </>
                )}
                {index === 3 && media.length > 4 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">+{media.length - 4}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="mt-2 flex items-center text-xs text-gray-500">
          <Image className="w-4 h-4 mr-1" />
          {media.length} media item{media.length !== 1 ? 's' : ''}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Facebook className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Facebook API Tester</h1>
          </div>
          <p className="text-gray-600">Test your Facebook integration endpoints</p>
        </div>

        {/* Auth Token Input */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            Authentication
          </h2>
          <div className="flex gap-4">
            <input
              type="password"
              value={authToken}
              onChange={(e) => setAuthToken(e.target.value)}
              placeholder="Enter your JWT auth token..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={checkStatus}
              disabled={!authToken || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Check Status
            </button>
          </div>
        </div>

        {/* Status & Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <span className="text-red-800">{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-red-600 hover:text-red-800">×</button>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-green-800">{success}</span>
            <button onClick={() => setSuccess('')} className="ml-auto text-green-600 hover:text-green-800">×</button>
          </div>
        )}

        {/* Connection Status */}
        {status && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Facebook Connection Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <div className="text-2xl font-bold">{status.isConnected ? 'Connected' : 'Not Connected'}</div>
                <div className="text-sm opacity-90">Status</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
                <div className="text-2xl font-bold">{status.totalPages}</div>
                <div className="text-sm opacity-90">Pages</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <div className="text-2xl font-bold">
                  {status.connectedAt ? new Date(status.connectedAt).toLocaleDateString() : 'Never'}
                </div>
                <div className="text-sm opacity-90">Connected</div>
              </div>
            </div>
            
            {!status.isConnected && (
              <div className="mt-4 flex gap-4">
                <button
                  onClick={getLoginUrl}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Connect to Facebook
                </button>
              </div>
            )}

            {status.isConnected && (
              <div className="mt-4 flex gap-4">
                <button
                  onClick={getPages}
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Refresh Pages
                </button>
                <button
                  onClick={disconnect}
                  disabled={loading}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        )}

        {/* Pages List */}
        {pages.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Your Facebook Pages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedPage?.id === page.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedPage(page)}
                >
                  <div className="font-semibold text-gray-800">{page.name}</div>
                  <div className="text-sm text-gray-600">{page.category}</div>
                  <div className="text-xs text-gray-500 mt-1">ID: {page.id}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Page Actions */}
        {selectedPage && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Actions for {selectedPage.name}
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => getInsights(selectedPage.id)}
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                Get Insights
              </button>
              <button
                onClick={() => getPosts(selectedPage.id)}
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                Get Posts
              </button>
            </div>
          </div>
        )}

        {/* Insights Display */}
        {insights && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Page Insights</h2>
            
            {insights.pageInfo && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <div className="text-2xl font-bold">{formatNumber(insights.pageInfo.fan_count || 0)}</div>
                  <div className="text-sm opacity-90">Fans</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <div className="text-2xl font-bold">{formatNumber(insights.pageInfo.followers_count || 0)}</div>
                  <div className="text-sm opacity-90">Followers</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <div className="text-2xl font-bold">{insights.availableMetrics?.length || 0}</div>
                  <div className="text-sm opacity-90">Metrics</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <div className="text-2xl font-bold">{insights.pageInfo.category}</div>
                  <div className="text-sm opacity-90">Category</div>
                </div>
              </div>
            )}

            {insights.insights && Object.keys(insights.insights).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Metrics</h3>
                <div className="space-y-3">
                  {Object.entries(insights.insights).map(([metric, data]) => (
                    <div key={metric} className="p-3 border border-gray-200 rounded-lg">
                      <div className="font-medium">{data.title || metric}</div>
                      <div className="text-sm text-gray-600">{data.description}</div>
                      <div className="text-xs text-gray-500">Period: {data.period}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Posts Display */}
        {posts.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Posts ({posts.length})</h2>
            
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {post.formatted_date}
                      <span className="mx-2">•</span>
                      <span className="capitalize">{post.post_type}</span>
                    </div>
                    {post.permalink_url && (
                      <a 
                        href={post.permalink_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Post Content */}
                  {post.message && (
                    <div className="mb-3">
                      <p className="text-gray-800 leading-relaxed">
                        {post.message.length > 300 ? `${post.message.substring(0, 300)}...` : post.message}
                      </p>
                    </div>
                  )}

                  {post.story && !post.message && (
                    <div className="mb-3">
                      <p className="text-gray-600 italic">{post.story}</p>
                    </div>
                  )}

                  {/* Media Display */}
                  <MediaDisplay media={post.media} postMessage={post.message} />

                  {/* Engagement Stats */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1 text-red-500" />
                        {formatNumber(post.engagement.reactions)}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1 text-blue-500" />
                        {formatNumber(post.engagement.comments)}
                      </div>
                      <div className="flex items-center">
                        <Share2 className="w-4 h-4 mr-1 text-green-500" />
                        Total: {formatNumber(post.engagement.total)}
                      </div>
                    </div>
                    
                    {post.has_media && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Image className="w-4 h-4 mr-1" />
                        {post.media_count} media
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 flex items-center">
              <Loader2 className="w-6 h-6 animate-spin mr-3 text-blue-600" />
              <span>Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacebookAPITester;