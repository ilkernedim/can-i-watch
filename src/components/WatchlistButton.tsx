'use client';

import { useState, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';

interface WatchlistButtonProps {
  media: {
    id: number;
    title: string;
    poster_path: string | null;
    media_type: 'movie' | 'tv';
    vote_average: number;
    release_date?: string;
  };
}

export default function WatchlistButton({ media }: WatchlistButtonProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    const exists = watchlist.some((item: any) => item.id === media.id);
    setIsSaved(exists);
  }, [media.id]);

  const toggleWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    
    if (isSaved) {
      const newList = watchlist.filter((item: any) => item.id !== media.id);
      localStorage.setItem('watchlist', JSON.stringify(newList));
      setIsSaved(false);
    } else {
      watchlist.push(media);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      setIsSaved(true);
    }
  };

  return (
    <button 
      onClick={toggleWatchlist}
      className={`flex items-center gap-2 h-12 px-6 rounded-xl font-bold transition-all duration-200 ${
        isSaved 
          ? 'bg-green-600 hover:bg-green-700 text-white' 
          : 'bg-[#283139] hover:bg-[#323d46] text-white'
      }`}
    >
      {isSaved ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
      <span>{isSaved ? 'Added' : 'Watchlist'}</span>
    </button>
  );
}