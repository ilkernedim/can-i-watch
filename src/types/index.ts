export interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  media_type: 'movie' | 'tv';
  vote_average: number;
}

export interface StreamingProviderInfo {
  provider_id: number;
  provider_name: string;
  logo_path?: string;
}

export interface AvailabilityResult {
  tmdbId: number;
  link?: string;
  flatrate: StreamingProviderInfo[];
  rent: StreamingProviderInfo[];
  buy: StreamingProviderInfo[];
}

export const SUPPORTED_PROVIDERS: StreamingProviderInfo[] = [
  { 
    provider_id: 8, 
    provider_name: 'Netflix', 
    logo_path: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg' 
  },
  { 
    provider_id: 119, 
    provider_name: 'Amazon Prime Video', 
    logo_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Amazon_Prime_Video_logo.svg/512px-Amazon_Prime_Video_logo.svg.png' 
  },
  { 
    provider_id: 337, 
    provider_name: 'Disney Plus', 
    logo_path: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg' 
  },
  { 
    provider_id: 350, 
    provider_name: 'Apple TV Plus', 
    logo_path: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg' 
  },
  { 
    provider_id: 538, 
    provider_name: 'BluTV', 
    
    logo_path: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' style='background-color:%23151515'><text x='50' y='55' font-family='Arial, sans-serif' font-weight='bold' font-size='22' fill='white' text-anchor='middle' dominant-baseline='middle'>BluTV</text></svg>`
  },
  { 
    provider_id: 11, 
    provider_name: 'MUBI', 
   
    logo_path: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' style='background-color:%230e1424'><text x='50' y='55' font-family='Arial, sans-serif' font-weight='bold' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle' letter-spacing='2'>MUBI</text></svg>`
  }
];
