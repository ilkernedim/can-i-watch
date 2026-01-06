'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getTrending } from '@/lib/tmdb/client';

export default function HeroBackground() {
  const [posters, setPosters] = useState<string[]>([]);

  useEffect(() => {
    async function fetchPosters() {
      try {
        const data = await getTrending();
        // Sadece posteri olan ilk 15 filmi al
        const paths = data.results
          .slice(0, 15)
          .filter((m: any) => m.poster_path)
          .map((m: any) => m.poster_path);
        setPosters(paths);
      } catch (error) {
        console.error('Failed to fetch hero background posters', error);
      }
    }
    fetchPosters();
  }, []);

  if (posters.length === 0) {
    // Posterler yüklenemezse düz siyah bir arka plan göster
    return <div className="absolute inset-0 bg-black"></div>;
  }

  return (
    <div className="absolute inset-0 overflow-hidden select-none pointer-events-none">
      {}
      <div className="absolute inset-0 bg-black/70 z-10"></div>
      
      {}
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-2 opacity-50 transform scale-110 -rotate-6 filter blur-sm">
        {posters.map((path, index) => (
          <div key={index} className="relative aspect-[2/3] w-full">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${path}`}
              alt="Background poster"
              fill
              className="object-cover rounded-sm"
              sizes="(max-width: 768px) 33vw, (max-width: 1024px) 20vw, 12.5vw"
              priority={index < 8} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}