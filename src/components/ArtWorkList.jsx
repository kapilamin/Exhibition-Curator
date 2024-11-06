import React, { useState } from 'react';
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
  const [showGoToPage, setShowGoToPage] = useState(false);
  const [pageInput, setPageInput] = useState('');

  if (!artworks?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No artworks to display. Try searching for something!</p>
      </div>
    );
  }

  const handleGoToPage = () => {
    const page = parseInt(pageInput);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
      setShowGoToPage(false);
      setPageInput('');
    }
  };

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
          <div className="overflow-x-auto max-w-full w-full flex justify-center">
            <div className="flex flex-wrap items-center justify-center gap-2 px-4">
              {/* Navigation Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={20} />
                </button>
                
                {/* Desktop Page Numbers */}
                <div className="hidden sm:flex items-center gap-2">
                  {startPage > 1 && (
                    <>
                      <button
                        onClick={() => onPageChange(1)}
                        className="px-4 py-2 rounded-lg hover:bg-gray-50"
                      >
                        1
                      </button>
                      {startPage > 2 && (
                        <button
                          onClick={() => setShowGoToPage(true)}
                          className="px-2 hover:text-gray-700"
                        >
                          ...
                        </button>
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
                        <button
                          onClick={() => setShowGoToPage(true)}
                          className="px-2 hover:text-gray-700"
                        >
                          ...
                        </button>
                      )}
                      <button
                        onClick={() => onPageChange(totalPages)}
                        className="px-4 py-2 rounded-lg hover:bg-gray-50"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                {/* Mobile Page Numbers */}
                <div className="flex sm:hidden items-center gap-2">
                  <button
                    onClick={() => onPageChange(1)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === 1 ? 'bg-purple-600 text-white' : 'hover:bg-gray-50'
                    }`}
                  >
                    1
                  </button>
                  {currentPage > 2 && (
                    <button
                      onClick={() => setShowGoToPage(true)}
                      className="hover:text-gray-700"
                    >
                      ...
                    </button>
                  )}
                  {currentPage > 1 && currentPage < totalPages && (
                    <button
                      className="px-3 py-1 rounded-lg bg-purple-600 text-white"
                    >
                      {currentPage}
                    </button>
                  )}
                  {currentPage < totalPages - 1 && (
                    <button
                      onClick={() => setShowGoToPage(true)}
                      className="hover:text-gray-700"
                    >
                      ...
                    </button>
                  )}
                  {totalPages > 1 && (
                    <button
                      onClick={() => onPageChange(totalPages)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === totalPages ? 'bg-purple-600 text-white' : 'hover:bg-gray-50'
                      }`}
                    >
                      {totalPages}
                    </button>
                  )}
                </div>

                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  aria-label="Next page"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Go to Page Popup */}
              {showGoToPage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
                    <h3 className="text-xl font-semibold text-black mb-6">Go to page</h3>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="flex-1 relative">
                        <input
                          type="number"
                          min="1"
                          max={totalPages}
                          value={pageInput}
                          onChange={(e) => setPageInput(e.target.value)}
                          className="w-full p-2 border-2 border-blue-600 rounded-lg text-black text-center text-lg"
                          aria-label="Enter page number"
                        />
                        <span className="text-black ml-2">of {totalPages}</span>
                      </div>
                    </div>
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => {
                          setShowGoToPage(false);
                          setPageInput('');
                        }}
                        className="px-6 py-2 text-black hover:bg-gray-100 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleGoToPage}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        disabled={!pageInput || isNaN(parseInt(pageInput)) || parseInt(pageInput) < 1 || parseInt(pageInput) > totalPages}
                      >
                        Go
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Results Counter */}
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
