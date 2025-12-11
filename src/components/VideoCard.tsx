import { ExternalLink, Youtube } from 'lucide-react';
import { Video } from '../lib/api';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
    >
      <Youtube className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {video.title}
        </p>
        <p className="text-xs text-gray-600 mt-1">{video.channel}</p>
      </div>
      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
    </a>
  );
}
