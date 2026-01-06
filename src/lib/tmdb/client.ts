const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;

export const searchMulti = async (query: string, page = 1) => {
  if (!query) return { results: [], total_pages: 0 };
  const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
  if (!res.ok) throw new Error('Failed to fetch from TMDB');
  return res.json();
};

export const getTrending = async (page = 1) => {
  const res = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&page=${page}`);
  if (!res.ok) throw new Error('Failed to fetch trending');
  return res.json();
};

export const getMediaDetails = async (type: 'movie' | 'tv', id: string) => {
  const res = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&append_to_response=credits,similar,videos`);
  if (!res.ok) throw new Error('Failed to fetch details');
  return res.json();
};

export const getGenres = async (type: 'movie' | 'tv' = 'movie') => {
  const res = await fetch(`${BASE_URL}/genre/${type}/list?api_key=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch genres');
  return res.json();
};

export const discoverMedia = async (type: 'movie' | 'tv', genreId?: number, page = 1) => {
  let url = `${BASE_URL}/discover/${type}?api_key=${API_KEY}&sort_by=popularity.desc&page=${page}&vote_count.gte=100`;
  if (genreId) url += `&with_genres=${genreId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to discover media');
  return res.json();
};

export const getTopTVShows = async () => {
  const res = await fetch(`${BASE_URL}/trending/tv/day?api_key=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch top tv');
  return res.json();
};

export const getPersonDetails = async (id: string) => {
  const res = await fetch(`${BASE_URL}/person/${id}?api_key=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch person details');
  return res.json();
};

export const getPersonCredits = async (id: string) => {
  const res = await fetch(`${BASE_URL}/person/${id}/combined_credits?api_key=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch person credits');
  return res.json();
};
