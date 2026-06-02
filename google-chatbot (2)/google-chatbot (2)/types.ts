export type MessageSentiment = 'Supportive' | 'Empathetic' | 'Neutral';
export type MoodState = 'Sadness' | 'Anger' | 'Anxiety' | 'Stress' | 'Neutral';

export interface Recommendation {
  type: 'game' | 'music';
  title: string;
  url: string;
  description?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  sentiment?: MessageSentiment;
  recommendation?: Recommendation;
  mood?: MoodState;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
}

export type Sentiment = 'Positive' | 'Negative' | 'Neutral' | 'Mixed';

export interface SentimentTrend {
  period: string;
  sentiment: Sentiment;
  summary: string;
}

export interface AnalysisResult {
  overallSummary: string;
  keyEmotions: { emotion: string; reason: string }[];
  sentimentTrend: SentimentTrend[];
  recommendations: { title: string; description: string }[];
}