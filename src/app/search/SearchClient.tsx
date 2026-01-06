'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Play, 
  Search, 
  ChevronRight, 
  ChevronDown,
  Star, 
  Bell,
  Film,
  Tv
} from "lucide-react";
import ProviderIcons from '@/components/ProviderIcons';

interface SearchClientProps {
  initialResults: any[];
  initialQuery: string;
  genres: any[];
  initialType: 'all' | 'movie' | 'tv';
}

export default function SearchClient({ initialResults, initialQuery, genres, initialType }: SearchClientProps) {
  const router = useRouter();
  
  
  const [searchQuery, setSearchQuery] = useState("");
  const [contentType, setContentType] = useState<'all' | 'movie' | 'tv'>('all');
  const [minRating, setMinRating] = useState(0);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([1990, 2026]);

  
  useEffect(() => {
    
    setSearchQuery(initialQuery === "Popular Movies" || initialQuery === "Popular TV Shows" || initialQuery === "Trending" ? "" : initialQuery);
    
    
    setContentType(initialType);
    
    
    setMinRating(0);
    setSelectedGenres([]);
    setYearRange([1990, 2026]);
  }, [initialQuery, initialType]); 

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
        router.push(`/search?q=${searchQuery}`);
    }
  };

  const toggleGenre = (id: number) => {
    setSelectedGenres(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const filteredResults = useMemo(() => {
    return initialResults.filter((item: any) => {
      
      if (contentType !== 'all' && item.media_type !== contentType) return false;
      
      
      if (item.vote_average < minRating) return false;

      
      const releaseDate = item.release_date || item.first_air_date;
      const year = releaseDate ? parseInt(releaseDate.split('-')[0]) : 0;
      if (year < yearRange[0] || year > yearRange[1]) return false;

      if (selectedGenres.length > 0) {
        const itemGenres = item.genre_ids || [];
        const hasGenre = selectedGenres.some(id => itemGenres.includes(id));
        if (!hasGenre) return false;
      }

      return true;
    });
  }, [initialResults, contentType, minRating, selectedGenres, yearRange]);

  const resetFilters = () => {
    setContentType('all');
    setMinRating(0);
    setSelectedGenres([]);
    setYearRange([1990, 2026]);
  };

  
  const isMovieActive = contentType === 'movie';
  const isTvActive = contentType === 'tv';

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#050505] text-white font-display overflow-x-hidden selection:bg-primary/30">
      
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-4 lg:px-10 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-10">
            <Link className="flex items-center gap-3 group" href="/">
              <div className="size-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                <Play className="fill-current w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold leading-tight tracking-tight">
                Can I Watch?
              </h2>
            </Link>
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/search?type=movie" className={`text-sm font-medium transition-colors ${isMovieActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}>Movies</Link>
              <Link href="/search?type=tv" className={`text-sm font-medium transition-colors ${isTvActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}>TV Shows</Link>
              <Link className="text-gray-400 hover:text-white text-sm font-medium transition-colors" href="/watchlist">My List</Link>
            </nav>
          </div>
          
          <div className="flex-1 max-w-lg hidden md:block group">
            <form onSubmit={handleSearch} className="relative flex items-center w-full">
              <span className="absolute left-3 text-gray-500 group-focus-within:text-primary transition-colors flex items-center">
                <Search className="w-5 h-5" />
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121212] text-white placeholder:text-gray-600 text-sm rounded-xl border border-white/5 focus:border-primary/50 focus:bg-[#1a1a1a] ring-0 focus:ring-2 focus:ring-primary/20 py-2.5 pl-10 pr-4 transition-all shadow-sm outline-none"
                placeholder="Search movies, TV shows..."
                type="text"
              />
            </form>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-[#050505] animate-pulse" />
            </button>
            <div className="size-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-sm font-bold ring-2 ring-white/10 cursor-pointer hover:ring-primary transition-all shadow-lg">
                U
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full max-w-[1600px] mx-auto p-4 lg:p-8 flex flex-col gap-8">
        
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link className="hover:text-primary transition-colors" href="/">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-300 font-medium">Search Results</span>
          </div>
          
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/5 pb-8">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                Results for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  "{initialQuery}"
                </span>
              </h1>
              <p className="text-gray-400 text-lg">
                Found {filteredResults.length} matching titles based on your filters
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-[#121212] p-1 pr-4 rounded-lg border border-white/10 shadow-sm">
                <span className="text-xs font-semibold text-gray-500 pl-3 uppercase tracking-wider">Sort by:</span>
                <div className="relative">
                    <select className="appearance-none bg-transparent text-white pl-2 pr-8 py-1.5 rounded-md text-sm border-none focus:ring-0 cursor-pointer font-medium outline-none">
                        <option>Relevance</option>
                        <option>Release Date</option>
                        <option>IMDb Rating</option>
                        <option>Popularity</option>
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-4 h-4" />
                </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          <aside className="w-full lg:w-72 shrink-0 space-y-6 hidden lg:block sticky top-28 h-fit overflow-y-auto max-h-[calc(100vh-120px)] custom-scrollbar pr-2">
            
            <div className="bg-[#121212]/60 backdrop-blur-md border border-white/5 p-5 rounded-xl">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Content Type</h3>
              <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                <button 
                    onClick={() => { setContentType('movie'); router.push('/search?type=movie'); }} 
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${contentType === 'movie' ? 'bg-[#222] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >
                    Movies
                </button>
                <button 
                    onClick={() => { setContentType('tv'); router.push('/search?type=tv'); }} 
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${contentType === 'tv' ? 'bg-[#222] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >
                    TV Shows
                </button>
              </div>
            </div>

            <div className="bg-[#121212]/60 backdrop-blur-md border border-white/5 p-5 rounded-xl space-y-8">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">IMDb Score</h3>
                        <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-1 rounded border border-primary/20">{minRating}+</span>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max="10" 
                        step="0.5" 
                        value={minRating} 
                        onChange={(e) => setMinRating(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-[#333] rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>
            </div>

            <div className="bg-[#121212]/60 backdrop-blur-md border border-white/5 p-5 rounded-xl">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Genres</h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {genres.map((genre) => (
                        <label key={genre.id} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input 
                                    type="checkbox" 
                                    className="peer sr-only" 
                                    checked={selectedGenres.includes(genre.id)}
                                    onChange={() => toggleGenre(genre.id)}
                                />
                                <div className={`w-4 h-4 border rounded transition-colors ${selectedGenres.includes(genre.id) ? 'bg-primary border-primary' : 'border-gray-600 bg-[#222]'}`}></div>
                            </div>
                            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{genre.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            <button onClick={resetFilters} className="w-full py-3.5 rounded-xl border border-white/10 text-gray-400 text-sm font-bold hover:bg-white/5 hover:text-white transition-all">
                Reset Filters
            </button>
          </aside>

          <main className="flex-1 w-full">
            {filteredResults.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {filteredResults.map((item: any) => (
                    <Link href={`/${item.media_type}/${item.id}`} key={item.id} className="group relative flex flex-col gap-4">
                        <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#121212] shadow-2xl group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500 border border-white/5 group-hover:border-primary/40">
                            {item.poster_path ? (
                                <Image
                                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                                alt={item.title || item.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500 flex-col gap-2">
                                    {item.media_type === 'movie' ? <Film className="w-12 h-12 opacity-50" /> : <Tv className="w-12 h-12 opacity-50" />}
                                    <span className="text-xs uppercase font-bold tracking-widest opacity-50">No Poster</span>
                                </div>
                            )}
                            
                            <div className="absolute top-0 right-0 p-2">
                                <div className="bg-black/60 backdrop-blur-md text-[#FFB400] text-xs font-bold px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1 shadow-lg">
                                    <Star className="w-3 h-3 fill-current" />
                                    {item.vote_average?.toFixed(1) || '0.0'}
                                </div>
                            </div>
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-8 gap-3">
                                <button className="bg-primary hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-white/10">
                                    <Play className="fill-current w-4 h-4" />
                                    Watch
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-1.5 px-1">
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="text-lg font-bold text-white leading-tight line-clamp-1 group-hover:text-primary transition-colors cursor-pointer">
                                    {item.title || item.name}
                                </h3>
                                <span className="text-[10px] font-bold text-gray-400 border border-white/10 bg-white/5 px-1.5 py-0.5 rounded shrink-0">
                                    {item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0] || 'N/A'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 capitalize">
                                <span>{item.media_type === 'tv' ? 'TV Series' : 'Movie'}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                <span>{item.original_language?.toUpperCase()}</span>
                            </div>
                            
                            <ProviderIcons type={item.media_type} id={item.id} />
                        </div>
                    </Link>
                ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center border border-white/5 rounded-2xl bg-[#121212]/50">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <Search className="w-10 h-10 text-gray-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">No results found</h2>
                    <p className="text-gray-400 max-w-md mx-auto">We couldn't find anything matching your filters. Try adjusting them.</p>
                    <button onClick={resetFilters} className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors">
                        Reset All Filters
                    </button>
                </div>
            )}
          </main>
        </div>
      </div>

      <footer className="border-t border-white/5 bg-[#080808] mt-auto py-10">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-white/5 rounded-xl flex items-center justify-center text-white border border-white/5">
              <Play className="fill-current text-gray-400 w-4 h-4" />
            </div>
            <p className="text-gray-500 text-sm font-medium">
              © 2026 Can I Watch?
            </p>
          </div>
          <div className="flex gap-8 text-sm text-gray-500 font-medium">
            <Link className="hover:text-white transition-colors" href="#">Privacy Policy</Link>
            <Link className="hover:text-white transition-colors" href="#">Terms of Service</Link>
            <Link className="hover:text-white transition-colors" href="#">Help Center</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}