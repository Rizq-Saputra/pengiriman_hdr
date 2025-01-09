function TableSkeleton() {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="border rounded-lg">
          <div className="border-b">
            {/* Header skeleton */}
            <div className="grid grid-cols-5 p-4 bg-gray-50">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
          {/* Rows skeleton */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-5 p-4 border-b">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

export default TableSkeleton;