import React, { useState } from 'react';
import ExhibitionCreator from '../components/ExhibitionCreator';

const Exhibition = () => {
  const [selectedArtworks, setSelectedArtworks] = useState([]);

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