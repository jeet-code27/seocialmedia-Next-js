"use client";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";
import {
  Facebook,
  Users,
  BarChart3,
  FileText,
  Unlink,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Eye,
  ThumbsUp,
  Calendar,
  MessageSquare,
  Share2,
  Heart,
} from "lucide-react";

// Component that uses useSearchParams - must be wrapped in Suspense
function FacebookIntegrationContent() {
  const searchParams = useSearchParams();
  const tokenFromQuery = searchParams.get("token");
  const [connectionStatus, setConnectionStatus] = useState({
    isConnected: false,
    loading: true,
    connectedAt: null,
    totalPages: 0,
    pages: [],
  });

  const [facebookPages, setFacebookPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [pageInsights, setPageInsights] = useState(null);
  const [pagePosts, setPagePosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState("");

  // Your backend API base URL
  const API_BASE = "https://api.seocialmedia.in/api";

  // Mock auth token - replace this with your actual auth token
  const authToken =
    tokenFromQuery
    // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YzUwZjljYWIwZDQ2NjUwZmZiOTQxNSIsImlhdCI6MTc1OTQ4MjgxMCwiZXhwIjoxNzYwMDg3NjEwfQ.e5dtK-szVQ_8u1IE1AF-p2MmCsATmKKTM140nsZ7aOI";

  // API call helper with better error handling
  const apiCall = async (endpoint, method = "GET", body = null) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: body ? JSON.stringify(body) : null,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP ${response.status}: API call failed`
        );
      }

      return data;
    } catch (err) {
      console.error("API Error:", err);
      throw err;
    }
  };

  // Helper function to safely get metric icon
  const getMetricIcon = (metricName) => {
    if (!metricName || typeof metricName !== "string")
      return <TrendingUp className="w-5 h-5" />;

    const name = metricName.toLowerCase();
    if (name.includes("engagement") || name.includes("reaction"))
      return <Heart className="w-5 h-5 text-pink-500" />;
    if (name.includes("impression") || name.includes("view"))
      return <Eye className="w-5 h-5 text-blue-500" />;
    if (name.includes("fan") || name.includes("follower"))
      return <Users className="w-5 h-5 text-green-500" />;
    return <TrendingUp className="w-5 h-5 text-purple-500" />;
  };

  // Helper function to safely format metric names
  const formatMetricName = (metricName) => {
    if (!metricName || typeof metricName !== "string") return "Unknown Metric";

    return metricName
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase())
      .replace("Page ", "");
  };

  // FIXED: Helper function to safely get latest value from insight
  const getLatestValue = (insight) => {
    try {
      if (
        !insight ||
        !insight.values ||
        !Array.isArray(insight.values) ||
        insight.values.length === 0
      ) {
        return "No data";
      }

      const latestValue = insight.values[insight.values.length - 1];
      if (!latestValue) return "No data";

      // Handle reaction metrics that return objects
      if (insight.name === "page_actions_post_reactions_total") {
        if (
          typeof latestValue.value === "object" &&
          latestValue.value !== null
        ) {
          const totalReactions = Object.values(latestValue.value).reduce(
            (sum, count) => sum + (count || 0),
            0
          );
          return totalReactions.toLocaleString();
        }
        return "0";
      }

      // Handle regular numeric values
      if (typeof latestValue.value === "number") {
        return latestValue.value.toLocaleString();
      }

      return latestValue.value || "No data";
    } catch (error) {
      console.error("Error getting latest value:", error);
      return "Error";
    }
  };

  // FIXED: Helper function to safely get previous value for comparison
  const getPreviousValue = (insight) => {
    try {
      if (
        !insight ||
        !insight.values ||
        !Array.isArray(insight.values) ||
        insight.values.length < 2
      ) {
        return null;
      }

      const previousValue = insight.values[insight.values.length - 2];
      if (!previousValue) return null;

      // Handle reaction metrics that return objects
      if (insight.name === "page_actions_post_reactions_total") {
        if (
          typeof previousValue.value === "object" &&
          previousValue.value !== null
        ) {
          const totalReactions = Object.values(previousValue.value).reduce(
            (sum, count) => sum + (count || 0),
            0
          );
          return totalReactions;
        }
        return 0;
      }

      // Handle regular numeric values
      if (typeof previousValue.value === "number") {
        return previousValue.value;
      }

      return null;
    } catch (error) {
      console.error("Error getting previous value:", error);
      return null;
    }
  };

  // Helper function to safely calculate percentage change
  const getPercentageChange = (current, previous) => {
    try {
      if (!current || !previous || previous === 0) return null;

      const currentNum =
        typeof current === "string"
          ? parseFloat(current.replace(/,/g, ""))
          : current;
      const previousNum =
        typeof previous === "string"
          ? parseFloat(previous.replace(/,/g, ""))
          : previous;

      if (isNaN(currentNum) || isNaN(previousNum) || previousNum === 0)
        return null;

      const change = ((currentNum - previousNum) / previousNum) * 100;
      return change.toFixed(1);
    } catch (error) {
      console.error("Error calculating percentage change:", error);
      return null;
    }
  };

  // FIXED: Helper function to get numeric value for chart rendering
  const getNumericValue = (insight, index) => {
    try {
      if (!insight || !insight.values || !insight.values[index]) return 0;

      const value = insight.values[index].value;

      // Handle reaction metrics that return objects
      if (insight.name === "page_actions_post_reactions_total") {
        if (typeof value === "object" && value !== null) {
          return Object.values(value).reduce(
            (sum, count) => sum + (count || 0),
            0
          );
        }
        return 0;
      }

      // Handle regular numeric values
      return typeof value === "number" ? value : 0;
    } catch (error) {
      console.error("Error getting numeric value:", error);
      return 0;
    }
  };

  // Listen for popup messages
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "FACEBOOK_AUTH_SUCCESS") {
        checkFacebookStatus();
        getFacebookPages();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Check Facebook connection status on component mount
  useEffect(() => {
    checkFacebookStatus();
  }, []);

  const checkFacebookStatus = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiCall("/facebook/status");

      setConnectionStatus({
        ...response.data,
        loading: false,
      });

      if (
        response.data.isConnected &&
        response.data.pages &&
        response.data.pages.length > 0
      ) {
        setFacebookPages(response.data.pages);
      }
    } catch (err) {
      console.error("Error checking Facebook status:", err);
      setError("Failed to check Facebook connection status");
      setConnectionStatus((prev) => ({ ...prev, loading: false }));
    } finally {
      setLoading(false);
    }
  };

  const connectToFacebook = async () => {
    try {
      setLoading(true);
      setError("");

      // Get Facebook login URL
      const response = await apiCall("/facebook/login-url");

      // Open Facebook login in a popup
      const popup = window.open(
        response.data.loginUrl,
        "facebook-login",
        "width=500,height=700,scrollbars=yes,resizable=yes"
      );

      // Listen for popup to close (user completed login)
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          // Wait a moment then check status
          setTimeout(() => {
            checkFacebookStatus();
            getFacebookPages();
          }, 2000);
        }
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to connect to Facebook");
    } finally {
      setLoading(false);
    }
  };

  const getFacebookPages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiCall("/facebook/pages");

      setFacebookPages(response.data.pages || []);
      setConnectionStatus((prev) => ({
        ...prev,
        isConnected: true,
        totalPages: response.data.totalPages || 0,
      }));
    } catch (err) {
      setError(err.message || "Failed to get Facebook pages");
    } finally {
      setLoading(false);
    }
  };

  const getPageInsights = async (pageId) => {
    try {
      setInsightsLoading(true);
      setError("");

      console.log("Fetching insights for page:", pageId);
      const response = await apiCall(
        `/facebook/pages/${pageId}/insights?period=28`
      );
      console.log("Received insights response:", response);

      setPageInsights(response.data);
      setSelectedPage(pageId);
    } catch (err) {
      console.error("Error fetching insights:", err);
      setError(err.message || "Failed to get page insights");
      setPageInsights({
        error: true,
        message: err.message || "Failed to get page insights",
        pageId: pageId,
      });
      setSelectedPage(pageId);
    } finally {
      setInsightsLoading(false);
    }
  };

  const getPagePosts = async (pageId) => {
    try {
      setPostsLoading(true);
      setError("");

      const response = await apiCall(
        `/facebook/pages/${pageId}/posts?limit=10`
      );
      setPagePosts(response.data.posts || response.data || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err.message || "Failed to get page posts");
      setPagePosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  const disconnectFacebook = async () => {
    try {
      setLoading(true);
      setError("");

      await apiCall("/facebook/disconnect", "DELETE");

      // Reset all state
      setConnectionStatus({
        isConnected: false,
        loading: false,
        connectedAt: null,
        totalPages: 0,
        pages: [],
      });
      setFacebookPages([]);
      setSelectedPage(null);
      setPageInsights(null);
      setPagePosts([]);
    } catch (err) {
      setError(err.message || "Failed to disconnect Facebook");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const truncateText = (text, maxLength = 200) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Render page insights
  const renderInsights = () => {
    if (!pageInsights) return null;

    if (pageInsights.error) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Page Insights
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <div>
                <h3 className="font-medium text-red-900">
                  Unable to load insights
                </h3>
                <p className="text-red-700 text-sm mt-1">
                  {pageInsights.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Page Insights</h2>
          {insightsLoading && (
            <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          )}
        </div>

        {/* Page Info Card */}
        {pageInsights.pageInfo && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-blue-900">
                {pageInsights.pageInfo.name}
              </h3>
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                {pageInsights.pageInfo.category || "Business"}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-blue-900 text-2xl font-bold">
                  {pageInsights.pageInfo.followers_count?.toLocaleString() ||
                    "N/A"}
                </p>
                <p className="text-blue-700 text-sm font-medium">Followers</p>
              </div>
              <div className="text-center">
                <Heart className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                <p className="text-blue-900 text-2xl font-bold">
                  {pageInsights.pageInfo.fan_count?.toLocaleString() || "N/A"}
                </p>
                <p className="text-blue-700 text-sm font-medium">Fans</p>
              </div>
              <div className="text-center">
                <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-blue-900 text-lg font-bold">
                  {pageInsights.period || "28"} days
                </p>
                <p className="text-blue-700 text-sm font-medium">Period</p>
              </div>
              <div className="text-center">
                <BarChart3 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-blue-900 text-lg font-bold">
                  {pageInsights.debug?.successfulMetrics || 0}
                </p>
                <p className="text-blue-700 text-sm font-medium">Metrics</p>
              </div>
            </div>
          </div>
        )}

        {/* Insights Metrics Grid */}
        {pageInsights.insights &&
        Object.keys(pageInsights.insights).length > 0 ? (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Performance Metrics
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(pageInsights.insights).map(([key, insight]) => {
                const currentValue = getLatestValue(insight);
                const previousValue = getPreviousValue(insight);
                const percentageChange = getPercentageChange(
                  getNumericValue(insight, insight.values.length - 1),
                  previousValue
                );

                return (
                  <div
                    key={key}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getMetricIcon(key)}
                        <h5 className="font-semibold text-gray-900 text-sm leading-tight">
                          {insight.title || formatMetricName(key)}
                        </h5>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-3xl font-bold text-gray-900 mb-1">
                        {currentValue}
                      </p>
                      {percentageChange && (
                        <div
                          className={`inline-flex items-center space-x-1 text-sm font-medium ${
                            parseFloat(percentageChange) >= 0
                              ? "text-green-600 bg-green-50"
                              : "text-red-600 bg-red-50"
                          } px-2 py-1 rounded`}
                        >
                          <span>
                            {parseFloat(percentageChange) >= 0 ? "↗" : "↘"}
                          </span>
                          <span>{Math.abs(parseFloat(percentageChange))}%</span>
                        </div>
                      )}
                    </div>

                    {insight.description && (
                      <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                        {insight.description}
                      </p>
                    )}

                    {/* Recent Values Chart-like Display */}
                    {insight.values &&
                      Array.isArray(insight.values) &&
                      insight.values.length > 1 && (
                        <div className="mt-4">
                          <p className="text-xs font-medium text-gray-500 mb-2">
                            Recent Trend
                          </p>
                          <div className="flex justify-between items-end h-12 bg-white rounded p-2">
                            {insight.values.slice(-5).map((value, index) => {
                              const actualIndex =
                                insight.values.length - 5 + index;
                              const numericValues = insight.values
                                .slice(-5)
                                .map((_, i) =>
                                  getNumericValue(
                                    insight,
                                    insight.values.length - 5 + i
                                  )
                                );
                              const maxValue = Math.max(...numericValues);
                              const currentNumValue = getNumericValue(
                                insight,
                                actualIndex
                              );
                              const height =
                                maxValue > 0
                                  ? (currentNumValue / maxValue) * 100
                                  : 0;
                              return (
                                <div
                                  key={index}
                                  className="flex flex-col items-center flex-1"
                                >
                                  <div
                                    className="w-2 bg-blue-400 rounded-t"
                                    style={{
                                      height: `${Math.max(height, 2)}%`,
                                    }}
                                  ></div>
                                  <span className="text-xs text-gray-400 mt-1">
                                    {new Date(value.end_time).getDate()}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h4 className="text-lg font-medium text-gray-700 mb-2">
              No Insights Available
            </h4>
            <p className="text-gray-500 mb-4">
              This page may not have enough data for insights
            </p>
            {pageInsights.warning && (
              <div className="max-w-md mx-auto text-left bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-medium mb-2">
                  {pageInsights.warning}
                </p>
                {pageInsights.possibleReasons && (
                  <ul className="text-yellow-700 text-sm space-y-1">
                    {pageInsights.possibleReasons.map((reason, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render page posts
  const renderPosts = () => {
    if (!pagePosts || pagePosts.length === 0) {
      return null;
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Posts</h2>
          {postsLoading && (
            <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          )}
        </div>

        <div className="space-y-6">
          {pagePosts.map((post, index) => {
            try {
              return (
                <div
                  key={post.id || index}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-600 font-medium">
                        {formatDate(post.created_time)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                        {post.type || "post"}
                      </span>
                    </div>
                  </div>

                  {/* Post Content */}
                  {post.message && (
                    <div className="mb-4">
                      <p className="text-gray-900 leading-relaxed">
                        {truncateText(post.message, 300)}
                      </p>
                    </div>
                  )}

                  {post.story && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-400">
                      <p className="text-gray-700 italic text-sm">
                        {post.story}
                      </p>
                    </div>
                  )}

                  {/* Post Image */}
                  {post.full_picture && (
                    <div className="mb-4">
                      <img
                        src={post.full_picture}
                        alt="Post content"
                        className="w-full max-h-64 object-cover rounded-lg"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    </div>
                  )}

                  {/* Engagement Metrics */}
                  <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-pink-600">
                        <Heart className="w-4 h-4" />
                        <span className="font-bold">
                          {post.likes?.summary?.total_count ||
                            post.engagement?.likes ||
                            0}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Likes</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-blue-600">
                        <MessageSquare className="w-4 h-4" />
                        <span className="font-bold">
                          {post.comments?.summary?.total_count ||
                            post.engagement?.comments ||
                            0}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Comments</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-green-600">
                        <Share2 className="w-4 h-4" />
                        <span className="font-bold">
                          {post.shares?.count || post.engagement?.shares || 0}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Shares</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-purple-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-bold">
                          {post.engagement?.total ||
                            (post.likes?.summary?.total_count || 0) +
                              (post.comments?.summary?.total_count || 0) +
                              (post.shares?.count || 0)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Total</p>
                    </div>
                  </div>

                  {/* Post Link */}
                  {post.link && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <a
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm underline"
                      >
                        View on Facebook
                      </a>
                    </div>
                  )}
                </div>
              );
            } catch (error) {
              console.error("Error rendering post:", error);
              return (
                <div
                  key={post.id || index}
                  className="border border-red-200 rounded-lg p-4 bg-red-50"
                >
                  <p className="text-red-800 text-sm">Error displaying post</p>
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  };

  if (connectionStatus.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading Facebook integration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-gray-50 p-6">
      <div className="max-w-[320px] md:max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <div>
                <Facebook className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
                  Facebook Integration {tokenFromQuery && "(Demo Mode)"}
                </h1>
                <p className="text-md sm:text-lg text-gray-600">
                  Connect and manage your Facebook pages
                </p>
              </div>
            </div>

            {connectionStatus.isConnected ? (
              <div className="flex sm:flex-row flex-col space-x-0 sm:space-x-4 sm:items-center mt-4 sm:mt-0">
                <button
                  onClick={disconnectFacebook}
                  disabled={loading}
                  className="flex items-center justify-center space-x-2 px-10 md:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors mb-2 sm:mb-0"
                >
                  <Unlink className="w-4 h-4" />
                  <span>Disconnect</span>
                </button>
                <div className="flex text-center items-center justify-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Connected</span>
                </div>
              </div>
            ) : (
              <button
                onClick={connectToFacebook}
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Facebook className="w-5 h-5" />
                <span>{loading ? "Connecting..." : "Connect to Facebook"}</span>
                {loading && <RefreshCw className="w-4 h-4 animate-spin ml-2" />}
              </button>
            )}
          </div>

          {/* Connection Info */}
          {connectionStatus.isConnected && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="text-sm text-green-800 mb-3 sm:mb-0">
                  <p>
                    <strong>Connected:</strong>{" "}
                    {connectionStatus.connectedAt
                      ? formatDate(connectionStatus.connectedAt)
                      : "Unknown"}
                  </p>
                  <p>
                    <strong>Pages:</strong> {connectionStatus.totalPages}{" "}
                    page(s) available
                  </p>
                </div>
                <button
                  onClick={getFacebookPages}
                  disabled={loading}
                  className="text-green-600 hover:text-green-800 text-sm font-medium disabled:opacity-50 transition-colors"
                >
                  Refresh Pages
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-800">{error}</p>
              <button
                onClick={() => setError("")}
                className="ml-auto text-red-600 hover:text-red-800 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Facebook Pages */}
        {connectionStatus.isConnected &&
          facebookPages &&
          facebookPages.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Your Facebook Pages
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facebookPages.map((page) => (
                  <div
                    key={page.id}
                    className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">
                          {page.name || "Unknown Page"}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {page.category || "No category"}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">
                          ID: {page.id}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Facebook className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>

                    {/* Page stats if available */}
                    {(page.fan_count || page.followers_count) && (
                      <div className="flex justify-between text-sm text-gray-600 mb-4 p-2 bg-blue-50 rounded">
                        {page.fan_count && (
                          <span>
                            <strong>{page.fan_count.toLocaleString()}</strong>{" "}
                            fans
                          </span>
                        )}
                        {page.followers_count && (
                          <span>
                            <strong>
                              {page.followers_count.toLocaleString()}
                            </strong>{" "}
                            followers
                          </span>
                        )}
                      </div>
                    )}

                    <div className="space-y-3">
                      <button
                        onClick={() => getPageInsights(page.id)}
                        disabled={insightsLoading && selectedPage === page.id}
                        className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedPage === page.id && pageInsights
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        }`}
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span>
                          {insightsLoading && selectedPage === page.id
                            ? "Loading Insights..."
                            : selectedPage === page.id && pageInsights
                            ? "Insights Loaded ✓"
                            : "Get Insights"}
                        </span>
                        {insightsLoading && selectedPage === page.id && (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        )}
                      </button>

                      <button
                        onClick={() => getPagePosts(page.id)}
                        disabled={postsLoading}
                        className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          pagePosts.length > 0
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50"
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                        <span>
                          {postsLoading
                            ? "Loading Posts..."
                            : pagePosts.length > 0
                            ? `${pagePosts.length} Posts Loaded ✓`
                            : "Get Posts"}
                        </span>
                        {postsLoading && (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        )}
                      </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            getPageInsights(page.id);
                            getPagePosts(page.id);
                          }}
                          disabled={loading || insightsLoading || postsLoading}
                          className="flex-1 text-xs text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 transition-colors"
                        >
                          Load All Data
                        </button>
                        <button
                          onClick={() => {
                            if (selectedPage === page.id) {
                              setSelectedPage(null);
                              setPageInsights(null);
                              setPagePosts([]);
                            }
                          }}
                          className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Page Insights */}
        {selectedPage && renderInsights()}

        {/* Page Posts */}
        {selectedPage && renderPosts()}

        {/* Loading Overlay */}
        {(loading || insightsLoading || postsLoading) && (
          <div className="fixed inset-0  flex items-center justify-center z-50">
            <div className=" rounded-lg p-8 flex items-center space-x-4 shadow-xl">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          </div>
        )}

        {/* Empty State for Connected but No Pages */}
        {connectionStatus.isConnected &&
          (!facebookPages || facebookPages.length === 0) && (
            <div className=" rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Facebook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Facebook Pages Found
              </h3>
              <p className="text-gray-600 mb-4">
                Your Facebook account doesn't have any pages associated with it,
                or you may need to grant additional permissions.
              </p>
              <button
                onClick={getFacebookPages}
                disabled={loading}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Pages</span>
              </button>
            </div>
          )}
      </div>
    </div>
  );
}

// Main export component with Suspense boundary
export default function FacebookIntegration() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading Facebook integration...</p>
        </div>
      </div>
    }>
      <FacebookIntegrationContent />
    </Suspense>
  );
}