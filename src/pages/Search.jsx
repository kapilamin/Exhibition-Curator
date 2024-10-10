// src/pages/Search.jsx
import React, { useState } from 'react';
import SearchForm from '../components/SearchForm';
import ArtworkList from '../components/ArtworkList';
import { searchArtworks as searchMetArtworks, getMultipleArtworkDetails } from '../api/metropolitanApi';
import { searchArtworks as searchHarvardArtworks } from '../api/harvardApi';

const Search = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query) => {
    setIsLoading(true);
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
          artist: artwork.people ? artwork.people[0].name : 'Unknown',
          image: artwork.primaryimageurl,
          source: 'Harvard Art Museums'
        }))
      ];

      setResults(combinedResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  
    console.log('Search component rendering');
};

  return (
    <div className="search-page">
      <h2>Search Artworks</h2>
      <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      <ArtworkList artworks={results} />
    </div>
  );
};

export default Search;