import React, { useState, useEffect } from 'react';
import SearchForm from '../components/SearchForm';
import ArtworkList from '../components/ArtworkList';
import { searchArtworks as searchMetArtworks, getMultipleArtworkDetails } from '../api/metropolitanApi';
import { searchArtworks as searchHarvardArtworks } from '../api/harvardApi';

const Search = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');

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

  const addToExhibition = (artwork) => {
    const savedArtworks = JSON.parse(sessionStorage.getItem('selectedArtworks') || '[]');
    if (!savedArtworks.some(saved => saved.id === artwork.id)) {
      const updatedArtworks = [...savedArtworks, artwork];
      sessionStorage.setItem('selectedArtworks', JSON.stringify(updatedArtworks));
      alert('Artwork added to your exhibition!');
    } else {
      alert('This artwork is already in your exhibition.');
    }
  };

  useEffect(() => {
    let filtered = [...results];
    
    // Apply filter
    if (filter !== 'all') {
      filtered = filtered.filter(artwork => artwork.source === filter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'artist') {
        return (a.artist || 'Unknown').localeCompare(b.artist || 'Unknown');
      }
      return 0;
    });

    setFilteredResults(filtered);
  }, [results, filter, sortBy]);

  return (
    <div className="search-page">
      <h2>Search Artworks</h2>
      <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      {error && <p className="error">{error}</p>}
      <div className="filter-sort-controls">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Sources</option>
          <option value="Metropolitan Museum of Art">Metropolitan Museum of Art</option>
          <option value="Harvard Art Museums">Harvard Art Museums</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="title">Sort by Title</option>
          <option value="artist">Sort by Artist</option>
        </select>
      </div>
      <ArtworkList artworks={filteredResults} onAddToExhibition={addToExhibition} />
    </div>
  );
};

export default Search;