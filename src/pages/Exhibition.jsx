import React from 'react';
import { useExhibition } from '../contexts/ExhibitionContext';
import ArtworkCard from '../components/ArtworkCard';

const Exhibition = () => {
  const { exhibition, removeFromExhibition } = useExhibition();

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Your Curated Exhibition</h2>
      
      {exhibition.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            Your exhibition is empty. Add some artworks from the search page!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exhibition.map(artwork => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              onRemove={() => removeFromExhibition(artwork.id)}
              isExhibition
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Exhibition;