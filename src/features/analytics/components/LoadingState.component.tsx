'use client';

interface LoadingStateProps {
  title?: string;
  height?: string;
}

export default function LoadingState({ title = 'Loading...', height = '400px' }: LoadingStateProps) {
  return (
    <div className="w-full" style={{ height }}>
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="text-gray-600">{title}</p>
      </div>
    </div>
  );
}

