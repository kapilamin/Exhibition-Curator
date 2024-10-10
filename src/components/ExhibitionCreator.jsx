import React from 'react';
import ArtworkCard from './ArtworkCard';

const ExhibitionCreator = ({ selectedArtworks, removeArtwork }) => {
  return (
    <div className="exhibition-creator">
      {selectedArtworks.length === 0 ? (
        <p>Your exhibition is empty. Add some artworks from the search page!</p>
      ) : (
        selectedArtworks.map(artwork => (
          <div key={artwork.id}>
            <ArtworkCard artwork={artwork} />
            <button onClick={() => removeArtwork(artwork.id)}>Remove from Exhibition</button>
          </div>
        ))
      )}
    </div>
  );
};

export default ExhibitionCreator;