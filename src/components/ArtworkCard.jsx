import React from 'react';
import { Link } from 'react-router-dom';

const ArtworkCard = ({ artwork }) => {
  return (
    <div className="artwork-card">
      <img src={artwork.thumbnailUrl} alt={artwork.title} />
      <h3>{artwork.title}</h3>
      <p>{artwork.artist}</p>
      <Link to={`/artwork/${artwork.id}`}>View Details</Link>
    </div>
  );
};

export default ArtworkCard;