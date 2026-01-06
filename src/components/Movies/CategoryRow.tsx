'use client';

import { useEffect, useState } from 'react';
import { discoverMedia } from '@/lib/tmdb/client';
import { Movie } from '@/types';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  title: string;
  type: 'movie' | 'tv';
  genreId: number;
}

export default function CategoryRow({ title, type, genreId }: Props) {
  const [items, setItems] = useState<Movie[]>([]);

  useEffect(() => {
    discoverMedia(type, genreId).then(data => {
      if (data && data.results) {
        setItems(data.results);
      }
    });
  }, [type, genreId]);

  if (items.length === 0) return null;

  return (
    <div className="space-y-4 my-8">
      <h3 className="text-xl font-bold text-white px-4 md:px-0 border-l-4 border-yellow-500 pl-3">
        {title}
      </h3>
      
      <div className="flex overflow-x-auto gap-4 px-4 md:px-0 pb-4 scrollbar-hide">
        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
              display: none;
          }
          .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
          }
        `}</style>
        
        {items.map((item) => (
          <Link 
            href={`/${type}/${item.id}`} 
            key={item.id} 
            className="flex-shrink-0 group relative w-36 md:w-44"
          >
            <div className="aspect-[2/3] relative rounded-lg overflow-hidden bg-gray-800 border border-gray-800 group-hover:border-gray-500 transition-all duration-300">
              <Image
                src={getImageUrl(item.poster_path)}
                alt={item.title || item.name || 'Poster'}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 144px, 176px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                 <p className="text-white text-xs font-bold line-clamp-2">
                    {item.title || item.name}
                 </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}