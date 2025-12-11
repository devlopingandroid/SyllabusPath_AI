import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Target, Award } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnalyticsChart from '../components/AnalyticsChart';
import { planService, topicService, progressService } from '../lib/api';

interface AnalyticsData {
  averageProgress: number;
  totalTopics: number;
  completedTopics: number;
  totalTimeSpent: number;
  hardestTopics: { name: string; value: number }[];
  slowestTopics: { name: string; value: number }[];
  progressByDifficulty: { name: string; value: number }[];
}

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    averageProgress: 0,
    totalTopics: 0,
    completedTopics: 0,
    totalTimeSpent: 0,
    hardestTopics: [],
    slowestTopics: [],
    progressByDifficulty: [],
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const plans = await planService.getPlans();
      if (plans.length === 0) {
        setLoading(false);
        return;
      }

      let allTopics: any[] = [];
      for (const plan of plans) {
        const topics = await topicService.getTopicsByPlan(plan.id);
        allTopics = [...allTopics, ...topics];
      }

      const allProgress = await progressService.getAllProgress();

      const totalTopics = allTopics.length;
      const completedTopics = allProgress.filter((p) => p.progress_percentage === 100).length;
      const totalTimeSpent = allProgress.reduce((sum, p) => sum + p.time_spent_minutes, 0);
      const averageProgress =
        allProgress.length > 0
          ? Math.round(
              allProgress.reduce((sum, p) => sum + p.progress_percentage, 0) / allProgress.length
            )
          : 0;

      const topicsWithProgress = allTopics.map((topic) => {
        const progress = allProgress.find((p) => p.topic_id === topic.id);
        return {
          ...topic,
          progress: progress?.progress_percentage || 0,
        };
      });

      const hardestTopics = topicsWithProgress
        .filter((t) => t.difficulty === 'Advanced')
        .slice(0, 5)
        .map((t) => ({
          name: t.title.length > 20 ? t.title.substring(0, 20) + '...' : t.title,
          value: t.progress,
        }));

      const slowestTopics = topicsWithProgress
        .sort((a, b) => a.progress - b.progress)
        .slice(0, 5)
        .map((t) => ({
          name: t.title.length > 20 ? t.title.substring(0, 20) + '...' : t.title,
          value: t.progress,
        }));

      const difficultyGroups = {
        Beginner: 0,
        Intermediate: 0,
        Advanced: 0,
      };

      const difficultyCounts = {
        Beginner: 0,
        Intermediate: 0,
        Advanced: 0,
      };

      topicsWithProgress.forEach((topic) => {
        if (topic.difficulty in difficultyGroups) {
          difficultyGroups[topic.difficulty as keyof typeof difficultyGroups] += topic.progress;
          difficultyCounts[topic.difficulty as keyof typeof difficultyCounts]++;
        }
      });

      const progressByDifficulty = Object.keys(difficultyGroups).map((key) => ({
        name: key,
        value: Math.round(
          difficultyGroups[key as keyof typeof difficultyGroups] /
            (difficultyCounts[key as keyof typeof difficultyCounts] || 1)
        ),
      }));

      setAnalytics({
        averageProgress,
        totalTopics,
        completedTopics,
        totalTimeSpent,
        hardestTopics,
        slowestTopics,
        progressByDifficulty,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    suffix = '',
    color = 'blue',
  }: {
    icon: any;
    title: string;
    value: number;
    suffix?: string;
    color?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center mb-4`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">
        {value}
        {suffix}
      </p>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600">Track your learning progress and insights</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={TrendingUp}
              title="Average Progress"
              value={analytics.averageProgress}
              suffix="%"
              color="blue"
            />
            <StatCard
              icon={Target}
              title="Total Topics"
              value={analytics.totalTopics}
              color="green"
            />
            <StatCard
              icon={Award}
              title="Completed Topics"
              value={analytics.completedTopics}
              color="purple"
            />
            <StatCard
              icon={Clock}
              title="Total Time Spent"
              value={analytics.totalTimeSpent}
              suffix=" min"
              color="orange"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {analytics.hardestTopics.length > 0 && (
              <AnalyticsChart
                data={analytics.hardestTopics}
                title="Hardest Topics Progress"
                color="#EF4444"
              />
            )}

            {analytics.slowestTopics.length > 0 && (
              <AnalyticsChart
                data={analytics.slowestTopics}
                title="Slowest Topics Progress"
                color="#F59E0B"
              />
            )}
          </div>

          {analytics.progressByDifficulty.length > 0 && (
            <div className="mb-8">
              <AnalyticsChart
                data={analytics.progressByDifficulty}
                title="Progress by Difficulty Level"
                color="#2563EB"
              />
            </div>
          )}

          {analytics.totalTopics === 0 && (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Yet</h3>
              <p className="text-gray-600">
                Create a study plan and start tracking your progress to see analytics
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
