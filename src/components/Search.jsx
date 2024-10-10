// src/components/Search.jsx
import React, { useState } from 'react';
import { searchArtworks as searchMetArtworks, getMultipleArtworkDetails } from '../api/metropolitanApi';
import { searchArtworks as searchHarvardArtworks } from '../api/harvardApi';
import SearchForm from './SearchForm';
import ArtworkList from './ArtworkList';

const Search = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    try {
      const metObjectIds = await searchMetArtworks(query);
      const metArtworks = await getMultipleArtworkDetails(metObjectIds, 10); // Limit to 10 results

      const harvardArtworks = await searchHarvardArtworks(query, 10); // Limit to 10 results

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
    <div>
      <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      {error && <p className="error">{error}</p>}
      <ArtworkList artworks={results} />
    </div>
  );
};

export default Search;