import { IAvailabilityProvider } from './types';
import { AvailabilityResult, SUPPORTED_PROVIDERS } from '@/types';

export class MockAvailabilityProvider implements IAvailabilityProvider {
  async getAvailability(tmdbId: number, mediaType: 'movie' | 'tv', country: string): Promise<AvailabilityResult> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const flatrate = [];
    const seed = tmdbId;

    if (seed % 2 === 0) flatrate.push(SUPPORTED_PROVIDERS[0]);
    if (seed % 3 === 0) flatrate.push(SUPPORTED_PROVIDERS[1]);
    if (seed % 5 === 0) flatrate.push(SUPPORTED_PROVIDERS[2]);
    if (seed % 7 === 0) flatrate.push(SUPPORTED_PROVIDERS[3]);
    if (seed % 11 === 0) flatrate.push(SUPPORTED_PROVIDERS[4]);
    if (seed % 13 === 0) flatrate.push(SUPPORTED_PROVIDERS[5]);

    if (flatrate.length === 0) {
       const randomIndex = tmdbId % SUPPORTED_PROVIDERS.length;
       flatrate.push(SUPPORTED_PROVIDERS[randomIndex]);
    }

    return {
      tmdbId,
      flatrate,
      rent: [],
      buy: [],
      link: 'https://www.google.com'
    };
  }
}
