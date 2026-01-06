'use client';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import MovieCard from '@/components/Movies/MovieCard';
import { Movie } from '@/types';
import { ArrowLeft, HeartOff } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useLocalStorage<Movie[]>('watchlist', []);
  const [userSubIds] = useLocalStorage<number[]>('user_subs', []);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleWatchlist = (movie: Movie) => {
    setWatchlist(watchlist.filter(m => m.id !== movie.id));
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#060606] text-white pb-20">
      <div className="sticky top-0 z-50 bg-[#060606]/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href="/" className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold">My Watchlist</h1>
            </div>
            <div className="text-gray-400 text-sm font-medium">
                {watchlist.length} titles
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {watchlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
                <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center">
                    <HeartOff className="w-10 h-10 text-gray-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Your list is empty</h2>
                    <p className="text-gray-400 max-w-md mx-auto">
                        Movies and TV shows you add to your watchlist will appear here.
                    </p>
                </div>
                <Link 
                    href="/" 
                    className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold transition-all hover:scale-105"
                >
                    Start Discovering
                </Link>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
                {watchlist.map((movie) => (
                    <MovieCard 
                        key={movie.id} 
                        movie={movie} 
                        userSubIds={userSubIds}
                        isWatchlisted={true}
                        onToggleWatchlist={toggleWatchlist}
                    />
                ))}
            </div>
        )}
      </div>
    </div>
  );
}