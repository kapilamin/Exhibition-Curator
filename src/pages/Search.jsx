import React, { useState } from 'react';
import SearchForm from '../components/SearchForm';
import ArtworkList from '../components/ArtworkList';
import { searchArtworks } from '../services/api';

const Search = () => {
  const [artworks, setArtworks] = useState([]);

  const handleSearch = async (searchTerm) => {
    const results = await searchArtworks(searchTerm);
    setArtworks(results);
  };

  return (
    <div className="search">
      <h2>Search Artworks</h2>
      <SearchForm onSearch={handleSearch} />
      <ArtworkList artworks={artworks} />
    </div>
  );
};

export default Search;