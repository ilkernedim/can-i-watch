import { AvailabilityResult } from '@/types';

export interface IAvailabilityProvider {
  getAvailability(tmdbId: number, mediaType: 'movie' | 'tv', country: string): Promise<AvailabilityResult>;
}