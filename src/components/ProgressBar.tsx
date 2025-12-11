interface ProgressBarProps {
  progress: number;
  className?: string;
}

export default function ProgressBar({ progress, className = '' }: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 overflow-hidden ${className}`}>
      <div
        className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
}
