import { MockAvailabilityProvider } from './mockProvider';
import { IAvailabilityProvider } from './types';

const provider: IAvailabilityProvider = new MockAvailabilityProvider();

export const getMediaAvailability = async (id: number, type: 'movie' | 'tv', country = 'TR') => {
  return provider.getAvailability(id, type, country);
};