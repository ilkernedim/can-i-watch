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
  } else if (type === 'movie') {
    const data = await discoverMedia('movie');
    results = (data.results || []).map((item: any) => ({ ...item, media_type: 'movie' }));
    displayQuery = "Popular Movies";
  } else if (type === 'tv') {
    const data = await discoverMedia('tv');
    results = (data.results || []).map((item: any) => ({ ...item, media_type: 'tv' }));
    displayQuery = "Popular TV Shows";
  } else {
    const data = await searchMulti("Avengers");
    results = data.results || [];
    displayQuery = "Avengers";
  }

  const genreData = await getGenres('movie');

  const filteredResults = results.filter((item: any) => 
    item.media_type === 'movie' || item.media_type === 'tv'
  );

  return (
    <SearchClient 
        initialResults={filteredResults} 
        initialQuery={displayQuery}
        genres={genreData.genres || []}
        initialType={type === 'movie' || type === 'tv' ? type : 'all'}
    />
  );
}