import Image from "next/image";
import Link from "next/link";
import { getTrending, getTopTVShows, discoverMedia } from "@/lib/tmdb/client";
import { SUPPORTED_PROVIDERS } from "@/types";
import { Search, Film, TrendingUp, Star, PlayCircle, Calendar } from "lucide-react";

export default async function Home() {
  const [trendingData, topRatedTVData, netflixData, upcomingData] = await Promise.all([
    getTrending(),
    getTopTVShows(),
    discoverMedia('tv', 10765),
    discoverMedia('movie')
  ]);

  const trending = trendingData.results.slice(0, 10);
  const top10 = topRatedTVData.results.slice(0, 5);
  const netflixList = netflixData.results.slice(0, 6);
  const upcomingList = upcomingData.results.slice(0, 3);

  return (
    <div className="bg-background-dark text-white font-display overflow-x-hidden flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4">
            <div className="text-primary">
              <Film className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">Can I Watch?</h2>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-medium text-slate-400 hover:text-white transition-colors" href="/search?type=movie">Movies</Link>
            <Link className="text-sm font-medium text-slate-400 hover:text-white transition-colors" href="/search?type=tv">TV Shows</Link>
            <Link className="text-sm font-medium text-slate-400 hover:text-white transition-colors" href="/watchlist">My Watchlist</Link>
          </nav>
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex text-slate-400 hover:text-white transition-colors">
              <Search className="w-6 h-6" />
            </button>
            <div className="h-6 w-px bg-gray-800 hidden sm:block"></div>
            <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary hover:bg-blue-600 text-white text-sm font-bold transition-colors shadow-lg shadow-blue-500/20">
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-grow flex flex-col">
        <div className="relative w-full min-h-[600px] flex items-center justify-center bg-background-dark overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/90 to-black/60 z-10"></div>
            {trending[0]?.backdrop_path && (
               <div className="w-full h-full bg-cover bg-center opacity-40 scale-105 animate-pulse" 
                    style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${trending[0].backdrop_path})` }}>
               </div>
            )}
          </div>
          <div className="relative z-20 flex flex-col items-center w-full max-w-[900px] px-4 text-center gap-10 mt-[-20px]">
            <div className="flex flex-col gap-4">
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight drop-shadow-2xl">
                Find your next<br/>favorite movie
              </h1>
              <h2 className="text-lg md:text-xl text-slate-300 font-medium drop-shadow-lg">
                Where would you like to watch?
              </h2>
            </div>
            <div className="w-full max-w-[700px]">
              <form action="/search" className="flex w-full items-center h-14 md:h-16 bg-[#161616]/80 backdrop-blur-xl rounded-2xl border border-white/10 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all shadow-2xl">
                <div className="pl-5 text-slate-400">
                  <Search className="w-6 h-6" />
                </div>
                <input 
                    name="q"
                    className="w-full h-full bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 focus:outline-none text-base md:text-lg px-4" 
                    placeholder="Search for movies, TV shows..." 
                    type="text"
                />
                <div className="pr-2">
                  <button type="submit" className="h-10 md:h-12 px-6 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold text-sm md:text-base transition-colors shadow-lg shadow-blue-500/20">
                    Search
                  </button>
                </div>
              </form>
            </div>
            <div className="flex flex-col items-center gap-6 w-full animate-fade-in">
              <p className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">Supported Platforms</p>
              <div className="flex flex-wrap justify-center gap-3 w-full max-w-[1000px]">
                {SUPPORTED_PROVIDERS.map((provider) => (
                  <div key={provider.provider_id} className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#131720] border border-white/5 flex items-center justify-center hover:border-white/20 hover:scale-110 transition-all cursor-pointer group overflow-hidden p-3">
                     <img src={provider.logo_path} alt={provider.provider_name} className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-12 flex flex-col gap-20">
          <section className="flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-pulse">🔥</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Top 5 TV Shows Today</h2>
            </div>
            <div className="relative w-full overflow-x-auto pb-4 no-scrollbar">
              <div className="flex items-end gap-6 min-w-max px-4">
                {top10.map((show: any, index: number) => (
                  <Link href={`/tv/${show.id}`} key={show.id} className="relative group cursor-pointer flex-shrink-0 w-[160px] md:w-[200px]">
                    <div className="absolute -left-6 bottom-0 text-[160px] leading-[0.75] font-black text-stroke-2 opacity-40 select-none pointer-events-none z-0 translate-y-3 group-hover:opacity-60 transition-opacity">
                      {index + 1}
                    </div>
                    <div className="relative z-10 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl bg-surface-dark border border-white/5 transition-transform duration-300 group-hover:-translate-y-4 ml-10">
                      <Image 
                        src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} 
                        alt={show.name || "TV Show"}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80"></div>
                      <div className="absolute bottom-4 left-0 right-0 text-center px-2">
                        <span className="text-white font-bold text-lg drop-shadow-md">{show.name}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
                <TrendingUp className="text-primary w-6 h-6" />
                Trending Now
              </h2>
            </div>
            <div className="flex overflow-x-auto gap-5 pb-4 no-scrollbar snap-x snap-mandatory">
              {trending.map((item: any) => (
                <Link href={`/${item.media_type}/${item.id}`} key={item.id} className="flex flex-col gap-3 min-w-[160px] md:min-w-[200px] snap-start group/card cursor-pointer">
                  <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-lg bg-card-dark border border-white/5">
                    <Image 
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} 
                      alt={item.title || item.name || "Movie"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                    />
                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-yellow-400 flex items-center gap-1 border border-white/10">
                      <Star className="w-3 h-3 fill-yellow-400" /> {item.vote_average.toFixed(1)}
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <PlayCircle className="w-12 h-12 text-white drop-shadow-xl scale-90 group-hover/card:scale-100 transition-transform" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white truncate group-hover/card:text-primary transition-colors">{item.title || item.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                      <span className="uppercase">{item.media_type}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
                <PlayCircle className="text-red-600 w-6 h-6" />
                Popular Sci-Fi & Fantasy
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {netflixList.map((item: any) => (
                <Link href={`/tv/${item.id}`} key={item.id} className="flex flex-col gap-2 group cursor-pointer">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-card-dark border border-white/5">
                    <Image 
                       src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} 
                       alt={item.name} 
                       fill
                       className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-medium text-sm text-slate-300 truncate group-hover:text-white transition-colors">{item.name}</h3>
                </Link>
              ))}
            </div>
          </section>
          <section className="flex flex-col gap-6">
             <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
                <Calendar className="text-primary w-6 h-6" />
                Coming Soon / Fresh
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingList.map((item: any) => (
                <Link href={`/movie/${item.id}`} key={item.id} className="flex gap-4 bg-card-dark/60 hover:bg-card-dark p-4 rounded-xl transition-colors cursor-pointer group border border-white/5 hover:border-white/10">
                  <div className="w-24 shrink-0 aspect-[2/3] rounded-lg overflow-hidden bg-black/50 relative">
                     <Image 
                       src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} 
                       alt={item.title} 
                       fill
                       className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center gap-1.5">
                    <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-slate-400 text-sm">{item.release_date}</p>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] uppercase font-bold text-slate-400">Movie</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <footer className="mt-12 border-t border-white/5 py-12 bg-[#080808]">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 text-slate-400">
            <Film className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl text-white tracking-tight">Can I Watch?</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <Link className="text-sm font-medium text-slate-500 hover:text-white transition-colors" href="#">About Us</Link>
            <Link className="text-sm font-medium text-slate-500 hover:text-white transition-colors" href="#">Privacy Policy</Link>
            <Link className="text-sm font-medium text-slate-500 hover:text-white transition-colors" href="#">Terms of Service</Link>
          </div>
          <div className="text-xs text-slate-600">
             © 2026 Can I Watch?. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}