import { Movie } from '@/types';


const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_DIRECT_URL = 'https://api.themoviedb.org/3';
const PROXY_URL = '/api/tmdb';

async function fetchFromApi(endpoint: string, params: Record<string, string | number> = {}) {
  
  const isServer = typeof window === 'undefined';

  let url = '';
  let queryParams = new URLSearchParams(
      Object.entries(params).map(([key, val]) => [key, String(val)])
  );

  if (isServer) {
    
    url = `${TMDB_DIRECT_URL}/${endpoint}`;
    queryParams.append('api_key', API_KEY || '');
  } else {
  
    url = PROXY_URL;
    queryParams.append('endpoint', endpoint);
  }

  const finalUrl = `${url}?${queryParams.toString()}`;

  try {
    const res = await fetch(finalUrl, {
      
      next: { revalidate: 3600 } 
    });

    if (!res.ok) {
        console.error(`API Error (${isServer ? 'Server' : 'Client'}): ${res.status} on ${endpoint}`);
        
        throw new Error(`Fetch failed: ${res.status}`);
    }
  
    return res.json();
  } catch (error) {
    console.error("Fetch function error:", error);
    
    throw error;
  }
}

export async function getTrending(page = 1) {
  return fetchFromApi('trending/all/week', { page });
}

export async function searchMulti(query: string, page = 1) {
  return fetchFromApi('search/multi', { query, page });
}

export async function discoverMedia(type: 'movie' | 'tv', genreId?: number, page = 1) {
  const params: any = { page, sort_by: 'popularity.desc' };
  if (genreId) params.with_genres = genreId;
  
  return fetchFromApi(`discover/${type}`, params);
}

export async function getMediaDetails(type: 'movie' | 'tv', id: string) {
  return fetchFromApi(`${type}/${id}`, {
    append_to_response: 'credits,videos,similar,external_ids'
  });
}


export async function getPersonDetails(id: string) {
    return fetchFromApi(`person/${id}`, {
        append_to_response: 'combined_credits,external_ids'
    });
}