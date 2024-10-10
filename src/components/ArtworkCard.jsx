import React from 'react';

const ArtworkCard = ({ artwork }) => {
  return (
    <div className="artwork-card">
      <img src={artwork.image} alt={artwork.title} />
      <h3>{artwork.title}</h3>
      <p>Artist: {artwork.artist}</p>
      <p>Source: {artwork.source}</p>
    </div>
  );
};

export default ArtworkCard;