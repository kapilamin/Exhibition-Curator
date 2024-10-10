import React, { useState, useEffect } from 'react';
import ExhibitionCreator from '../components/ExhibitionCreator';

const Exhibition = () => {
  const [selectedArtworks, setSelectedArtworks] = useState([]);

  useEffect(() => {
    // Load saved artworks from session storage when component mounts
    const savedArtworks = sessionStorage.getItem('selectedArtworks');
    if (savedArtworks) {
      setSelectedArtworks(JSON.parse(savedArtworks));
    }
  }, []);

  useEffect(() => {
    // Save artworks to session storage whenever it changes
    sessionStorage.setItem('selectedArtworks', JSON.stringify(selectedArtworks));
  }, [selectedArtworks]);

  const removeArtwork = (id) => {
    setSelectedArtworks(selectedArtworks.filter(artwork => artwork.id !== id));
  };

  return (
    <div className="exhibition">
      <h2>Your Curated Exhibition</h2>
      <ExhibitionCreator
        selectedArtworks={selectedArtworks}
        removeArtwork={removeArtwork}
      />
    </div>
  );
};

export default Exhibition;