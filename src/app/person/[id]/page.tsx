'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPersonDetails, getPersonCredits } from '@/lib/tmdb/client';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Movie } from '@/types';
import MovieCard from '@/components/Movies/MovieCard';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';

export default function PersonPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [person, setPerson] = useState<any>(null);
  const [credits, setCredits] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [userSubIds] = useLocalStorage<number[]>('user_subs', []);
  const [watchlist, setWatchlist] = useLocalStorage<Movie[]>('watchlist', []);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [details, creditData] = await Promise.all([
          getPersonDetails(id),
          getPersonCredits(id)
        ]);
        
        setPerson(details);
        
        const sorted = creditData.cast
          .filter((m: any) => m.poster_path && (m.vote_count > 50))
          .sort((a: any, b: any) => b.popularity - a.popularity);
          
        setCredits(sorted);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const toggleWatchlist = (movie: Movie) => {
    if (watchlist.some(m => m.id === movie.id)) {
      setWatchlist(watchlist.filter(m => m.id !== movie.id));
    } else {
      setWatchlist([...watchlist, movie]);
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-gray-800 border-t-yellow-500 rounded-full animate-spin"></div>
        </div>
    );
  }

  if (!person) return null;

  return (
    <div className="min-h-screen bg-[#060606] text-white pb-20">
      <div className="sticky top-0 z-50 bg-[#060606]/80 backdrop-blur-md border-b border-gray-800 p-4">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back
        </button>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-10 mb-16">
            <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="relative w-64 h-96 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                    {person.profile_path ? (
                        <Image src={getImageUrl(person.profile_path)} alt={person.name} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">No Image</div>
                    )}
                </div>
            </div>

            <div className="flex-1 space-y-6 text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-extrabold">{person.name}</h1>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-400 text-sm">
                    {person.birthday && (
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-yellow-500" />
                            {person.birthday}
                        </div>
                    )}
                    {person.place_of_birth && (
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-yellow-500" />
                            {person.place_of_birth}
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white border-l-4 border-yellow-500 pl-3">Biography</h3>
                    <p className="text-gray-400 leading-relaxed max-w-4xl text-sm md:text-base line-clamp-6 hover:line-clamp-none transition-all cursor-pointer">
                        {person.biography || "No biography available."}
                    </p>
                </div>
            </div>
        </div>

        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <span className="w-1 h-8 bg-blue-500 rounded-full"></span> Known For
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
            {credits.map((movie) => (
                <MovieCard 
                    key={`${movie.id}-${movie.media_type}`}
                    movie={movie} 
                    userSubIds={userSubIds}
                    isWatchlisted={watchlist.some(w => w.id === movie.id)}
                    onToggleWatchlist={toggleWatchlist}
                />
            ))}
        </div>
      </div>
    </div>
  );
}