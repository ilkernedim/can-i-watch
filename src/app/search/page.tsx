import { searchMulti, getGenres, discoverMedia } from "@/lib/tmdb/client";
import SearchClient from "./SearchClient";

type SearchPageProps = {
  searchParams: Promise<{ q?: string; type?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, type } = await searchParams;
  
  let results = [];
  let displayQuery = "";

  
  if (q) {
    const data = await searchMulti(q);
    results = data.results || [];
    displayQuery = q;
  } 
 
  else if (type === 'movie') {
    const data = await discoverMedia('movie');
    
    results = (data.results || []).map((item: any) => ({ ...item, media_type: 'movie' }));
    displayQuery = "Popular Movies";
  } 
  
  else if (type === 'tv') {
    const data = await discoverMedia('tv');
    results = (data.results || []).map((item: any) => ({ ...item, media_type: 'tv' }));
    displayQuery = "Popular TV Shows";
  } 
  
  else {
    const data = await searchMulti("Avengers");
    results = data.results || [];
    displayQuery = "Trending";
  }

  const genreData = await getGenres('movie');

  
  return (
    <SearchClient 
        initialResults={results} 
        initialQuery={displayQuery}
        genres={genreData.genres || []}
        // Eğer linkten geldiyse filtreyi otomatik seçili yap
        initialType={type === 'movie' || type === 'tv' ? type : 'all'}
    />
  );
}