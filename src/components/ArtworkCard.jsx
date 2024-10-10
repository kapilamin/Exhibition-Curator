import React from 'react';

const ArtworkCard = ({ artwork }) => {
  return (
    <div className="artwork-card">
      {artwork.image ? (
        <img 
          src={artwork.image} 
          alt={artwork.title} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'path/to/fallback/image.jpg';
          }}
        />
      ) : (
        <div className="artwork-image-placeholder">No image available</div>
      )}
      <h3>{artwork.title}</h3>
      <p>Artist: {artwork.artist || 'Unknown'}</p>
      <p>Source: {artwork.source}</p>
    </div>
  );
};

export default ArtworkCard;