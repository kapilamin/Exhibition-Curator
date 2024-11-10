import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus } from 'lucide-react';

const ArtworkCard = ({ artwork, onAddToExhibition, onRemove }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-square relative bg-gray-100">
        {/* Show loading spinner while loading */}
        {isImageLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="mt-2 text-sm text-gray-500">Loading artwork...</span>
            </div>
          </div>
        )}

        <div className="relative h-full w-full">
          <Link to={`/artwork/${artwork.source}/${artwork.id}`} className="block h-full">
            <img
              src={artwork.image || '/placeholder-artwork.jpg'}
              alt={artwork.title}
              className={`w-full h-full object-cover hover:opacity-90 transition-all duration-300 ${
                isImageLoading ? 'opacity-25' : 'opacity-100'
              }`}
              onLoad={() => setIsImageLoading(false)}
              onError={(e) => {
                setIsImageLoading(false);
                e.target.onerror = null;
                e.target.src = '/placeholder-artwork.jpg';
              }}
            />
          </Link>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-2 text-blue-500">
          <Link 
            to={`/artwork/${artwork.source}/${artwork.id}`}
            className="hover:text-purple-600 transition-colors"
          >
            {artwork.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 mt-1 mb-2">
          {artwork.artist || 'Unknown Artist'}
        </p>
        
        {artwork.date && (
          <p className="text-gray-500 text-sm mb-4">
            {artwork.date}
          </p>
        )}

        <div className="flex items-center justify-between">
          {onAddToExhibition && (
            <button
              onClick={() => onAddToExhibition(artwork)}
              className="flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors"
            >
              <Plus size={16} />
              <span className="text-sm font-medium">Add</span>
            </button>
          )}
          
          {onRemove && (
            <button
              onClick={() => onRemove(artwork.id)}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors"
            >
              <Minus size={16} />
              <span className="text-sm font-medium">Remove</span>
            </button>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Source: {artwork.source === 'met' ? 'Metropolitan Museum of Art' : 'Harvard Art Museums'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;