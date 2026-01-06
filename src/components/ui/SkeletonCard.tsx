export default function SkeletonCard() {
    return (
      <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 h-full flex flex-col animate-pulse">
        
        <div className="aspect-[2/3] w-full bg-gray-700/50" />
        
        
        <div className="p-4 flex flex-col gap-3 flex-grow">
          {/* Başlık */}
          <div className="h-6 bg-gray-700/50 rounded w-3/4" />
          
          
          <div className="flex justify-between items-center mt-1">
              <div className="h-4 bg-gray-700/50 rounded w-12" />
              <div className="h-4 bg-gray-700/50 rounded w-16" />
          </div>
          
          
          <div className="mt-auto pt-3 border-t border-gray-700/50 space-y-2">
              <div className="h-4 bg-gray-700/50 rounded w-24" />
              <div className="flex gap-1">
                  <div className="w-6 h-6 rounded-full bg-gray-700/50" />
                  <div className="w-6 h-6 rounded-full bg-gray-700/50" />
                  <div className="w-6 h-6 rounded-full bg-gray-700/50" />
              </div>
          </div>
        </div>
      </div>
    );
  }