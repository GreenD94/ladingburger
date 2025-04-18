'use client';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  height?: string;
}

export default function ErrorState({ error, onRetry, height = '400px' }: ErrorStateProps) {
  return (
    <div className="w-full" style={{ height }}>
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="text-red-500">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-gray-600">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
} 