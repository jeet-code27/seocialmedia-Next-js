"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
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
import React, { useState, useEffect, Suspense } from "react";
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
      if (typeof latestValue.value === "object" && latestValue.value !== null) {
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
export const renderInsights = ({ pageInsights, insightsLoading }) => {
  const [expandedMetric, setExpandedMetric] = useState(null);
  if (!pageInsights) return null;

  if (pageInsights.error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Page Insights</h2>
        <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-0.5">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900">
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
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 mb-4">
      {/* Header - Mobile Optimized */}
      <div className=" border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Insights</h2>
          {insightsLoading && (
            <div className="bg-blue-50 p-2 rounded-lg">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600">Performance analytics</p>
      </div>

      {/* Page Info Card */}
      {pageInsights.pageInfo && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-0.5 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold truncate pr-2">
              {pageInsights.pageInfo.name}
            </h3>
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap">
              {pageInsights.pageInfo.category || "Business"}
            </span>
          </div>

          {/* Compact 2x2 Grid for Mobile */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 opacity-90" />
              <p className="text-2xl font-bold mb-0.5">
                {(pageInsights.pageInfo.followers_count / 1000).toFixed(1)}K
              </p>
              <p className="text-blue-100 text-xs font-medium">Followers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <Heart className="w-6 h-6 mx-auto mb-2 opacity-90" />
              <p className="text-2xl font-bold mb-0.5">
                {(pageInsights.pageInfo.fan_count / 1000).toFixed(1)}K
              </p>
              <p className="text-blue-100 text-xs font-medium">Fans</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 opacity-90" />
              <p className="text-2xl font-bold mb-0.5">
                {pageInsights.period || "28"}
              </p>
              <p className="text-blue-100 text-xs font-medium">Days</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <BarChart3 className="w-6 h-6 mx-auto mb-2 opacity-90" />
              <p className="text-2xl font-bold mb-0.5">
                {pageInsights.debug?.successfulMetrics || 0}
              </p>
              <p className="text-blue-100 text-xs font-medium">Metrics</p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Metrics List */}
      {pageInsights.insights &&
      Object.keys(pageInsights.insights).length > 0 ? (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-gray-900">Metrics</h4>
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <Activity className="w-3 h-3" />
              <span>5 days</span>
            </div>
          </div>

          {/* Vertical List for Mobile */}
          <div className="space-y-3">
            {Object.entries(pageInsights.insights).map(([key, insight]) => {
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
                      date: new Date(v.end_time).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      }),
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
                    onClick={() => setExpandedMetric(isExpanded ? null : key)}
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
                          <span>{Math.abs(parseFloat(percentageChange))}%</span>
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
            })}
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
