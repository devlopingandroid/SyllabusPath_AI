import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, FileText, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RoadmapCard from '../components/RoadmapCard';
import { planService, topicService, videoService, progressService, Topic, Video } from '../lib/api';

interface TopicWithVideosAndProgress extends Topic {
  videos: Video[];
  progress: number;
}

export default function Dashboard() {
  const [syllabusContent, setSyllabusContent] = useState('');
  const [planTitle, setPlanTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [roadmapTopics, setRoadmapTopics] = useState<TopicWithVideosAndProgress[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);

  useEffect(() => {
    loadLatestPlan();
  }, []);

  const loadLatestPlan = async () => {
    try {
      const plans = await planService.getPlans();
      if (plans.length > 0) {
        const latestPlan = plans[0];
        setCurrentPlanId(latestPlan.id);
        setPlanTitle(latestPlan.title);
        await loadRoadmap(latestPlan.id);
      }
    } catch (error) {
      console.error('Error loading plans:', error);
    }
  };

  const loadRoadmap = async (planId: string) => {
    try {
      const topics = await topicService.getTopicsByPlan(planId);
      const allProgress = await progressService.getAllProgress();

      const topicsWithData = await Promise.all(
        topics.map(async (topic) => {
          const videos = await videoService.getVideosByTopic(topic.id);
          const progress = allProgress.find((p) => p.topic_id === topic.id);
          return {
            ...topic,
            videos,
            progress: progress?.progress_percentage || 0,
          };
        })
      );

      setRoadmapTopics(topicsWithData);
    } catch (error) {
      console.error('Error loading roadmap:', error);
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!syllabusContent.trim()) return;

    setLoading(true);
    try {
      const plan = await planService.createPlan(
        syllabusContent,
        planTitle || 'My Study Plan'
      );
      setCurrentPlanId(plan.id);

      const mockTopics = [
        {
          title: 'Introduction to the Subject',
          description: 'Learn the fundamentals and core concepts',
          difficulty: 'Beginner' as const,
          estimated_minutes: 45,
          order_index: 0,
        },
        {
          title: 'Core Concepts and Theory',
          description: 'Deep dive into essential theories and principles',
          difficulty: 'Intermediate' as const,
          estimated_minutes: 90,
          order_index: 1,
        },
        {
          title: 'Practical Applications',
          description: 'Apply your knowledge through hands-on exercises',
          difficulty: 'Intermediate' as const,
          estimated_minutes: 120,
          order_index: 2,
        },
        {
          title: 'Advanced Topics',
          description: 'Master complex concepts and techniques',
          difficulty: 'Advanced' as const,
          estimated_minutes: 150,
          order_index: 3,
        },
      ];

      const createdTopics = await Promise.all(
        mockTopics.map((topic) => topicService.createTopic(plan.id, topic))
      );

      const mockVideos = [
        {
          title: 'Complete Beginner Guide',
          channel: 'Learn With Us',
          url: 'https://youtube.com/watch?v=example1',
        },
        {
          title: 'Understanding the Basics',
          channel: 'Education Hub',
          url: 'https://youtube.com/watch?v=example2',
        },
        {
          title: 'Key Concepts Explained',
          channel: 'Tech Academy',
          url: 'https://youtube.com/watch?v=example3',
        },
      ];

      for (const topic of createdTopics) {
        await Promise.all(
          mockVideos.map((video, index) =>
            videoService.createVideo(topic.id, { ...video, order_index: index })
          )
        );
      }

      await loadRoadmap(plan.id);
      setSyllabusContent('');
    } catch (error) {
      console.error('Error generating roadmap:', error);
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Create personalized study plans from any syllabus content
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Syllabus Input</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Plan Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={planTitle}
                      onChange={(e) => setPlanTitle(e.target.value)}
                      placeholder="e.g., Computer Science 101"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="syllabus"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Syllabus Content
                    </label>
                    <textarea
                      id="syllabus"
                      value={syllabusContent}
                      onChange={(e) => setSyllabusContent(e.target.value)}
                      placeholder="Paste your syllabus here or describe what you want to learn..."
                      rows={12}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <button
                    onClick={handleGenerateRoadmap}
                    disabled={loading || !syllabusContent.trim()}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Generate Roadmap</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Study Roadmap</h2>
                <p className="text-gray-600">
                  {roadmapTopics.length > 0
                    ? 'Follow this personalized path to master your subject'
                    : 'Generate a roadmap to get started'}
                </p>
              </div>

              {roadmapTopics.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Roadmap Yet</h3>
                  <p className="text-gray-600">
                    Enter your syllabus content and click "Generate Roadmap" to create your
                    personalized study plan
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {roadmapTopics.map((topic) => (
                    <RoadmapCard
                      key={topic.id}
                      topic={topic}
                      videos={topic.videos}
                      progress={topic.progress}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
