"use client";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  LabelList,
} from "recharts";
import {
  BarChart3,
  AlertCircle,
  RefreshCw,
  Heart,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  MessageCircle,
  Share2,
  ChevronRight,
  Facebook,
  Users,
  FileText,
  Unlink,
  CheckCircle,
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
  const [pageInsights, setPageInsights] = useState({});
  const [pagePosts, setPagePosts] = useState({});
  const [loadingState, setLoadingState] = useState({}); // { [pageId]: true/false }
  const [facebookPages, setFacebookPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedMetric, setExpandedMetric] = useState(null);
  const [chartType, setChartType] = useState("pie");
  const [expandedPosts, setExpandedPosts] = useState({});
  // Your backend API base URL
  const API_BASE = "https://api.seocialmedia.in/api";

  // Mock auth token - replace this with your actual auth token
  const authToken = tokenFromQuery;

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
      // Auto-select the first page if none selected
      if (
        (!selectedPage || selectedPage === null) &&
        response.data.pages &&
        response.data.pages.length > 0
      ) {
        setSelectedPage(response.data.pages[0].id);
      }
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
    setLoadingState((prev) => ({
      ...prev,
      [pageId]: { ...(prev[pageId] || {}), insights: true },
    }));
    setError("");

    try {
      console.log("Fetching insights for page:", pageId);
      const response = await apiCall(
        `/facebook/pages/${pageId}/insights?period=28`
      );
      console.log("Received insights response:", response);

      setPageInsights((prev) => ({
        ...prev,
        [pageId]: response.data,
      }));
    } catch (err) {
      console.error("Error fetching insights:", err);
      setError(err.message || "Failed to get page insights");
      setPageInsights((prev) => ({
        ...prev,
        [pageId]: {
          error: true,
          message: err.message || "Failed to get page insights",
        },
      }));
    } finally {
      setLoadingState((prev) => ({
        ...prev,
        [pageId]: { ...(prev[pageId] || {}), insights: false },
      }));
    }
  };
  const getPagePosts = async (pageId) => {
    setLoadingState((prev) => ({
      ...prev,
      [pageId]: { ...(prev[pageId] || {}), posts: true },
    }));
    setError("");

    try {
      const response = await apiCall(
        `/facebook/pages/${pageId}/posts?limit=10`
      );
      setPagePosts((prev) => ({
        ...prev,
        [pageId]: response.data.posts || response.data || [],
      }));
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err.message || "Failed to get page posts");
      setPagePosts((prev) => ({
        ...prev,
        [pageId]: [],
      }));
    } finally {
      setLoadingState((prev) => ({
        ...prev,
        [pageId]: { ...(prev[pageId] || {}), posts: false },
      }));
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
      // keep state shapes consistent (objects) to avoid runtime indexing errors
      setPageInsights({});
      setPagePosts({});
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
  //  insights
  const renderInsights = () => {
    const currentInsights = pageInsights[selectedPage];
    const isLoading = loadingState[selectedPage]?.insights;
    const data = [
      {
        name: "Followers",
        value: currentInsights?.pageInfo?.followers_count || 0,
      },
      { name: "Fans", value: currentInsights?.pageInfo?.fan_count || 0 },
      { name: "Days", value: currentInsights?.period || 28 },
      {
        name: "Metrics",
        value: currentInsights?.debug?.successfulMetrics || 0,
      },
    ];

    const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];

    if (!currentInsights) return null;

    if (currentInsights.error) {
      return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Page Insights
          </h2>
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900">
                  Unable to load insights
                </h3>
                <p className="text-red-700 text-sm mt-1">
                  {currentInsights.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 mb-4">
        {/* Header - Mobile Optimized */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Insights</h2>
            {insightsLoading && (
              <div className="bg-blue-50 p-2 rounded-lg">
                <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
              </div>
            )}
          </div>
        </div>

        {/* Page Info Card */}
        {currentInsights.pageInfo && (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white rounded-2xl">
            <h2 className="text-center text-lg font-bold truncate pr-2 m-5">
              Performance Analytics
            </h2>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold truncate pr-2">
                {currentInsights.pageInfo.name}
              </h3>
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap">
                {currentInsights.pageInfo.category || "Business"}
              </span>
            </div>

            {/* Chart Type Toggle */}
            <div className="mb-4 flex justify-end items-center space-x-2">
              <span className="text-white text-sm">Pie</span>
              <button
                onClick={() =>
                  setChartType(chartType === "pie" ? "bar" : "pie")
                }
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                  chartType === "pie" ? "bg-green-500" : "bg-gray-400"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    chartType === "pie" ? "translate-x-0" : "translate-x-6"
                  }`}
                />
              </button>
              <span className="text-white text-sm">Bar</span>
            </div>

            {/* Render Chart */}
            <div style={{ width: "100%", height: 200 }}>
              <ResponsiveContainer>
                {chartType === "pie" ? (
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      fill="#8884d8"
                      label
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                ) : (
                  <BarChart
                    data={data}
                    margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                  >
                    <XAxis dataKey="name" tick={{ fill: "white" }} />
                    <YAxis tick={{ fill: "white" }} />
                    <Tooltip />
                    <Bar dataKey="value">
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Optional compact stats grid */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <Users className="w-6 h-6 mx-auto mb-2 opacity-90 text-blue-100" />
                <p className="text-2xl font-bold mb-0.5">
                  {(currentInsights.pageInfo.followers_count / 1000).toFixed(1)}
                  K
                </p>
                <p className="text-blue-100 text-xs font-medium">Followers</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <Heart className="w-6 h-6 mx-auto mb-2 opacity-90 text-red-500" />
                <p className="text-2xl font-bold mb-0.5">
                  {(currentInsights.pageInfo.fan_count / 1000).toFixed(1)}K
                </p>
                <p className="text-blue-100 text-xs font-medium">Fans</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <Calendar className="w-6 h-6 mx-auto mb-2 opacity-90" />
                <p className="text-2xl font-bold mb-0.5">
                  {currentInsights.period || 28}
                </p>
                <p className="text-blue-100 text-xs font-medium">Days</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <BarChart3 className="w-6 h-6 mx-auto mb-2 opacity-90 text-green-400" />
                <p className="text-2xl font-bold mb-0.5">
                  {currentInsights.debug?.successfulMetrics || 0}
                </p>
                <p className="text-blue-100 text-xs font-medium">Metrics</p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Metrics List */}
        {currentInsights.insights &&
        Object.keys(currentInsights.insights).length > 0 ? (
          <div className="p-0.5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-900">Metrics</h4>
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <Activity className="w-3 h-3" />
                <span>5 days</span>
              </div>
            </div>

            {/* Vertical List for Mobile */}
            <div className="space-y-3">
              {Object.entries(currentInsights.insights).map(
                ([key, insight]) => {
                  const currentValue = getLatestValue(insight);
                  const previousValue = getPreviousValue(insight);
                  const numericCurrent = getNumericValue(
                    insight,
                    insight.values.length - 1
                  );
                  const percentageChange = getPercentageChange(
                    numericCurrent,
                    previousValue
                  );
                  const isExpanded = expandedMetric === key;

                  const chartData =
                    insight.values && Array.isArray(insight.values)
                      ? insight.values.slice(-5).map((v) => ({
                          date: new Date(v.end_time).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          ),
                          value: getNumericValue(
                            insight,
                            insight.values.indexOf(v)
                          ),
                        }))
                      : [];

                  const isPositive =
                    percentageChange && parseFloat(percentageChange) >= 0;

                  return (
                    <div
                      key={key}
                      className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                    >
                      {/* Compact Header - Always Visible */}
                      <div
                        className="p-4 active:bg-gray-50 transition-colors"
                        onClick={() =>
                          setExpandedMetric(isExpanded ? null : key)
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0">
                              {getMetricIcon(key)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-gray-900 text-sm truncate">
                                {insight.title || formatMetricName(key)}
                              </h5>
                              <p className="text-xs text-gray-500 truncate">
                                {insight.description}
                              </p>
                            </div>
                          </div>
                          <ChevronRight
                            className={`w-5 h-5 text-gray-400 flex-shrink-0 ml-2 transition-transform ${
                              isExpanded ? "rotate-90" : ""
                            }`}
                          />
                        </div>

                        {/* Value and Change - Always Visible */}
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-3xl font-bold text-gray-900">
                            {currentValue}
                          </p>
                          {percentageChange && (
                            <div
                              className={`flex items-center space-x-1 text-xs font-semibold ${
                                isPositive
                                  ? "text-green-700 bg-green-50"
                                  : "text-red-700 bg-red-50"
                              } px-2 py-1 rounded-lg`}
                            >
                              {isPositive ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              <span>
                                {Math.abs(parseFloat(percentageChange))}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Expandable Chart Section */}
                      {isExpanded && chartData.length > 1 && (
                        <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50">
                          <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                            5-Day Trend
                          </p>
                          <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={chartData}>
                              <defs>
                                <linearGradient
                                  id={`gradient-${key}`}
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor="#3b82f6"
                                    stopOpacity={0.3}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor="#3b82f6"
                                    stopOpacity={0}
                                  />
                                </linearGradient>
                              </defs>
                              <XAxis
                                dataKey="date"
                                tick={{ fontSize: 10, fill: "#6b7280" }}
                                tickLine={false}
                                axisLine={{ stroke: "#e5e7eb" }}
                              />
                              <YAxis
                                tick={{ fontSize: 10, fill: "#6b7280" }}
                                tickLine={false}
                                axisLine={{ stroke: "#e5e7eb" }}
                                tickFormatter={(value) => {
                                  if (value >= 1000)
                                    return `${(value / 1000).toFixed(1)}K`;
                                  return value;
                                }}
                              />
                              <Tooltip
                                contentStyle={{
                                  fontSize: "12px",
                                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                                  border: "1px solid #e5e7eb",
                                  borderRadius: "8px",
                                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                }}
                                formatter={(value) => [
                                  value.toLocaleString(),
                                  insight.title,
                                ]}
                              />
                              <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#3b82f6"
                                strokeWidth={2.5}
                                fill={`url(#gradient-${key})`}
                                dot={{
                                  r: 4,
                                  fill: "#3b82f6",
                                  strokeWidth: 2,
                                  stroke: "#fff",
                                }}
                                activeDot={{ r: 5 }}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              No Insights
            </h4>
            <p className="text-sm text-gray-500 mb-6">
              Not enough data available yet
            </p>
            {pageInsights.warning && (
              <div className="text-left bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-start mb-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-900 font-semibold">
                    {pageInsights.warning}
                  </p>
                </div>
                {pageInsights.possibleReasons && (
                  <ul className="text-xs text-yellow-800 space-y-1 ml-6">
                    {pageInsights.possibleReasons.map((reason, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        <span>{reason}</span>
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
  //  post
  const renderPosts = () => {
    const toggleExpand = (postId) => {
      setExpandedPosts((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));
    };
    const currentPosts = (pagePosts && pagePosts[selectedPage]) || [];

    if (!currentPosts || currentPosts.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No posts available</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {currentPosts.map((post, index) => {
          const isExpanded = !!expandedPosts[post.id || index];
          const totalEngagement =
            (post.likes?.summary?.total_count || 0) +
            (post.comments?.summary?.total_count || 0) +
            (post.shares?.count || 0);

          return (
            <div
              key={post.id || index}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Post Image */}
              {post.full_picture && (
                <div className="relative overflow-hidden">
                  <img
                    src={post.full_picture}
                    alt="Post content"
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
                      {post.type || "post"}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-6">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">
                      {formatDate(post.created_time)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-purple-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-bold">{totalEngagement}</span>
                  </div>
                </div>

                {/* Post Content */}
                {post.message && (
                  <p
                    className={`text-gray-900 leading-relaxed mb-4 ${
                      !isExpanded ? "line-clamp-2 overflow-hidden" : ""
                    }`}
                  >
                    {post.message}
                  </p>
                )}
                {post.message && post.message.length > 100 && (
                  <button
                    onClick={() => toggleExpand(post.id || index)}
                    className="text-blue-500 hover:underline"
                  >
                    {isExpanded ? "Less" : "More..."}
                  </button>
                )}

                {/* Mini Engagement Chart */}
                <div className="mb-4">
                  <ResponsiveContainer width="100%" height={60}>
                    <BarChart
                      data={[
                        {
                          likes: post.likes?.summary?.total_count || 0,
                          comments: post.comments?.summary?.total_count || 0,
                          shares: post.shares?.count || 0,
                        },
                      ]}
                      layout="vertical"
                    >
                      <XAxis type="number" hide />
                      <YAxis type="category" hide />
                      <LabelList position="right" formatter={() => "Likes"} />
                      <Bar
                        dataKey="likes"
                        fill="#ec4899"
                        radius={[0, 4, 4, 0]}
                      />
                      <LabelList
                        position="right"
                        formatter={() => "Comments"}
                      />
                      <Bar
                        dataKey="comments"
                        fill="#3b82f6"
                        radius={[0, 4, 4, 0]}
                      />
                      <LabelList position="right" formatter={() => "Shares"} />
                      <Bar
                        dataKey="shares"
                        fill="#10b981"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Engagement Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-pink-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 text-pink-600 mb-1">
                      <Heart className="w-4 h-4" />
                      <span className="font-bold text-lg">
                        {post.likes?.summary?.total_count || 0}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">Likes</p>
                  </div>

                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 text-blue-600 mb-1">
                      <MessageCircle className="w-4 h-4" />
                      <span className="font-bold text-lg">
                        {post.comments?.summary?.total_count || 0}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">
                      Comments
                    </p>
                  </div>

                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 text-green-600 mb-1">
                      <Share2 className="w-4 h-4" />
                      <span className="font-bold text-lg">
                        {post.shares?.count || 0}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">Shares</p>
                  </div>
                </div>

                {/* Post Link */}
                {post.link && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline inline-flex items-center"
                    >
                      View on Facebook
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
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
    <div className="min-h-screen  bg-gray-50 p-0.5">
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
                  Facebook Integration
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
                {facebookPages.map((page) => {
                  const isInsightsLoading = loadingState[page.id]?.insights;
                  const isPostsLoading = loadingState[page.id]?.posts;
                  const insights = pageInsights[page.id];
                  const posts = pagePosts[page.id] || [];

                  return (
                    <div
                      key={page.id}
                      className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50"
                    >
                      {/* Header */}
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

                      {/* Page stats */}
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

                      {/* Buttons */}
                      <div className="space-y-3">
                        {/* Insights Button */}
                        <button
                          onClick={() => {
                            setSelectedPage(page.id);
                            getPageInsights(page.id);
                          }}
                          disabled={isInsightsLoading}
                          className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            insights
                              ? "bg-green-100 text-green-800 border border-green-300"
                              : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                          }`}
                        >
                          <BarChart3 className="w-4 h-4" />
                          <span>
                            {isInsightsLoading
                              ? "Loading Insights..."
                              : insights
                              ? "Insights Loaded ✓"
                              : "Get Insights"}
                          </span>
                          {isInsightsLoading && (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          )}
                        </button>

                        {/* Posts Button */}
                        <button
                          onClick={() => {
                            setSelectedPage(page.id);
                            getPagePosts(page.id);
                          }}
                          disabled={isPostsLoading}
                          className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            posts.length > 0
                              ? "bg-green-100 text-green-800 border border-green-300"
                              : "bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50"
                          }`}
                        >
                          <FileText className="w-4 h-4" />
                          <span>
                            {isPostsLoading
                              ? "Loading Posts..."
                              : posts.length > 0
                              ? `${posts.length} Posts Loaded ✓`
                              : "Get Posts"}
                          </span>
                          {isPostsLoading && (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          )}
                        </button>
                      </div>

                      {/* Quick Actions */}
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedPage(page.id);
                              getPageInsights(page.id);
                              getPagePosts(page.id);
                            }}
                            disabled={isInsightsLoading || isPostsLoading}
                            className="flex-1 text-xs text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 transition-colors"
                          >
                            {isInsightsLoading || isPostsLoading ? (
                              <span className="flex items-center space-x-1">
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                <span>Loading...</span>
                              </span>
                            ) : (
                              "Load All Data"
                            )}
                          </button>

                          <button
                            onClick={() => {
                              setPageInsights((prev) => ({
                                ...prev,
                                [page.id]: null,
                              }));
                              setPagePosts((prev) => ({
                                ...prev,
                                [page.id]: [],
                              }));
                            }}
                            className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading Facebook integration...</p>
          </div>
        </div>
      }
    >
      <FacebookIntegrationContent />
    </Suspense>
  );
}
