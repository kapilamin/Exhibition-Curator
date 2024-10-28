import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExhibition } from '../contexts/ExhibitionContext';
import { ChevronLeft, ChevronRight, Plus, Minus, ExternalLink } from 'lucide-react';

const ArtworkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    exhibition,
    searchResults,
    addToExhibition,
    removeFromExhibition,
    getNextArtwork,
    getPreviousArtwork
  } = useExhibition();

  const artwork = [...exhibition, ...searchResults].find(art => art.id === id);
  const isInExhibition = exhibition.some(art => art.id === id);

  if (!artwork) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Artwork Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handlePrevious = () => {
    const prevArtwork = getPreviousArtwork(id);
    if (prevArtwork) {
      navigate(`/artwork/${prevArtwork.id}`);
    }
  };

  const handleNext = () => {
    const nextArtwork = getNextArtwork(id);
    if (nextArtwork) {
      navigate(`/artwork/${nextArtwork.id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="relative">
          <img
            src={artwork.image || '/placeholder-artwork.jpg'}
            alt={artwork.title}
            className="w-full h-auto rounded-lg shadow-lg"
          />
          
          {/* Navigation Buttons */}
          <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4">
            <button
              onClick={handlePrevious}
              className="p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors duration-200"
              disabled={!getPreviousArtwork(id)}
              aria-label="Previous artwork"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors duration-200"
              disabled={!getNextArtwork(id)}
              aria-label="Next artwork"
            >
              <ChevronRight size={24} className="text-white" />
            </button>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{artwork.title}</h1>
            <p className="text-xl text-gray-600">{artwork.artist || 'Unknown Artist'}</p>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Details</h2>
              <dl className="mt-2 space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date</dt>
                  <dd className="text-sm text-gray-900">{artwork.date}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Medium</dt>
                  <dd className="text-sm text-gray-900">{artwork.medium}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Dimensions</dt>
                  <dd className="text-sm text-gray-900">{artwork.dimensions}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Culture</dt>
                  <dd className="text-sm text-gray-900">{artwork.culture || 'Not specified'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="text-sm text-gray-900">{artwork.location}</dd>
                </div>
              </dl>
            </div>

            <div className="flex space-x-4">
              {isInExhibition ? (
                <button
                  onClick={() => removeFromExhibition(artwork.id)}
                  className="flex items-center px-4 py-2 border border-red-600 text-red-600
                           rounded-lg hover:bg-red-50 transition-colors duration-200"
                >
                  <Minus size={20} className="mr-2" />
                  Remove from Exhibition
                </button>
              ) : (
                <button
                  onClick={() => addToExhibition(artwork)}
                  className="flex items-center px-4 py-2 border border-green-600 text-green-600
                           rounded-lg hover:bg-green-50 transition-colors duration-200"
                >
                  <Plus size={20} className="mr-2" />
                  Add to Exhibition
                </button>
              )}

              <a
                href={artwork.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 border border-blue-600 text-blue-600
                         rounded-lg hover:bg-blue-50 transition-colors duration-200"
              >
                <ExternalLink size={20} className="mr-2" />
                View on Museum Site
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;

