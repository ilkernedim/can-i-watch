import { searchMulti, getGenres } from "@/lib/tmdb/client";
import SearchClient from "./SearchClient";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || "Avengers"; 

  const [searchResults, genres] = await Promise.all([
    searchMulti(query),
    getGenres('movie')
  ]);

  const results = searchResults.results || [];

  const filteredResults = results.filter((item: any) => 
    item.media_type === 'movie' || item.media_type === 'tv'
  );

  return (
    <SearchClient 
        initialResults={filteredResults} 
        initialQuery={query}
        genres={genres.genres || []}
    />
  );
}