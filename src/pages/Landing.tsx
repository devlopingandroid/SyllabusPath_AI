import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, MapPin, Video, TrendingUp } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import Footer from '../components/Footer';

export default function Landing() {
  const features = [
    {
      icon: BookOpen,
      title: 'Topic Extraction',
      description:
        'Automatically extract and organize key topics from any syllabus with AI-powered analysis.',
    },
    {
      icon: MapPin,
      title: 'Roadmap Generation',
      description:
        'Get personalized study roadmaps tailored to your learning pace and difficulty level.',
    },
    {
      icon: Video,
      title: 'Curated Videos',
      description:
        'Access handpicked YouTube tutorials and lectures for every topic in your plan.',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description:
        'Monitor your learning journey with detailed analytics and progress insights.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1"
      >
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                AI-Powered Learning Platform
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              AI-Powered Study Planner
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Generate personalized roadmaps and curated resources instantly. Transform any syllabus
              into an actionable study plan powered by AI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                to="/register"
                className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl font-semibold text-lg"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 transition-colors shadow-md font-semibold text-lg border-2 border-blue-600"
              >
                Login
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Everything you need to succeed
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our AI-powered platform provides all the tools you need to create effective study
                plans and track your progress.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-cyan-600">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to supercharge your learning?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of students who are already achieving their learning goals.
              </p>
              <Link
                to="/register"
                className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 transition-colors shadow-xl font-semibold text-lg"
              >
                Start Learning Today
              </Link>
            </motion.div>
          </div>
        </section>
      </motion.div>

      <Footer />
    </div>
  );
}
