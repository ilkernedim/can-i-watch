'use client';

import { Movie, AvailabilityResult } from '@/types';
import { useEffect, useState } from 'react';
import { getMediaAvailability } from '@/lib/availability';
import Image from 'next/image';
import { Heart, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { cn, getImageUrl } from '@/lib/utils';
import Link from 'next/link';

interface Props {
  movie: Movie;
  userSubIds: number[];
  isWatchlisted: boolean;
  onToggleWatchlist: (movie: Movie) => void;
}

export default function MovieCard({ movie, userSubIds, isWatchlisted, onToggleWatchlist }: Props) {
  const [availability, setAvailability] = useState<AvailabilityResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getMediaAvailability(movie.id, movie.media_type)
      .then(res => {
        if (mounted) setAvailability(res);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [movie.id, movie.media_type]);

  const title = movie.title || movie.name || 'Untitled';
  const year = (movie.release_date || movie.first_air_date || '').split('-')[0];
  
  const availableProviders = availability?.flatrate || [];
  const matches = availableProviders.filter(p => userSubIds.includes(p.provider_id));
  const isWatchable = matches.length > 0;

  const type = movie.media_type || 'movie';

  return (
    <div className="relative group h-full">
      <Link href={`/${type}/${movie.id}`} className="block h-full">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-gray-500 transition-all flex flex-col h-full hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1">
          <div className="relative aspect-[2/3] w-full bg-gray-900">
            {movie.poster_path ? (
              <Image
                src={getImageUrl(movie.poster_path)}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            ) : (
                <div className="flex items-center justify-center h-full text-gray-600 bg-gray-800">No Image</div>
            )}
          </div>

          <div className="p-4 flex flex-col flex-grow">
            <h4 className="font-bold text-lg leading-tight text-white mb-1 line-clamp-1 group-hover:text-yellow-500 transition-colors" title={title}>{title}</h4>
            <div className="flex justify-between text-xs text-gray-400 mb-4 font-medium">
                <span>{year}</span>
                <span className="uppercase border border-gray-600 px-1.5 py-0.5 rounded text-[10px] tracking-wider bg-gray-800">{type}</span>
            </div>
            
            <div className="mt-auto pt-3 border-t border-gray-700/50">
                {loading ? (
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <Loader2 className="w-3 h-3 animate-spin" /> Checking...
                    </div>
                ) : isWatchable ? (
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-green-400 text-xs font-bold uppercase tracking-wide">
                            <CheckCircle className="w-3.5 h-3.5" /> Watchable
                        </div>
                        <div className="flex -space-x-2 overflow-hidden py-1">
                            {matches.map(p => (
                                <div key={p.provider_id} className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-gray-800 ring-1 ring-black shadow-sm bg-gray-900">
                                    <Image 
                                      src={getImageUrl(p.logo_path)} 
                                      alt={p.provider_name} 
                                      fill 
                                      className="object-contain" // Burada da contain kullandık
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 text-red-400 text-xs opacity-70 font-medium">
                      <XCircle className="w-3.5 h-3.5" /> Not in your subs
                    </div>
                )}
            </div>
          </div>
        </div>
      </Link>
      
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleWatchlist(movie);
        }}
        className="absolute top-2 right-2 p-2 bg-black/60 rounded-full hover:bg-black/90 transition-colors backdrop-blur-md z-20 group/heart"
      >
        <Heart className={cn("w-5 h-5 transition-colors", isWatchlisted ? "fill-red-500 text-red-500" : "text-white group-hover/heart:text-red-500")} />
      </button>
    </div>
  );
}