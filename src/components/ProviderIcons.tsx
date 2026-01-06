'use client';

import { useEffect, useState } from 'react';
import { getWatchProviders } from '@/lib/tmdb/client';
import Image from 'next/image';

interface ProviderIconsProps {
  type: 'movie' | 'tv';
  id: number;
}

export default function ProviderIcons({ type, id }: ProviderIconsProps) {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      try {
        const data = await getWatchProviders(type, id);
        if (isMounted && data.results) {
          const countryData = data.results.TR || data.results.US;
          if (countryData && countryData.flatrate) {
            setProviders(countryData.flatrate.slice(0, 3));
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => { isMounted = false; };
  }, [type, id]);

  if (loading) return <div className="h-5 w-20 bg-white/5 rounded animate-pulse" />;
  if (providers.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-dashed border-white/5">
        <span className="text-[10px] uppercase text-gray-600 font-bold tracking-wider">Stream:</span>
        <div className="flex -space-x-2 hover:space-x-1 transition-all duration-300">
            {providers.map((p: any) => (
                <div key={p.provider_id} className="relative w-6 h-6 rounded-lg border-2 border-[#050505] bg-[#121212] overflow-hidden" title={p.provider_name}>
                    <Image 
                        src={`https://image.tmdb.org/t/p/original${p.logo_path}`} 
                        alt={p.provider_name}
                        fill
                        className="object-cover"
                    />
                </div>
            ))}
        </div>
    </div>
  );
}