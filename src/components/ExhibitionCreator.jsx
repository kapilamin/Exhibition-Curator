import React from 'react';

const ExhibitionCreator = ({ selectedArtworks, removeArtwork, addArtwork }) => {
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
      <button onClick={addArtwork}>Add Artwork</button>
    </div>
  );
};

export default ExhibitionCreator;