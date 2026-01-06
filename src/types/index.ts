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
    provider_name: 'Prime Video', 
    logo_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Amazon_Prime_Video_logo.svg/512px-Amazon_Prime_Video_logo.svg.png' 
  },
  { 
    provider_id: 337, 
    provider_name: 'Disney+', 
    logo_path: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg' 
  },
  { 
    provider_id: 384, 
    provider_name: 'HBO Max', 
    logo_path: 'https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg' 
  },
  
  { 
    provider_id: 350, 
    provider_name: 'Apple TV+', 
    logo_path: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg' 
  },
  { 
    provider_id: 386, 
    provider_name: 'Peacock', 
    logo_path: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' style='background-color:%23000000'><circle cx='50' cy='50' r='40' fill='url(%23g)'/><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='%2300c6ff'/><stop offset='1' stop-color='%230072ff'/></linearGradient></defs><text x='50' y='55' font-family='Arial, sans-serif' font-weight='bold' font-size='16' fill='white' text-anchor='middle' dominant-baseline='middle'>Peacock</text></svg>`
  },
  { 
    provider_id: 538, 
    provider_name: 'BluTV', 
    logo_path: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' style='background-color:%23151515'><path d='M20,50 L40,50' stroke='cyan' stroke-width='5'/><text x='50' y='58' font-family='Arial, sans-serif' font-weight='bold' font-size='24' fill='white' text-anchor='middle'>BluTV</text></svg>`
  },
  { 
    provider_id: 1907, 
    provider_name: 'Exxen', 
    logo_path: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' style='background-color:%23000000'><text x='50' y='55' font-family='Arial, sans-serif' font-weight='bold' font-size='24' fill='%23ffd700' text-anchor='middle' dominant-baseline='middle'>EXXEN</text></svg>`
  },
  { 
    provider_id: 588, 
    provider_name: 'Gain', 
    logo_path: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' style='background-color:%23da291c'><text x='50' y='55' font-family='Arial, sans-serif' font-weight='bold' font-size='26' fill='white' text-anchor='middle' dominant-baseline='middle'>GAİN</text></svg>`
  },
  { 
    provider_id: 399, 
    provider_name: 'TOD (beIN)', 
    logo_path: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' style='background-color:%2317072b'><text x='50' y='55' font-family='Arial, sans-serif' font-weight='bold' font-size='30' fill='white' text-anchor='middle' dominant-baseline='middle'>TOD</text></svg>`
  },
  { 
    provider_id: 547, 
    provider_name: 'TV+', 
    logo_path: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' style='background-color:%23ffc900'><text x='50' y='55' font-family='Arial, sans-serif' font-weight='bold' font-size='30' fill='black' text-anchor='middle' dominant-baseline='middle'>TV+</text></svg>`
  },
  { 
    provider_id: 546, 
    provider_name: 'PuhuTV', 
    logo_path: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' style='background-color:%23000000'><text x='50' y='55' font-family='Arial, sans-serif' font-weight='bold' font-size='22' fill='white' text-anchor='middle' dominant-baseline='middle'>puhu</text></svg>`
  },
  { 
    provider_id: 11, 
    provider_name: 'MUBI', 
    logo_path: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' style='background-color:%230e1424'><text x='50' y='55' font-family='Arial, sans-serif' font-weight='bold' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle' letter-spacing='2'>MUBI</text></svg>`
  },
  { 
    provider_id: 283, 
    provider_name: 'Crunchyroll', 
    logo_path: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' style='background-color:%23f47521'><text x='50' y='55' font-family='Arial, sans-serif' font-weight='bold' font-size='14' fill='white' text-anchor='middle' dominant-baseline='middle'>Crunchyroll</text></svg>`
  }
];