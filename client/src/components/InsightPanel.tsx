"use client";
import { Insight } from "@/types";

interface InsightsPanelProps {
  data?: Insight;
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
}

export default function InsightsPanel({
  data,
  loading = false,
  error,
  onRefresh,
}: InsightsPanelProps) {
  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-500/20 text-green-700 border-green-500/40";
      case "negative":
        return "bg-red-500/20 text-red-700 border-red-500/40";
      case "mixed":
        return "bg-purple-500/20 text-purple-700 border-purple-500/40";
      default:
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500/40";
    }
  };

  return (
    <aside
      className="w-full md:w-[320px] bg-surface dark:bg-darkSurface border-l border-border p-1 overflow-y-auto h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg text-text dark:text-darkText">
          AI Insights
        </h2>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="text-sm bg-primary text-white px-3 py-1 rounded-md hover:bg-primary-dark transition disabled:opacity-50"
          >
            {loading ? "..." : "Refresh"}
          </button>
        )}
      </div>

      {/* Error State */}
      {error && (
        <p className="text-red-600 text-sm p-3 border border-red-300 rounded">
          {error}
        </p>
      )}

      {/* Loading State */}
      {loading && !data && (
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-border rounded w-1/3"></div>
          <div className="h-16 bg-border rounded"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !data && !error && (
        <p className="text-text-muted text-sm">
          No insights available for this conversation yet.
        </p>
      )}

      {/* Render Insights */}
      {data && (
        <>
          {/* Sentiment badge */}
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs border ${getSentimentColor(
              data.sentiment
            )} mb-3`}
          >
            Sentiment: {data.sentiment}
          </span>

          {/* Summary */}
          <div className="p-3 mr-6 rounded-lg bg-background dark:bg-darkBg border border-border mb-3">
            <p className="text-sm text-text dark:text-darkText leading-relaxed">
              {data?.summary}
            </p>
          </div>

        </>
      )}
    </aside>
  );
}