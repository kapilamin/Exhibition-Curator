import React from 'react';

const ArtworkDetail = ({ artwork }) => {
  return (
    <div className="artwork-detail">
      <h2>{artwork.title}</h2>
      <img src={artwork.imageUrl} alt={artwork.title} />
      <p>Artist: {artwork.artist}</p>
      <p>Year: {artwork.year}</p>
      <p>Medium: {artwork.medium}</p>
      <p>{artwork.description}</p>
    </div>
  );
};

export default ArtworkDetail;