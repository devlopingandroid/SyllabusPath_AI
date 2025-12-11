import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProgressBar from '../components/ProgressBar';
import { planService, topicService, progressService } from '../lib/api';

interface TopicOption {
  id: string;
  title: string;
  planId: string;
  planTitle: string;
  currentProgress: number;
}

export default function ProgressTracker() {
  const [topics, setTopics] = useState<TopicOption[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      const plans = await planService.getPlans();
      const allProgress = await progressService.getAllProgress();

      const allTopics: TopicOption[] = [];
      for (const plan of plans) {
        const planTopics = await topicService.getTopicsByPlan(plan.id);
        planTopics.forEach((topic) => {
          const topicProgress = allProgress.find((p) => p.topic_id === topic.id);
          allTopics.push({
            id: topic.id,
            title: topic.title,
            planId: plan.id,
            planTitle: plan.title,
            currentProgress: topicProgress?.progress_percentage || 0,
          });
        });
      }

      setTopics(allTopics);
      if (allTopics.length > 0) {
        setSelectedTopicId(allTopics[0].id);
        setProgress(allTopics[0].currentProgress);
      }
    } catch (error) {
      console.error('Error loading topics:', error);
    }
  };

  const handleTopicChange = (topicId: string) => {
    setSelectedTopicId(topicId);
    const topic = topics.find((t) => t.id === topicId);
    if (topic) {
      setProgress(topic.currentProgress);
    }
    setMessage(null);
  };

  const handleSaveProgress = async () => {
    if (!selectedTopicId) return;

    setLoading(true);
    setMessage(null);

    try {
      await progressService.updateProgress(selectedTopicId, progress);
      setMessage({
        type: 'success',
        text: 'Progress updated successfully!',
      });

      await loadTopics();
    } catch (error) {
      console.error('Error saving progress:', error);
      setMessage({
        type: 'error',
        text: 'Failed to save progress. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedTopic = topics.find((t) => t.id === selectedTopicId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Tracker</h1>
            <p className="text-gray-600">Update your learning progress for each topic</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-md p-8"
          >
            {topics.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Topics Found</h3>
                <p className="text-gray-600">
                  Create a study plan first to track your progress
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg flex items-center space-x-3 ${
                      message.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-red-50 border border-red-200 text-red-700'
                    }`}
                  >
                    {message.type === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span className="font-medium">{message.text}</span>
                  </motion.div>
                )}

                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Topic
                  </label>
                  <select
                    id="topic"
                    value={selectedTopicId}
                    onChange={(e) => handleTopicChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {topics.map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.planTitle} - {topic.title}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedTopic && (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Current Progress</span>
                      <span className="text-sm font-semibold text-blue-600">
                        {selectedTopic.currentProgress}%
                      </span>
                    </div>
                    <ProgressBar progress={selectedTopic.currentProgress} />
                  </div>
                )}

                <div>
                  <label htmlFor="progress" className="block text-sm font-medium text-gray-700 mb-2">
                    New Progress ({progress}%)
                  </label>
                  <div className="space-y-2">
                    <input
                      id="progress"
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={(e) => setProgress(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                      <span>75%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900">Preview</span>
                    <span className="text-sm font-semibold text-blue-600">{progress}%</span>
                  </div>
                  <ProgressBar progress={progress} />
                </div>

                <button
                  onClick={handleSaveProgress}
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Progress'}
                </button>
              </div>
            )}
          </motion.div>

          {topics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">All Topics Progress</h2>
              <div className="space-y-4">
                {topics.map((topic) => (
                  <div key={topic.id} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{topic.title}</h3>
                        <p className="text-sm text-gray-600">{topic.planTitle}</p>
                      </div>
                      <span className="text-sm font-semibold text-blue-600 ml-4">
                        {topic.currentProgress}%
                      </span>
                    </div>
                    <ProgressBar progress={topic.currentProgress} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
