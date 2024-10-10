import React from 'react';
import ArtworkCard from './ArtworkCard';

const ArtworkList = ({ artworks, onAddToExhibition }) => {
  return (
    <div className="artwork-list">
      {artworks.map(artwork => (
        <ArtworkCard 
          key={`${artwork.source}-${artwork.id}`}
          artwork={artwork} 
          onAddToExhibition={() => onAddToExhibition && onAddToExhibition(artwork)}
        />
      ))}
    </div>
  );
};

export default ArtworkList;
