
import React from 'react';
import { EmotionStat, Message, Emotion } from '../types';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

const EMOJI_MAP: Record<Emotion, string> = {
  happy: "😊",
  sad: "😔",
  anxious: "😰",
  angry: "😡",
  stressed: "😩",
  neutral: "😐",
};

const MINDFULNESS_EMOJIS = [
  { threshold: 0, icon: "🌧️", label: "Just starting" },
  { threshold: 3, icon: "🌤️", label: "Warming up" },
  { threshold: 6, icon: "☀️", label: "Mindful" },
  { threshold: 10, icon: "🌈", label: "Very mindful" },
];

interface MoodDashboardProps {
  messages: Message[];
  onBack: () => void;
}

const MOOD_COLORS: Record<Emotion, string> = {
  happy: '#facc15',   // yellow-400
  sad: '#60a5fa',     // blue-400
  anxious: '#a855f7', // purple-500
  angry: '#f97373',   // red-400
  stressed: '#fb923c',// orange-400
  neutral: '#9ca3af', // gray-400
};

const MoodDashboard: React.FC<MoodDashboardProps> = ({ messages, onBack }) => {
  // Aggregate stats from local messages (mocking API behavior)
  const stats: Record<Emotion, number> = {
    happy: 0,
    sad: 0,
    anxious: 0,
    angry: 0,
    stressed: 0,
    neutral: 0,
  };

  messages.forEach((msg) => {
    if (msg.role === 'user' && msg.emotion) {
      stats[msg.emotion]++;
    }
  });

  const chartData: EmotionStat[] = [
    { emotion: 'happy', count: stats.happy, color: 'bg-yellow-400' },
    { emotion: 'sad', count: stats.sad, color: 'bg-blue-400' },
    { emotion: 'anxious', count: stats.anxious, color: 'bg-purple-400' },
    { emotion: 'angry', count: stats.angry, color: 'bg-red-400' },
    { emotion: 'stressed', count: stats.stressed, color: 'bg-orange-400' },
  ];

  const totalEmotions = chartData.reduce((acc, curr) => acc + curr.count, 0);
  const maxCount = Math.max(...chartData.map(d => d.count), 1);
  const dominantMood = chartData.reduce((prev, current) => (prev.count > current.count) ? prev : current);

  // Build time-series data for line graph based on user messages with emotions
  const userEmotionMessages = messages.filter(
    (m) => m.role === 'user' && m.emotion && m.emotion !== 'neutral'
  );

  let happyCount = 0;
  let sadCount = 0;
  let anxiousCount = 0;
  let angryCount = 0;
  let stressedCount = 0;

  const trendData = userEmotionMessages.map((m, index) => {
    switch (m.emotion) {
      case 'happy':
        happyCount++;
        break;
      case 'sad':
        sadCount++;
        break;
      case 'anxious':
        anxiousCount++;
        break;
      case 'angry':
        angryCount++;
        break;
      case 'stressed':
        stressedCount++;
        break;
      default:
        break;
    }

    const dataPoint = {
      index: index + 1,
      happy: happyCount,
      sad: sadCount,
      anxious: anxiousCount,
      angry: angryCount,
      stressed: stressedCount,
    };

    return {
      ...dataPoint,
      positive: dataPoint.happy,
      negative:
        dataPoint.sad +
        dataPoint.anxious +
        dataPoint.angry +
        dataPoint.stressed,
    };
  });

  return (
    <div className="flex flex-col h-full bg-emerald-50 animate-in fade-in duration-500">
      <div className="p-6 max-w-4xl mx-auto w-full space-y-6 overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Your Emotional Wellness</h2>
            <p className="text-sm text-slate-500">Insights based on your recent conversations</p>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-emerald-600 font-semibold rounded-xl shadow-sm border border-emerald-100 hover:bg-emerald-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Chat</span>
          </button>
        </div>

        {/* Stats Grid with emoji visuals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Moments */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Moments
            </span>
            <p className="text-xl font-semibold text-emerald-600 mt-1">
              {totalEmotions === 0 ? "—" : "🧠".repeat(Math.min(totalEmotions, 5))}
            </p>
            <p className="text-xs text-slate-400 mt-1">{totalEmotions} entries</p>
          </div>

          {/* Dominant Mood */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Dominant Mood
            </span>
            {totalEmotions > 0 ? (
              <div className="mt-1 flex items-center space-x-2">
                <span className="text-3xl">
                  {EMOJI_MAP[dominantMood.emotion]}
                </span>
                <span className="text-lg font-semibold text-slate-800 capitalize">
                  {dominantMood.emotion}
                </span>
              </div>
            ) : (
              <p className="text-lg font-semibold text-slate-400 mt-1">N/A</p>
            )}
          </div>

          {/* (Removed Mindfulness Level card as requested) */}
        </div>

        {/* Chart Card: Bar-style distribution + Pie chart */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <h3 className="text-lg font-bold text-slate-800">Mood Distribution</h3>
          
          {/* Existing bar representation */}
          <div className="flex flex-col space-y-6">
            {chartData.map((data) => (
              <div key={data.emotion} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-slate-600 capitalize">
                    {EMOJI_MAP[data.emotion]} {data.emotion}
                  </span>
                  <span className="text-slate-400 font-medium">{data.count} times</span>
                </div>
                <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                  <div 
                    className={`h-full ${data.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${(data.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Pie chart representation */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-700 mb-4">Mood Distribution (Pie Chart)</h4>
            {totalEmotions > 0 ? (
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="count"
                      nameKey="emotion"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ percent, name }) =>
                        percent && percent > 0.08 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                      }
                    >
                      {chartData.map((entry) => (
                        <Cell
                          key={entry.emotion}
                          fill={MOOD_COLORS[entry.emotion]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${value} times`, 'Count']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-slate-400">Start sharing how you feel to see your mood distribution.</p>
            )}
          </div>
        </div>

        {/* Mood Trend Line Chart (Positive vs Negative) */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Mood Trend Over Time</h3>
          <p className="text-xs text-slate-500 mb-4">
            A simple view of how positive and heavier (sad, anxious, angry, stressed) feelings
            build up across your recent messages.
          </p>
          {trendData.length > 0 ? (
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="index"
                    tick={{ fontSize: 10 }}
                    label={{
                      value: 'Message number (time)',
                      position: 'insideBottom',
                      offset: -2,
                      style: { fontSize: 11, fill: '#111827', textAnchor: 'middle' },
                    }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 10 }}
                    label={{
                      value: 'Cumulative feelings',
                      angle: -90,
                      position: 'insideLeft',
                      offset: 10,
                      style: { fontSize: 11, fill: '#111827', textAnchor: 'middle' },
                    }}
                  />
                  <Tooltip />
                  <Legend verticalAlign="top" height={24} />
                  <Line
                    type="monotone"
                    dataKey="positive"
                    name="Positive (happy)"
                    stroke={MOOD_COLORS.happy}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="negative"
                    name="Heavier feelings"
                    stroke={MOOD_COLORS.sad}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              Once you share a few feelings, you'll see how your moods shift over time.
            </p>
          )}
        </div>

        {/* Insight Card */}
        <div className="bg-emerald-600 p-8 rounded-3xl shadow-lg shadow-emerald-200 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-2">Weekly Mindfulness Insight</h3>
            <p className="text-emerald-50 text-sm leading-relaxed max-w-lg">
              {totalEmotions > 0 
                ? `You've expressed ${dominantMood.emotion} feelings most often recently. Taking short 5-minute walks could help balance your energy today.`
                : "Welcome to your wellness journey. Once you start sharing, I'll provide personalized insights here to help you understand your patterns."}
            </p>
          </div>
          <svg className="absolute top-0 right-0 w-32 h-32 text-white/10 -mr-8 -mt-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MoodDashboard;
