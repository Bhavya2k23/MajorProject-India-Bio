export interface SpeciesImageSource {
  id?: string;
  name?: string;
  common_name?: string;
  species_name?: string;
  type?: string;
  image?: string;
  imageUrl?: string;
  images?: string[];
}

const DEFAULT_LOCAL_FALLBACK = "https://images.unsplash.com/photo-1500829243541-74b67eeccc18?auto=format&fit=crop&q=80&w=800"; // A beautiful abstract nature landscape

/**
 * Resolves the true image for a species. 
 * Re-engineered to explicitly discard inaccurate static mapping (e.g. replacing any cat with a tiger)
 * and strict prioritize database-provided Wikipedia assets.
 */
export const resolveSpeciesImage = (species: SpeciesImageSource): string => {
  const getAbs = (url: string) => url.startsWith("http") ? url : `http://localhost:5000${url}`;

  // 1. Valid DB Primary Image Array
  if (species.images && species.images.length > 0 && species.images[0]?.trim()) {
    return getAbs(species.images[0].trim());
  }

  // 2. Valid Single DB Image String
  if (species.imageUrl && species.imageUrl.trim()) {
    return getAbs(species.imageUrl.trim());
  }
  if (species.image && species.image.trim()) {
     return getAbs(species.image.trim());
  }

  // 3. Absolute Fallback: Standard abstract nature landscape to avoid false taxonomical visual representations
  return DEFAULT_LOCAL_FALLBACK;
};

export const resolveAllSpeciesImages = (species: SpeciesImageSource): string[] => {
  const primary = resolveSpeciesImage(species);
  // If there are actually multiple valid images (e.g., from DB), return them
  if (species.images && species.images.length > 1) {
    return species.images.filter(Boolean).map(url => url.startsWith("http") ? url : `http://localhost:5000${url}`);
  }
  return [primary];
};
