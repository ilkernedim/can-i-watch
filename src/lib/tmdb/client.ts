import { Movie } from '@/types';

const BASE_URL = '/api/tmdb';

async function fetchFromApi(endpoint: string, params: Record<string, string | number> = {}) {
  const query = new URLSearchParams({
    endpoint,
    ...Object.fromEntries(
        Object.entries(params).map(([key, val]) => [key, String(val)])
    ),
  });

  const res = await fetch(`${BASE_URL}?${query.toString()}`);
  
  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }
  
  return res.json();
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