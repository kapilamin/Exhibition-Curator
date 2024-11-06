import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

const ArtworkList = ({ 
  artworks, 
  onAddToExhibition,
  onRemoveFromExhibition,
  isInExhibition,
  onExhibitionAction,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage 
}) => {
  if (!artworks?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No artworks to display. Try searching for something!</p>
      </div>
    );
  }

  const renderExhibitionButton = (artwork) => {
    const inExhibition = isInExhibition(artwork.id);
    
    if (inExhibition) {
      return (
        <button
          onClick={() => {
            onRemoveFromExhibition(artwork.id);
            if (onExhibitionAction) {
              onExhibitionAction(artwork, 'removed');
            }
          }}
          className="flex items-center gap-1 text-red-600 hover:text-red-700"
          aria-label="Remove from exhibition"
        >
          <Minus size={16} />
          <span className="text-sm font-medium">Remove</span>
        </button>
    );
  }
  
  return (
    <button
      onClick={() => {
        onAddToExhibition(artwork);
        if (onExhibitionAction) {
          onExhibitionAction(artwork, 'added');
        }
      }}
      className="flex items-center gap-1 text-green-600 hover:text-green-700"
      aria-label="Add to exhibition"
    >
      <Plus size={16} />
      <span className="text-sm font-medium">Add</span>
    </button>
  );
};

  // Pagination logic
  const pages = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="space-y-8">
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
                    e.target.src = '/api/placeholder/400/400';
                  }}
                />
              </div>
            </Link>

            <div className="p-4">
              <h3 className="text-lg font-semibold line-clamp-2">
                <Link 
                  to={`/artwork/${artwork.source}/${artwork.id}`}
                  state={{ artworkList: artworks, currentIndex: index }}
                  className="text-blue-600 hover:text-purple-600 transition-colors"
                >
                  {artwork.title}
                </Link>
              </h3>
              
              <p className="text-gray-600 mt-1 mb-2">
                {artwork.artist || 'Unknown Artist'}
              </p>
              
              <div className="mt-4 flex justify-between items-center">
                {renderExhibitionButton(artwork)}
                
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

      {totalPages > 1 && (
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft size={20} />
            </button>
            
            {startPage > 1 && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  className="px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  1
                </button>
                {startPage > 2 && (
                  <span className="px-2">...</span>
                )}
              </>
            )}
            
            {pages.map(page => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === page 
                    ? 'bg-purple-600 text-white' 
                    : 'hover:bg-gray-50'
                }`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            ))}
            
            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && (
                  <span className="px-2">...</span>
                )}
                <button
                  onClick={() => onPageChange(totalPages)}
                  className="px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  {totalPages}
                </button>
              </>
            )}
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div 
            className="text-sm text-gray-500"
            role="status"
            aria-live="polite"
          >
            Showing {Math.min(itemsPerPage * (currentPage - 1) + 1, totalItems)} to{' '}
            {Math.min(itemsPerPage * currentPage, totalItems)} of {totalItems} results
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtworkList;