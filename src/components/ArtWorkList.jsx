import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, ExternalLink } from 'lucide-react';

const ArtworkList = ({ artworks, onAddToExhibition }) => {
  if (!artworks?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No artworks to display. Try searching for something!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {artworks.map((artwork, index) => (
        <div key={artwork.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <Link 
            to={`/artwork/${artwork.source}/${artwork.id}`} 
            state={{ artworkList: artworks, currentIndex: index }}
            className="block"
          >
            <div className="aspect-square relative">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-artwork.jpg';
                }}
              />
            </div>
          </Link>

          <div className="p-4">
            <h3 className="text-lg font-semibold line-clamp-2">
              <Link 
                to={`/artwork/${artwork.source}/${artwork.id}`}
                state={{ artworkList: artworks, currentIndex: index }}
                className="hover:text-purple-600 transition-colors"
              >
                {artwork.title}
              </Link>
            </h3>
            
            <p className="text-gray-600 mt-1 mb-2">
              {artwork.artist || 'Unknown Artist'}
            </p>
            
            <div className="mt-4 flex justify-between items-center">
              {onAddToExhibition && (
                <button
                  onClick={() => onAddToExhibition(artwork)}
                  className="flex items-center gap-1 text-green-600 hover:text-green-700"
                >
                  <Plus size={16} />
                  <span className="text-sm font-medium">Add</span>
                </button>
              )}
              
              <Link
                to={`/artwork/${artwork.source}/${artwork.id}`}
                state={{ artworkList: artworks, currentIndex: index }}
                className="flex items-center gap-1 text-purple-600 hover:text-purple-700"
              >
                <span className="text-sm font-medium">View Details</span>
                <ExternalLink size={16} />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArtworkList;