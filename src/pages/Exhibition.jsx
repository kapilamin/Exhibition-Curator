import React, { useContext } from 'react';
import { ExhibitionContext } from '../contexts/ExhibitionContext';
import ArtworkCard from '../components/ArtworkCard';

const Exhibition = () => {
  const { exhibition, removeFromExhibition } = useContext(ExhibitionContext);

  return (
    <div className="exhibition">
      <h2>Your Curated Exhibition</h2>
      {exhibition.length === 0 ? (
        <p>Your exhibition is empty. Add some artworks from the search page!</p>
      ) : (
        exhibition.map(artwork => (
          <ArtworkCard
            key={artwork.id}
            artwork={artwork}
            onRemove={() => removeFromExhibition(artwork.id)}
          />
        ))
      )}
    </div>
  );
};

export default Exhibition;