'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useDebounce } from '@/hooks/useDebounce';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { searchMulti, discoverMedia, getTrending } from '@/lib/tmdb/client';
import { Movie, SUPPORTED_PROVIDERS } from '@/types';
import MovieCard from '@/components/Movies/MovieCard';
import SubscriptionSelector from '@/components/Settings/SubscriptionSelector';
import HeroBackground from '@/components/HeroBackground';
import GenreSelector from '@/components/ui/GenreSelector';
import SkeletonCard from '@/components/ui/SkeletonCard';
import Top10List from '@/components/Movies/Top10List';
import CategoryRow from '@/components/Movies/CategoryRow';
import { Search, Play, X, List } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';

export default function Home() {
  const [selectedSubIds, setSelectedSubIds] = useLocalStorage<number[]>('user_subs', []);
  const [watchlist, setWatchlist] = useLocalStorage<Movie[]>('watchlist', []);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const debouncedSearch = useDebounce(searchQuery, 500);
  const { targetRef, isIntersecting } = useIntersectionObserver({ threshold: 0.5 });

  useEffect(() => {
    setResults([]);
    setPage(1);
    setHasMore(true);
  }, [debouncedSearch, selectedGenre]);

  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [isIntersecting]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let data;
        
        if (debouncedSearch.trim()) {
          data = await searchMulti(debouncedSearch, page);
        } else if (selectedGenre) {
          data = await discoverMedia('movie', selectedGenre, page);
        } else {
          data = await getTrending(page);
        }

        const filtered = data.results.filter((m: any) => m.media_type === 'movie' || m.media_type === 'tv' || !m.media_type); 
        
        const processed = filtered.map((m: any) => ({
            ...m,
            media_type: m.media_type || 'movie'
        }));

        if (processed.length === 0) {
            setHasMore(false);
        } else {
            setResults((prev) => {
                const newMovies = processed.filter((nm: Movie) => !prev.some((pm) => pm.id === nm.id));
                return [...prev, ...newMovies];
            });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (hasMore) {
        fetchMovies();
    }
  }, [debouncedSearch, selectedGenre, page]);

  const toggleSub = (id: number) => {
    if (selectedSubIds.includes(id)) {
      setSelectedSubIds(selectedSubIds.filter(sid => sid !== id));
    } else {
      setSelectedSubIds([...selectedSubIds, id]);
    }
  };

  const toggleWatchlist = (movie: Movie) => {
    if (watchlist.some(m => m.id === movie.id)) {
      setWatchlist(watchlist.filter(m => m.id !== movie.id));
    } else {
      setWatchlist([...watchlist, movie]);
    }
  };

  const scrollToSearch = () => {
    document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const clearSearch = () => {
      setSearchQuery('');
      setSelectedGenre(null);
  };

  return (
    <div>
      <section className="relative h-[80vh] md:h-[70vh] flex items-center justify-center text-center overflow-hidden -mt-8 -mx-4 mb-12 px-4">
        <HeroBackground />
        <div className="relative z-20 max-w-4xl mx-auto space-y-8 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight drop-shadow-2xl tracking-tight">
            Your streaming guide for<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-gradient">
              movies & TV shows
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-200 max-w-2xl drop-shadow-md font-medium">
            Select your subscriptions. Find what to watch. Instantly.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button 
              onClick={scrollToSearch}
              className="flex items-center gap-3 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-2xl transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(234,179,8,0.3)] text-lg"
            >
              <Play className="w-6 h-6 fill-current" />
              Start Discovering
            </button>
            
            <Link 
              href="/watchlist"
              className="flex items-center gap-3 px-8 py-4 bg-gray-800/80 hover:bg-gray-700 text-white font-bold rounded-2xl backdrop-blur-sm border border-gray-600 transition-all text-lg"
            >
              <List className="w-6 h-6" />
              My List ({watchlist.length})
            </Link>
          </div>

          <div className="pt-10">
            <p className="text-xs text-gray-400 mb-4 uppercase tracking-[0.2em] font-bold">Supported Platforms</p>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {SUPPORTED_PROVIDERS.map((provider) => (
                <div 
                    key={provider.provider_id} 
                    className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden shadow-lg border border-white/10 bg-gray-900 hover:scale-110 transition-transform duration-300" 
                    title={provider.provider_name}
                >
                  <Image
                    src={getImageUrl(provider.logo_path)}
                    alt={provider.provider_name}
                    fill
                    className="object-contain p-1"
                    sizes="64px"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent z-10"></div>
      </section>

      <div className="space-y-12 container mx-auto pb-20" id="search-section">
        
        <Top10List />

        <div className="space-y-8">
            <CategoryRow title="Popular Action Movies" type="movie" genreId={28} />
            <CategoryRow title="Top Rated Comedies" type="movie" genreId={35} />
            <CategoryRow title="Sci-Fi & Fantasy" type="movie" genreId={878} />
            <CategoryRow title="Must-Watch Drama Shows" type="tv" genreId={18} />
        </div>

        <section className="space-y-6 bg-gray-900/60 p-8 rounded-3xl border border-gray-800 backdrop-blur-xl shadow-2xl mt-16">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">
              What do you subscribe to?
            </h2>
            <p className="text-gray-400">Select services to filter results.</p>
          </div>
          <SubscriptionSelector selectedIds={selectedSubIds} onToggle={toggleSub} />
        </section>

        <section className="space-y-8">
          <div className="flex flex-col gap-6">
             <div className="relative group w-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                    type="text" 
                    placeholder="Search for movies, TV shows..." 
                    className="w-full bg-black border border-gray-800 rounded-2xl py-5 pl-16 pr-12 text-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-600 shadow-xl"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if(e.target.value) setSelectedGenre(null);
                    }}
                    />
                    {searchQuery && (
                        <button onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            <div className={`${searchQuery ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'} transition-all duration-300`}>
                <GenreSelector selectedGenreId={selectedGenre} onSelect={setSelectedGenre} />
            </div>
          </div>

          <div>
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        {searchQuery ? `Results for "${searchQuery}"` : selectedGenre ? 'Genre Results' : 'Trending Now'}
                    </h3>
                    <span className="text-sm text-gray-500">{results.length} titles showing</span>
                 </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
                    {results.map((movie) => (
                        <MovieCard 
                        key={`${movie.id}-${movie.media_type}`}
                        movie={movie} 
                        userSubIds={selectedSubIds}
                        isWatchlisted={watchlist.some(w => w.id === movie.id)}
                        onToggleWatchlist={toggleWatchlist}
                        />
                    ))}
                    
                    {loading && Array.from({ length: 10 }).map((_, i) => (
                        <SkeletonCard key={`skeleton-${i}`} />
                    ))}
                </div>

                {hasMore && !loading && (
                    <div ref={targetRef} className="h-20 w-full flex items-center justify-center text-gray-500 text-sm">
                        
                    </div>
                )}
          </div>
          
          {!loading && results.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                <p className="text-2xl font-semibold">No results found</p>
                <p className="mt-2">Try adjusting your filters.</p>
              </div>
          )}
        </section>
      </div>
    </div>
  );
}