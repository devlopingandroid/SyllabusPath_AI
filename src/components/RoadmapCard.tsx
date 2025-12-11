import { Clock } from 'lucide-react';
import { Topic, Video } from '../lib/api';
import ProgressBar from './ProgressBar';
import VideoCard from './VideoCard';

interface RoadmapCardProps {
  topic: Topic;
  videos: Video[];
  progress?: number;
}

export default function RoadmapCard({ topic, videos, progress = 0 }: RoadmapCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex-1">{topic.title}</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
            topic.difficulty
          )}`}
        >
          {topic.difficulty}
        </span>
      </div>

      {topic.description && (
        <p className="text-gray-600 mb-4 leading-relaxed">{topic.description}</p>
      )}

      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
        <Clock className="w-4 h-4" />
        <span>{topic.estimated_minutes} minutes</span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-semibold text-blue-600">{progress}%</span>
        </div>
        <ProgressBar progress={progress} />
      </div>

      {videos.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Recommended Videos</h4>
          <div className="space-y-2">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
