import React from 'react';
import { useExhibition } from '../contexts/ExhibitionContext';
import { useToast } from '../contexts/ToastContext';
import ArtworkCard from '../components/ArtworkCard';

const Exhibition = () => {
  const { exhibition, removeFromExhibition } = useExhibition();
  const { showToast } = useToast();


  const handleRemove = (artwork) => {
    removeFromExhibition(artwork.id);
    showToast(`${artwork.title} has been removed from your exhibition`, 'error');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6"> {/* Added consistent padding */}
      <h2 className="text-3xl font-bold mb-8 text-center sm:text-left">
        Your Curated Exhibition
      </h2>
      
      {exhibition.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300">
            Your exhibition is empty. Add some artworks from the search page!
          </p>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {/* Changed to space-y for mobile and grid for larger screens */}
          {exhibition.map(artwork => (
            <div key={artwork.id} className="exhibition-artwork-container">
              {/* Added wrapper div for better mobile spacing */}
              <ArtworkCard
                artwork={artwork}
                onRemove={() => handleRemove(artwork)}
                isExhibition
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Exhibition;