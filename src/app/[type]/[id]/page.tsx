'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getMediaDetails } from '@/lib/tmdb/client';
import { getMediaAvailability } from '@/lib/availability';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AvailabilityResult, Movie } from '@/types';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';
import { ArrowLeft, Star, Clock, PlayCircle, Plus, Check, Youtube, Share2 } from 'lucide-react';
import VideoModal from '@/components/ui/VideoModal';
import Link from 'next/link';

export default function DetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const type = (params?.type as 'movie' | 'tv') || 'movie';
  const id = params?.id as string;

  const [movie, setMovie] = useState<any>(null);
  const [availability, setAvailability] = useState<AvailabilityResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [trailerId, setTrailerId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [userSubIds] = useLocalStorage<number[]>('user_subs', []);
  const [watchlist, setWatchlist] = useLocalStorage<Movie[]>('watchlist', []);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const details = await getMediaDetails(type, id);
        
        if (!details) {
            setLoading(false);
            return;
        }

        setMovie(details);
        
        if (typeof document !== 'undefined' && (details.title || details.name)) {
             document.title = `${details.title || details.name} - Watch Now`;
        }

        if (details.videos?.results) {
            const trailer = details.videos.results.find(
                (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
            );
            if (trailer) setTrailerId(trailer.key);
        }

        try {
            const avail = await getMediaAvailability(Number(id), type);
            setAvailability(avail);
        } catch (e) {
            console.warn(e);
        }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
        if (typeof document !== 'undefined') document.title = 'Streaming Guide';
    };
  }, [type, id]);

  const toggleWatchlist = () => {
    if (!movie) return;
    const miniMovie: Movie = {
        id: movie.id,
        title: movie.title,
        name: movie.name,
        poster_path: movie.poster_path,
        overview: movie.overview,
        media_type: type,
        vote_average: movie.vote_average
    };

    if (watchlist.some(m => m.id === movie.id)) {
      setWatchlist(watchlist.filter(m => m.id !== movie.id));
    } else {
      setWatchlist([...watchlist, miniMovie]);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = movie?.title || movie?.name;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Watch ${title}`,
          url: url,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWatchClick = (providerName: string) => {
    const title = movie.title || movie.name;
    const query = encodeURIComponent(title);
    let url = `https://www.google.com/search?q=${query}+watch+on+${providerName}`;
    const p = providerName.toLowerCase();

    if (p.includes('netflix')) url = `https://www.netflix.com/search?q=${query}`;
    else if (p.includes('amazon') || p.includes('prime')) url = `https://www.amazon.com/s?k=${query}&i=instant-video`;
    else if (p.includes('disney')) url = `https://www.disneyplus.com/search?q=${query}`;
    else if (p.includes('apple')) url = `https://tv.apple.com/search?term=${query}`;

    window.open(url, '_blank');
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-[#060606] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gray-800 border-t-yellow-500 rounded-full animate-spin"></div>
        </div>
    );
  }

  if (!movie) {
    return (
        <div className="min-h-screen bg-[#060606] text-white flex flex-col items-center justify-center gap-4">
            <p className="text-xl text-gray-400">Content not found.</p>
            <button onClick={() => router.push('/')} className="px-6 py-2 bg-yellow-500 text-black rounded-full font-bold">Go Home</button>
        </div>
    );
  }

  const title = movie.title || movie.name;
  const releaseDate = movie.release_date || movie.first_air_date;
  const year = releaseDate ? releaseDate.split('-')[0] : '';
  const runtime = movie.runtime || (movie.episode_run_time ? movie.episode_run_time[0] : null);
  const hours = runtime ? Math.floor(runtime / 60) : 0;
  const minutes = runtime ? runtime % 60 : 0;
  
  const matches = availability?.flatrate.filter(p => userSubIds.includes(p.provider_id)) || [];
  const otherProviders = availability?.flatrate.filter(p => !userSubIds.includes(p.provider_id)) || [];
  const isWatchlisted = watchlist.some(w => w.id === movie.id);

  return (
    <div className="min-h-screen bg-[#060606] text-gray-100 pb-20">
      {trailerId && (
        <VideoModal 
          youtubeId={trailerId} 
          isOpen={isTrailerOpen} 
          onClose={() => setIsTrailerOpen(false)} 
        />
      )}

      <div className="relative w-full h-[50vh] lg:h-[70vh]">
        <div className="absolute inset-0">
            {movie.backdrop_path && (
                <Image 
                    src={getImageUrl(movie.backdrop_path)} 
                    alt="Backdrop" 
                    fill 
                    className="object-cover opacity-40"
                    priority
                    unoptimized 
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#060606] via-[#060606]/40 to-transparent"></div>
        </div>

        <div className="absolute top-0 left-0 p-6 z-50">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
                <ArrowLeft className="w-5 h-5" /> Back
            </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 lg:p-12 flex flex-col md:flex-row gap-8 items-end max-w-7xl mx-auto">
            <div className="hidden md:block w-64 lg:w-80 flex-shrink-0 relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-black/80 border border-gray-800">
                {movie.poster_path && (
                    <Image src={getImageUrl(movie.poster_path)} alt={title} fill className="object-cover" unoptimized />
                )}
            </div>

            <div className="flex-1 space-y-6 mb-4">
                <div>
                    <h1 className="text-4xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-xl">{title}</h1>
                    <div className="flex flex-wrap items-center gap-4 mt-4 text-sm lg:text-base text-gray-300 font-medium">
                        <span className="bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded border border-yellow-500/30">{year}</span>
                        {runtime > 0 && (
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {hours}h {minutes}m</span>
                        )}
                        <span className="flex items-center gap-1 text-yellow-400"><Star className="w-4 h-4 fill-current" /> {movie.vote_average.toFixed(1)}</span>
                        {movie.genres?.map((g: any) => g.name).slice(0, 3).join(', ')}
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    {matches.length > 0 ? (
                        <button 
                            onClick={() => handleWatchClick(matches[0].provider_name)}
                            className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition-transform active:scale-95"
                        >
                            <PlayCircle className="w-6 h-6 fill-current" />
                            Watch on {matches[0].provider_name}
                        </button>
                    ) : (
                        <div className="flex items-center gap-3 bg-gray-800 text-gray-400 px-8 py-4 rounded-xl font-medium border border-gray-700 cursor-not-allowed">
                            Not in your subs
                        </div>
                    )}

                    {trailerId && (
                      <button 
                        onClick={() => setIsTrailerOpen(true)}
                        className="flex items-center gap-2 px-6 py-4 bg-red-600/90 hover:bg-red-600 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-red-900/20"
                      >
                        <Youtube className="w-6 h-6" />
                        Trailer
                      </button>
                    )}

                    <button 
                        onClick={toggleWatchlist}
                        className={`flex items-center gap-2 px-6 py-4 rounded-xl font-bold border transition-all ${isWatchlisted ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-gray-800/60 border-gray-600 hover:bg-gray-700 text-white'}`}
                    >
                        {isWatchlisted ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </button>

                    <button 
                        onClick={handleShare}
                        className="flex items-center gap-2 px-6 py-4 bg-gray-800/60 border border-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold transition-all"
                    >
                        {copied ? <Check className="w-5 h-5 text-green-400" /> : <Share2 className="w-5 h-5" />}
                    </button>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed max-w-3xl line-clamp-4 md:line-clamp-none">
                    {movie.overview}
                </p>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
            <section>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-yellow-500 rounded-full"></span> Top Cast
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {movie.credits?.cast?.slice(0, 10).map((actor: any) => (
                        <Link href={`/person/${actor.id}`} key={actor.id} className="w-32 flex-shrink-0 space-y-2 group cursor-pointer">
                            <div className="w-full h-40 relative rounded-lg overflow-hidden bg-gray-800 border border-transparent group-hover:border-white transition-all">
                                {actor.profile_path ? (
                                    <Image src={getImageUrl(actor.profile_path)} alt={actor.name} fill className="object-cover" unoptimized />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Image</div>
                                )}
                            </div>
                            <div>
                                <p className="text-white font-medium text-sm line-clamp-1 group-hover:text-yellow-500 transition-colors">{actor.name}</p>
                                <p className="text-gray-500 text-xs line-clamp-1">{actor.character}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {movie.similar?.results?.length > 0 && (
              <section>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <span className="w-1 h-6 bg-blue-500 rounded-full"></span> You Might Also Like
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {movie.similar.results.slice(0, 6).map((sim: any) => (
                          <Link href={`/${params?.type || 'movie'}/${sim.id}`} key={sim.id} className="group relative aspect-video rounded-lg overflow-hidden bg-gray-800 border border-gray-700 hover:border-gray-500 transition-all">
                              {sim.backdrop_path || sim.poster_path ? (
                                <Image src={getImageUrl(sim.backdrop_path || sim.poster_path)} alt={sim.title || sim.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                              <div className="absolute bottom-2 left-2 right-2">
                                <p className="text-white text-sm font-bold line-clamp-1">{sim.title || sim.name}</p>
                                <p className="text-gray-400 text-xs">{(sim.release_date || sim.first_air_date || '').split('-')[0]}</p>
                              </div>
                          </Link>
                      ))}
                  </div>
              </section>
            )}
        </div>

        <div className="space-y-8">
            <section className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white mb-4">Where to Watch</h3>
                
                {matches.length > 0 && (
                    <div className="mb-6">
                        <p className="text-xs text-green-400 font-bold uppercase tracking-wider mb-3">Included in your subs</p>
                        <div className="grid grid-cols-4 gap-3">
                            {matches.map(p => (
                                <button 
                                    key={p.provider_id} 
                                    onClick={() => handleWatchClick(p.provider_name)}
                                    className="aspect-square relative rounded-lg overflow-hidden ring-2 ring-green-500/50 hover:ring-green-400 transition-all hover:scale-105 bg-gray-900" 
                                    title={`Watch on ${p.provider_name}`}
                                >
                                    <Image 
                                      src={getImageUrl(p.logo_path)} 
                                      alt={p.provider_name} 
                                      fill 
                                      className="object-contain"
                                      unoptimized
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {otherProviders.length > 0 && (
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-3">Other Services</p>
                        <div className="grid grid-cols-4 gap-3">
                            {otherProviders.map(p => (
                                <button 
                                    key={p.provider_id} 
                                    onClick={() => handleWatchClick(p.provider_name)}
                                    className="aspect-square relative rounded-lg overflow-hidden opacity-60 hover:opacity-100 transition-all grayscale hover:grayscale-0 hover:scale-105 bg-gray-900" 
                                    title={`Watch on ${p.provider_name}`}
                                >
                                    <Image 
                                      src={getImageUrl(p.logo_path)} 
                                      alt={p.provider_name} 
                                      fill 
                                      className="object-contain"
                                      unoptimized
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                
                {matches.length === 0 && otherProviders.length === 0 && (
                     <p className="text-gray-500 text-sm">No streaming information available for this title in your region.</p>
                )}
            </section>

            <section className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white mb-4">Information</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-gray-800 pb-2">
                        <span className="text-gray-400">Original Title</span>
                        <span className="text-white font-medium">{movie.original_title || movie.original_name}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-800 pb-2">
                        <span className="text-gray-400">Status</span>
                        <span className="text-white font-medium">{movie.status}</span>
                    </div>
                    <div className="flex justify-between pb-2">
                        <span className="text-gray-400">Release Date</span>
                        <span className="text-white font-medium">{movie.release_date || movie.first_air_date}</span>
                    </div>
                </div>
            </section>
        </div>
      </div>
    </div>
  );
}