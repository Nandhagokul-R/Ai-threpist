import React from 'react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts';
import type { Sentiment, SentimentTrend } from '../types';

interface SentimentChartProps {
  data: SentimentTrend[];
}

const sentimentToValue = (sentiment: Sentiment): number => {
  switch (sentiment) {
    case 'Positive': return 2;
    case 'Mixed': return 1;
    case 'Neutral': return 0;
    case 'Negative': return -1;
    default: return 0;
  }
};

const valueToSentiment = (value: number): string => {
  switch (value) {
    case 2: return 'Positive';
    case 1: return 'Mixed';
    case 0: return 'Neutral';
    case -1: return 'Negative';
    default: return '';
  }
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const sentimentColors = {
      Positive: 'text-green-400',
      Negative: 'text-red-400',
      Neutral: 'text-gray-400',
      Mixed: 'text-yellow-400',
    };

    return (
      <div className="p-4 bg-gray-800 border border-gray-600 rounded-lg shadow-xl text-sm">
        <p className="font-bold text-gray-200">{label}</p>
        <p className={`font-semibold my-1 ${sentimentColors[data.sentiment]}`}>Sentiment: {data.sentiment}</p>
        <p className="text-gray-300 whitespace-normal max-w-xs">{data.summary}</p>
      </div>
    );
  }
  return null;
};

const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    ...item,
    value: sentimentToValue(item.sentiment),
  }));

  const lastSentiment = data[data.length - 1]?.sentiment || 'Neutral';
  const firstSentiment = data[0]?.sentiment || 'Neutral';

  const getTrendStatus = () => {
    const start = sentimentToValue(firstSentiment);
    const end = sentimentToValue(lastSentiment);
    if (end > start) return { text: 'Improving', color: 'text-emerald-400', icon: '📈' };
    if (end < start) return { text: 'Declining', color: 'text-amber-400', icon: '📉' };
    return { text: 'Stable', color: 'text-blue-400', icon: '↔️' };
  };

  const trend = getTrendStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-gray-900/40 p-4 rounded-xl border border-gray-700/50">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Overall Mood Status</p>
          <h4 className={`text-2xl font-black ${trend.color} flex items-center`}>
            <span className="mr-2">{trend.icon}</span>
            {trend.text}
          </h4>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Latest Sentiment</p>
          <p className="text-lg font-semibold text-gray-200">{lastSentiment}</p>
        </div>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.4} />
            <XAxis dataKey="period" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              stroke="#94a3b8"
              domain={[-1.5, 2.5]}
              ticks={[-1, 0, 1, 2]}
              tickFormatter={valueToSentiment}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#10b981', strokeWidth: 1.5, strokeDasharray: '5 5' }} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="url(#colorSentiment)"
              strokeWidth={4}
              dot={{ r: 6, fill: '#1e293b', stroke: '#10b981', strokeWidth: 2 }}
              activeDot={{ r: 8, fill: '#10b981', stroke: '#1e293b', strokeWidth: 2 }}
              animationDuration={2000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SentimentChart;
