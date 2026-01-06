'use client';

import { useEffect, useState } from 'react';
import { getGenres } from '@/lib/tmdb/client';
import { cn } from '@/lib/utils';

interface Genre {
  id: number;
  name: string;
}

interface Props {
  selectedGenreId: number | null;
  onSelect: (id: number | null) => void;
}

export default function GenreSelector({ selectedGenreId, onSelect }: Props) {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    getGenres().then(data => {
      setGenres([{ id: 0, name: 'All' }, ...data.genres]);
    });
  }, []);

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 mask-image-gradient">
      {genres.map((genre) => (
        <button
          key={genre.id}
          onClick={() => onSelect(genre.id === 0 ? null : genre.id)}
          className={cn(
            "flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border border-transparent whitespace-nowrap",
            selectedGenreId === (genre.id === 0 ? null : genre.id)
              ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-105"
              : "bg-gray-800/50 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white"
          )}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}