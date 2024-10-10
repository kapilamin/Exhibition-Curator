import React from 'react';

const ExhibitionCreator = ({ selectedArtworks, removeArtwork }) => {
  return (
    <div className="exhibition-creator">
      <h2>My Exhibition</h2>
      {selectedArtworks.map((artwork) => (
        <div key={artwork.id}>
          <img src={artwork.thumbnailUrl} alt={artwork.title} />
          <p>{artwork.title}</p>
          <button onClick={() => removeArtwork(artwork.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default ExhibitionCreator;