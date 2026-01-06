'use client';

import { useEffect, useState } from 'react';
import { getTopTVShows } from '@/lib/tmdb/client';
import { Movie } from '@/types';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export default function Top10List() {
  const [shows, setShows] = useState<Movie[]>([]);

  useEffect(() => {
    getTopTVShows()
      .then(data => {
        if (data && data.results) {
          setShows(data.results.slice(0, 10));
        }
      })
      .catch(err => console.error(err));
  }, []);

  if (shows.length === 0) return null;

  return (
    <div className="w-full mb-12">
      <style jsx global>{`
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
        .hide-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 px-4 md:px-0">
        <span className="text-red-600 text-3xl">🔥</span> Top 10 TV Shows Today
      </h3>
      
      <div className="flex overflow-x-auto pb-8 pt-2 px-4 md:px-0 gap-6 hide-scroll snap-x">
        {shows.map((show, index) => (
          <Link 
            href={`/tv/${show.id}`} 
            key={show.id} 
            className="relative flex-shrink-0 group snap-start flex items-end pl-8"
          >
            <span 
              className="absolute left-0 bottom-0 text-[9rem] font-black leading-[0.6] text-gray-800 tracking-tighter z-0 select-none group-hover:text-gray-600 transition-colors"
              style={{ 
                  textShadow: '2px 2px 0px #444',
                  WebkitTextStroke: '2px #555'
              }}
            >
              {index + 1}
            </span>
            
            <div className="relative w-36 h-52 ml-8 rounded-lg overflow-hidden shadow-2xl border border-gray-800 group-hover:scale-110 group-hover:border-gray-500 transition-all duration-300 z-10 bg-gray-900">
              <Image
                src={getImageUrl(show.poster_path)}
                alt={show.name || 'Show'}
                fill
                className="object-cover"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
