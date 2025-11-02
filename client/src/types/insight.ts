export type Sentiment = "positive" | "neutral" | "negative" | "mixed";

export interface Insight {
  summary: string;
  sentiment: Sentiment;
  tags?: string[];
  confidence?: number;  
  updatedAt?: string;
}
