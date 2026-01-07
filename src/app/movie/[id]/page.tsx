import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMediaDetails } from "@/lib/tmdb/client";
import { SUPPORTED_PROVIDERS } from "@/types";
import WatchlistButton from "@/components/WatchlistButton";
import ShareButton from "@/components/ShareButton";
import { 
  Play, 
  Star, 
  Film 
} from "lucide-react";

const formatRuntime = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let movie;
  try {
    movie = await getMediaDetails('movie', id);
  } catch (error) {
    notFound();
  }
  
  const director = movie.credits?.crew?.find((person: any) => person.job === "Director");
  const watchProviders = movie['watch/providers']?.results?.TR || movie['watch/providers']?.results?.US;
  const availableStreams = watchProviders?.flatrate || [];

  const trailer = movie.videos?.results?.find((vid: any) => vid.type === "Trailer" && vid.site === "YouTube") || movie.videos?.results?.[0];

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-dark text-white font-body">
      
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-[#283139] bg-background-dark/95 backdrop-blur-md px-4 py-3 md:px-10">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-4 text-white hover:opacity-80 transition-opacity">
            <Film className="size-8 text-primary" />
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              Can I Watch?
            </h2>
          </Link>
          <div className="hidden md:flex items-center gap-9">
            <Link className="text-white text-sm font-medium hover:text-primary transition-colors" href="/search?type=movie">Movies</Link>
            <Link className="text-white text-sm font-medium hover:text-primary transition-colors" href="/search?type=tv">TV Shows</Link>
            <Link className="text-white text-sm font-medium hover:text-primary transition-colors" href="/watchlist">My Watchlist</Link>
          </div>
        </div>
        <div className="flex flex-1 justify-end gap-4 md:gap-8">
           <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="font-bold text-xs">U</span>
           </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* HERO SECTION */}
        <div className="relative w-full h-[60vh] md:h-[500px]">
          <div className="absolute inset-0">
             {movie.backdrop_path && (
               <Image 
                  src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  priority
               />
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent" />
             <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/60 to-transparent" />
          </div>

          <div className="relative h-full container mx-auto px-4 md:px-10 flex flex-col justify-end pb-10">
            <div className="flex flex-col md:flex-row gap-8 items-end md:items-end">
              <div className="hidden md:block shrink-0 relative -mb-20 z-10 shadow-2xl shadow-black/50 rounded-xl group overflow-hidden border border-white/10 w-[220px] aspect-[2/3]">
                 {movie.poster_path && (
                   <Image 
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                   />
                 )}
              </div>

              <div className="flex-1 space-y-4 mb-4">
                <div className="flex flex-wrap gap-2 items-center text-sm text-[#9cacba]">
                  <span className="bg-white/10 px-2 py-0.5 rounded text-white text-xs font-bold border border-white/10">
                    {movie.adult ? 'R' : 'PG-13'}
                  </span>
                  <span>{movie.release_date?.split('-')[0]}</span>
                  <span>•</span>
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-lg">
                  {movie.title}
                </h1>
                
                {movie.tagline && (
                    <p className="text-lg md:text-xl text-gray-200 font-medium italic opacity-90">
                    "{movie.tagline}"
                    </p>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                    {movie.genres?.map((g: any) => (
                        <div key={g.id} className="flex h-8 items-center justify-center rounded-lg bg-white/10 border border-white/10 px-4">
                            <span className="text-white text-xs font-bold uppercase tracking-wider">{g.name}</span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  {trailer ? (
                    <a 
                      href={`https://www.youtube.com/watch?v=${trailer.key}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 h-12 px-6 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(30,148,246,0.3)]"
                    >
                      <Play className="fill-current w-5 h-5" />
                      <span>Play Trailer</span>
                    </a>
                  ) : (
                    <button disabled className="flex items-center gap-2 h-12 px-6 bg-gray-600 text-gray-400 rounded-xl font-bold cursor-not-allowed">
                      <Play className="fill-current w-5 h-5" />
                      <span>No Trailer</span>
                    </button>
                  )}
                  
                  <WatchlistButton 
                    media={{
                      id: movie.id,
                      title: movie.title,
                      poster_path: movie.poster_path,
                      media_type: 'movie',
                      vote_average: movie.vote_average,
                      release_date: movie.release_date
                    }} 
                  />

                  {/* YENİ PAYLAŞ BUTONU */}
                  <div className="flex items-center justify-center h-12 w-12 bg-[#283139] hover:bg-[#323d46] rounded-xl transition-colors border border-white/5">
                      <ShareButton 
                        title={movie.title}
                        url={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/movie/${movie.id}`}
                      />
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-10 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* LEFT CONTENT */}
            <div className="lg:col-span-8 flex flex-col gap-10">
              <div className="md:hidden flex gap-4">
                <div className="w-24 aspect-[2/3] relative rounded-lg overflow-hidden shrink-0">
                    {movie.poster_path && (
                      <Image src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} fill className="object-cover" />
                    )}
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[#9cacba] text-sm mb-1">Directed by</span>
                  <span className="text-white font-semibold">{director?.name || 'Unknown'}</span>
                </div>
              </div>

              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-primary rounded-full block" />
                  Synopsis
                </h3>
                <p className="text-[#9cacba] text-lg leading-relaxed">
                  {movie.overview}
                </p>
              </section>

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full block" />
                    Top Cast
                  </h3>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                  {movie.credits?.cast?.slice(0, 10).map((actor: any) => (
                      <Link href={`/person/${actor.id}`} key={actor.id} className="flex flex-col gap-2 min-w-[100px] md:min-w-[120px] group">
                        <div className="aspect-[3/4] relative rounded-xl overflow-hidden bg-[#283139]">
                            {actor.profile_path ? (
                                <Image src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} alt={actor.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">?</div>
                            )}
                        </div>
                        <div className="text-sm">
                            <p className="text-white font-bold leading-tight truncate">{actor.name}</p>
                            <p className="text-[#9cacba] text-xs truncate">{actor.character}</p>
                        </div>
                      </Link>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-primary rounded-full block" />
                  Photos
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {movie.images?.backdrops?.slice(0, 3).map((img: any, i: number) => (
                        <div key={i} className={`aspect-video relative rounded-xl overflow-hidden bg-[#283139] ${i === 2 ? 'hidden md:block' : ''}`}>
                             <Image src={`https://image.tmdb.org/t/p/w500${img.file_path}`} alt="Scene" fill className="object-cover hover:scale-105 transition-transform" />
                        </div>
                    ))}
                </div>
              </section>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              
              <div className="bg-surface-dark border border-[#283139] rounded-2xl p-6 shadow-xl sticky top-24 z-30">
                <h2 className="text-white text-xl font-bold mb-1">Where to Watch</h2>
                <p className="text-[#9cacba] text-sm mb-6">Stream the best quality on these platforms.</p>
                
                {availableStreams.length > 0 ? (
                    <div className="grid grid-cols-4 gap-3">
                        {availableStreams.map((provider: any) => {
                            const matchedProvider = SUPPORTED_PROVIDERS.find(p => p.provider_id === provider.provider_id);
                            const logoSrc = matchedProvider?.logo_path?.startsWith('data') 
                                ? matchedProvider.logo_path 
                                : `https://image.tmdb.org/t/p/original${provider.logo_path}`;

                            return (
                                <div key={provider.provider_id} className="group relative flex aspect-square flex-col items-center justify-center rounded-2xl bg-[#0e1216] border border-[#232b35] hover:border-white/50 hover:bg-[#1a1729] transition-all duration-300 p-2" title={provider.provider_name}>
                                    <div className="relative w-full h-full flex items-center justify-center">
                                         <Image src={logoSrc} alt={provider.provider_name} width={40} height={40} className="object-contain rounded-md" />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <p className="text-white text-sm">Not currently available for streaming in your region.</p>
                )}
                
                <div className="mt-6 pt-4 border-t border-[#283139]">
                  <p className="text-[#9cacba] text-xs text-center">Prices subject to change. Checked today.</p>
                </div>
              </div>

              <div className="bg-surface-dark rounded-2xl p-6 border border-[#283139]">
                 <h3 className="text-white text-lg font-bold mb-4">Movie Info</h3>
                 <div className="space-y-4">
                    <div>
                        <span className="block text-[#9cacba] text-xs font-medium uppercase tracking-wider mb-1">Original Title</span>
                        <span className="text-white text-sm font-medium">{movie.original_title}</span>
                    </div>
                    <div>
                        <span className="block text-[#9cacba] text-xs font-medium uppercase tracking-wider mb-1">Status</span>
                        <span className="text-white text-sm font-medium">{movie.status}</span>
                    </div>
                    <div>
                        <span className="block text-[#9cacba] text-xs font-medium uppercase tracking-wider mb-1">Budget</span>
                        <span className="text-white text-sm font-medium">{movie.budget > 0 ? formatCurrency(movie.budget) : '-'}</span>
                    </div>
                    <div>
                        <span className="block text-[#9cacba] text-xs font-medium uppercase tracking-wider mb-1">Revenue</span>
                        <span className="text-white text-sm font-medium">{movie.revenue > 0 ? formatCurrency(movie.revenue) : '-'}</span>
                    </div>
                 </div>
              </div>

              <div className="bg-surface-dark rounded-2xl p-6 border border-[#283139]">
                 <div className="flex items-end gap-3">
                    <span className="text-5xl font-black text-white tracking-tighter">{movie.vote_average.toFixed(1)}</span>
                    <div className="flex flex-col pb-1">
                        <div className="flex gap-0.5 text-yellow-500 mb-1">
                           {[...Array(5)].map((_, i) => (
                               <Star key={i} className={`w-4 h-4 ${i < Math.round(movie.vote_average / 2) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}`} />
                           ))}
                        </div>
                        <span className="text-[#9cacba] text-xs">{movie.vote_count} ratings</span>
                    </div>
                 </div>
              </div>

            </div>
          </div>

          <div className="mt-16 border-t border-[#283139] pt-10">
            <h3 className="text-2xl font-bold text-white mb-6">You Might Also Like</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {movie.similar?.results?.slice(0, 5).map((sim: any) => (
                    <Link href={`/movie/${sim.id}`} key={sim.id} className="group">
                        <div className="aspect-[2/3] rounded-xl bg-[#283139] overflow-hidden mb-3 relative border border-white/5">
                            {sim.poster_path && (
                              <Image src={`https://image.tmdb.org/t/p/w500${sim.poster_path}`} alt={sim.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                            )}
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-white text-xs font-bold flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {sim.vote_average.toFixed(1)}
                            </div>
                        </div>
                        <h4 className="text-white font-bold group-hover:text-primary transition-colors truncate">{sim.title}</h4>
                        <p className="text-[#9cacba] text-sm">{sim.release_date?.split('-')[0]}</p>
                    </Link>
                ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#283139] bg-surface-dark py-10 mt-10">
         <div className="container mx-auto px-4 text-center text-[#9cacba] text-sm">
            © 2026 Can I Watch? All rights reserved.
         </div>
      </footer>
    </div>
  );
}