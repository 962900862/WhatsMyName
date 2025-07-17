interface EmptyProps {
  message: string;
}

export default function Empty({ message }: EmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <svg 
            className="w-16 h-16 mx-auto text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1} 
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.072-2.327M12 3v3m6.364-.636l-2.121 2.121M21 12h-3m-.636 6.364l-2.121-2.121M12 21v-3m-6.364.636l2.121-2.121M3 12h3m.636-6.364l2.121 2.121"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {message}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          The content you're looking for is not available.
        </p>
      </div>
    </div>
  );
}