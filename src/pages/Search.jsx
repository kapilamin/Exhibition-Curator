// src/pages/Search.jsx
import React, { useState } from 'react';
import SearchForm from '../components/SearchForm';
import ArtworkList from '../components/ArtworkList';
import { searchArtworks as searchMetArtworks, getMultipleArtworkDetails } from '../api/metropolitanApi';
import { searchArtworks as searchHarvardArtworks } from '../api/harvardApi';

const Search = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    try {
      // Search Metropolitan Museum
      const metObjectIds = await searchMetArtworks(query);
      const metArtworks = await getMultipleArtworkDetails(metObjectIds, 10);

      // Search Harvard Art Museums
      const harvardArtworks = await searchHarvardArtworks(query, 10);

      // Combine results
      const combinedResults = [
        ...metArtworks.map(artwork => ({
          id: artwork.objectID,
          title: artwork.title,
          artist: artwork.artistDisplayName,
          image: artwork.primaryImageSmall,
          source: 'Metropolitan Museum of Art'
        })),
        ...harvardArtworks.map(artwork => ({
          id: artwork.id,
          title: artwork.title,
          artist: artwork.people ? artwork.people.map(p => p.name).join(', ') : 'Unknown',
          image: artwork.primaryimageurl,
          source: 'Harvard Art Museums'
        }))
      ];

      setResults(combinedResults);
    } catch (error) {
      console.error('Search failed:', error);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-page">
      <h2>Search Artworks</h2>
      <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      {error && <p className="error">{error}</p>}
      <ArtworkList artworks={results} />
    </div>
  );
};

export default Search;