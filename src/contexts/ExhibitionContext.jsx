import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  searchArtworks as searchMetArtworks, 
  getArtworkDetails as getMetArtworkDetails 
} from '../api/metropolitanApi';
import { 
  searchArtworks as searchHarvardArtworks, 
  getArtworkDetails as getHarvardArtworkDetails 
} from '../api/harvardApi';

const ExhibitionContext = createContext();

export const useExhibition = () => {
  const context = useContext(ExhibitionContext);
  if (!context) {
    throw new Error('useExhibition must be used within an ExhibitionProvider');
  }
  return context;
};

export const ExhibitionProvider = ({ children }) => {
  const [exhibition, setExhibition] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search across both APIs
  const searchAllArtworks = useCallback(async (searchTerm) => {
    setLoading(true);
    setError(null);
    try {
      // Search both APIs concurrently
      const [metResults, harvardResults] = await Promise.all([
        searchMetArtworks(searchTerm),
        searchHarvardArtworks(searchTerm, 10)
      ]);

      // Get Met artwork details
      const metArtworksPromises = (metResults || [])
        .slice(0, 10)
        .map(id => getMetArtworkDetails(id));
      
      const metArtworks = await Promise.all(metArtworksPromises);

      // Process Harvard results
      const harvardArtworksPromises = (harvardResults || [])
        .slice(0, 10)
        .map(result => getHarvardArtworkDetails(result.id));

      const harvardArtworks = await Promise.all(harvardArtworksPromises);

      // Format and combine results
      const combinedResults = [
        ...metArtworks.map(artwork => ({
          id: artwork.objectID.toString(),
          title: artwork.title,
          artist: artwork.artistDisplayName || 'Unknown',
          image: artwork.primaryImageSmall,
          source: 'met',
          date: artwork.objectDate,
          medium: artwork.medium,
          dimensions: artwork.dimensions,
          link: artwork.objectURL
        })),
        ...harvardArtworks.map(artwork => ({
          id: artwork.id.toString(),
          title: artwork.title,
          artist: artwork.people?.length ? artwork.people[0].name : 'Unknown',
          image: artwork.primaryimageurl,
          source: 'harvard',
          date: artwork.dated,
          medium: artwork.classification,
          dimensions: artwork.dimensions,
          link: `https://harvardartmuseums.org/collections/object/${artwork.id}`
        }))
      ].filter(artwork => artwork.image); // Only include artworks with images

      setSearchResults(combinedResults);
    } catch (err) {
      setError('Error searching artworks. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add artwork to exhibition
  const addToExhibition = useCallback((artwork) => {
    setExhibition(prev => {
      if (prev.some(item => item.id === artwork.id)) {
        return prev;
      }
      return [...prev, artwork];
    });
  }, []);

  // Remove artwork from exhibition
  const removeFromExhibition = useCallback((artworkId) => {
    setExhibition(prev => prev.filter(item => item.id !== artworkId));
  }, []);

  // Clear entire exhibition
  const clearExhibition = useCallback(() => {
    setExhibition([]);
  }, []);

  // Get next artwork in exhibition
  const getNextArtwork = useCallback((currentId) => {
    const currentIndex = exhibition.findIndex(item => item.id === currentId);
    return exhibition[currentIndex + 1] || null;
  }, [exhibition]);

  // Get previous artwork in exhibition
  const getPreviousArtwork = useCallback((currentId) => {
    const currentIndex = exhibition.findIndex(item => item.id === currentId);
    return exhibition[currentIndex - 1] || null;
  }, [exhibition]);

  const value = {
    exhibition,
    searchResults,
    loading,
    error,
    searchAllArtworks,
    addToExhibition,
    removeFromExhibition,
    clearExhibition,
    getNextArtwork,
    getPreviousArtwork
  };

  return (
    <ExhibitionContext.Provider value={value}>
      {children}
    </ExhibitionContext.Provider>
  );
};