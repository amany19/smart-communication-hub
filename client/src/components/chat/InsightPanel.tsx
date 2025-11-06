"use client";

import { useReceiver } from "@/context/ReceiverContext";
import { useInsights } from "@/hooks/useInsights";

export default function InsightsPanel() {
  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "POSITIVE":
        return "bg-green-500/20 text-green-700 border-green-500/40";
      case "NEGATIVE":
        return "bg-red-500/20 text-red-700 border-red-500/40";
      case "NEUTRAL":
        return "bg-purple-500/20 text-purple-700 border-purple-500/40";
      default:
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500/40";
    }
  };
  const { receiver } = useReceiver()
  const receiverId = receiver?.id
  const { insights, loading, error } = useInsights(receiverId);

  return (
    <aside className="w-full h-full bg-surface dark:bg-darkSurface overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 p-4 pb-0">
        <h2 className="font-semibold text-lg text-text dark:text-darkText">
          AI Insights
        </h2>

        {/* {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="text-sm bg-primary text-white px-3 py-1 rounded-md hover:bg-primary-dark transition disabled:opacity-50"
          >
            {loading ? "..." : "Refresh"}
          </button>
        )} */}
      </div>

      {/* Content */}
      <div className="p-2">
        {/* Error State */}
        {error && (
          <p className="text-red-600 text-sm p-3 border border-red-300 rounded">
            {error}
          </p>
        )}

        {/* Loading State */}
        {loading && !insights && (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-border rounded w-1/3"></div>
            <div className="h-16 bg-border rounded"></div>
          </div>
        )}
        {/* No chat opened State */}
        {!loading && !receiver && !error && (
          <p className="text-text-muted text-sm">
            Select a conversation to get insights..
          </p>
        )}
        {/* Empty State */}
        {!loading && receiver && !insights?.sentiment && !insights?.summary && !error && (
          <p className="text-text-muted text-sm">
            No insights available for this conversation yet.
          </p>
        )}

        {/* Render Insights */}
        {insights && (
          <div className="space-y-4">
            {/* Sentiment badge */}
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs border ${getSentimentColor(
                insights.sentiment
              )}`}
            >
              Sentiment: {insights.sentiment}
            </span>

            {/* Summary */}
            <div className="p-3 rounded-lg bg-background dark:bg-darkBg border border-border">
              <p className="text-sm text-text dark:text-darkText leading-relaxed">
                {insights?.summary}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}