import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useExhibition } from '../contexts/ExhibitionContext';
import { useToast } from '../contexts/ToastContext';
import { 
  getArtworkDetails as getMetArtworkDetails 
} from '../api/metropolitanApi';
import { 
  getArtworkDetails as getHarvardArtworkDetails 
} from '../api/harvardApi';
import { ChevronLeft, ChevronRight, Plus, Minus, ExternalLink } from 'lucide-react';

const ArtworkViewer = () => {
  const { source, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { exhibition, addToExhibition, removeFromExhibition } = useExhibition();
  const { showToast } = useToast();
  
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [artworkList, setArtworkList] = useState([]);
  

  const isInExhibition = artwork 
    ? exhibition.some(item => item.id === artwork.id) 
    : false;

  useEffect(() => {
    setIsImageLoading(true);
  }, [artwork?.image]); 

  useEffect(() => {
    const list = location.state?.artworkList || exhibition;
    setArtworkList(list);
    if (list.length > 0) {
      const index = list.findIndex(art => `${art.source}/${art.id}` === `${source}/${id}`);
      setCurrentIndex(index >= 0 ? index : 0);
    }
  }, [location.state, exhibition, source, id]);

  useEffect(() => {
    if (!loading && artwork) {
      const announcement = `Now viewing ${artwork.title} by ${artwork.artist || 'Unknown Artist'}`;
      document.getElementById('artwork-announcement').textContent = announcement;
    }
  }, [artwork, loading]);

  useEffect(() => {
    const fetchArtworkDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        let artworkData;
        const numericId = !isNaN(id) ? parseInt(id) : id;

        if (source === 'met') {
          artworkData = await getMetArtworkDetails(numericId);
          setArtwork({
            id: artworkData.objectID.toString(),
            title: artworkData.title,
            artist: artworkData.artistDisplayName || 'Unknown Artist',
            image: artworkData.primaryImage,
            source: 'met',
            date: artworkData.objectDate,
            medium: artworkData.medium,
            dimensions: artworkData.dimensions,
            department: artworkData.department,
            culture: artworkData.culture,
            period: artworkData.period,
            location: 'The Metropolitan Museum of Art',
            creditLine: artworkData.creditLine,
            link: artworkData.objectURL,
            description: artworkData.description,
            galleryNumber: artworkData.GalleryNumber,
            accessionNumber: artworkData.accessionNumber,
            classification: artworkData.classification
          });
        } else if (source === 'harvard') {
          artworkData = await getHarvardArtworkDetails(numericId);
          setArtwork({
            id: artworkData.id.toString(),
            title: artworkData.title,
            artist: artworkData.people ? artworkData.people[0].name : 'Unknown Artist',
            image: artworkData.primaryimageurl,
            source: 'harvard',
            date: artworkData.dated,
            medium: artworkData.technique,
            dimensions: artworkData.dimensions,
            department: artworkData.division,
            culture: artworkData.culture,
            period: artworkData.period,
            location: 'Harvard Art Museums',
            creditLine: artworkData.creditline,
            link: `https://harvardartmuseums.org/collections/object/${artworkData.id}`,
            description: artworkData.description,
            classification: artworkData.classification,
            accessionNumber: artworkData.accessionNumber
          });
        }
      } catch (error) {
        console.error('Error fetching artwork:', error);
        setError('Failed to load artwork details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtworkDetails();
  }, [source, id]);

  const handleExhibitionAction = (action) => {
    const message = action === 'added' 
      ? `${artwork.title} has been added to your exhibition`
      : `${artwork.title} has been removed from your exhibition`;
    
    showToast(message, action === 'added' ? 'success' : 'error');
  };

  const navigateToArtwork = (index) => {
    if (index >= 0 && index < artworkList.length) {
      const nextArtwork = artworkList[index];
      navigate(`/artwork/${nextArtwork.source}/${nextArtwork.id}`, {
        state: { artworkList }
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      navigateToArtwork(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < artworkList.length - 1) {
      navigateToArtwork(currentIndex + 1);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowLeft') {
        handlePrevious();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentIndex, artworkList]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div 
        className="flex items-center justify-center min-h-[50vh]"
        role="alert"
        aria-busy="true"
      >
        <div className="sr-only">Loading artwork details</div>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div 
        className="max-w-7xl mx-auto px-4 py-8"
        role="alert"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg p-2"
          aria-label="Return to previous page"
        >
          <ChevronLeft size={20} aria-hidden="true" />
          <span>Go Back</span>
        </button>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">
            {error || 'Artwork not found'}
          </p>
          <button
            onClick={() => navigate('/search')}
            className="text-purple-600 hover:text-purple-700 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg p-2"
          >
            Return to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <main 
      className="max-w-7xl mx-auto px-4 py-8"
      id="main-content"
      tabIndex="-1"
    >
      <div 
        id="artwork-announcement" 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      ></div>

      <nav className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg p-2"
          aria-label="Return to previous page"
        >
          <ChevronLeft size={20} aria-hidden="true" />
          <span>Back to {location.state?.from || 'Search'}</span>
        </button>
        
        <div 
          className="text-sm text-gray-500"
          aria-live="polite"
        >
          {artworkList.length > 0 && (
            <span>Artwork {currentIndex + 1} of {artworkList.length}</span>
          )}
        </div>
      </nav>

      <article 
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        aria-labelledby="artwork-title"
      >
        <div className="relative">
          <figure className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
            {/* Show loading state until image is loaded */}
            <div 
              className={`absolute inset-0 flex items-center justify-center bg-gray-100 z-10 transition-opacity duration-300 ${
                isImageLoading ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="mt-4 text-gray-500">Loading artwork...</span>
              </div>
            </div>

            {artwork.image && (
              <img
                key={artwork.image}
                src={artwork.image}
                alt={`Artwork: ${artwork.title}`}
                className={`w-full h-full object-contain transition-opacity duration-300 ${
                  isImageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => {
                  setIsImageLoading(false);
                }}
                onError={(e) => {
                  setIsImageLoading(false);
                  e.target.onerror = null;
                  e.target.src = '/placeholder-artwork.jpg';
                  e.target.alt = 'Artwork image not available';
                }}
              />
            )}
          </figure>

          {/* Navigation Controls */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4"
            role="navigation"
            aria-label="Artwork navigation"
          >
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="View previous artwork"
            >
              <ChevronLeft size={24} aria-hidden="true" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === artworkList.length - 1}
              className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="View next artwork"
            >
              <ChevronRight size={24} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <header>
            <h1 
              id="artwork-title"
              className="text-3xl font-bold text-white mb-2"
            >
              {artwork.title}
            </h1>
            <p className="text-xl text-gray-400">
              By {artwork.artist}
            </p>
          </header>

          <dl className="grid grid-cols-2 gap-4">
            {artwork.date && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Date Created</dt>
                <dd className="mt-1">{artwork.date}</dd>
              </div>
            )}
            {artwork.medium && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Medium</dt>
                <dd className="mt-1">{artwork.medium}</dd>
              </div>
            )}
            {artwork.dimensions && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Dimensions</dt>
                <dd className="mt-1">{artwork.dimensions}</dd>
              </div>
            )}
            {artwork.department && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Department</dt>
                <dd className="mt-1">{artwork.department}</dd>
              </div>
            )}
            {artwork.culture && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Culture</dt>
                <dd className="mt-1">{artwork.culture}</dd>
              </div>
            )}
            {artwork.classification && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Classification</dt>
                <dd className="mt-1">{artwork.classification}</dd>
              </div>
            )}
            {artwork.accessionNumber && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Accession Number</dt>
                <dd className="mt-1">{artwork.accessionNumber}</dd>
              </div>
            )}
          </dl>

          {artwork.description && (
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-2">Description</dt>
              <dd className="prose prose-sm max-w-none">{artwork.description}</dd>
            </div>
          )}

          {artwork.creditLine && (
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-2">Credit</dt>
              <dd className="text-sm text-gray-600">{artwork.creditLine}</dd>
            </div>
          )}

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => {
                if (isInExhibition) {
                  removeFromExhibition(artwork.id);
                  handleExhibitionAction('removed');
                } else {
                  addToExhibition(artwork);
                  handleExhibitionAction('added');
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isInExhibition 
                  ? 'border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500' 
                  : 'border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500'
              }`}
              aria-label={isInExhibition ? 'Remove from exhibition' : 'Add to exhibition'}
            >
              {isInExhibition ? (
                <>
                  <Minus size={20} aria-hidden="true" />
                  <span>Remove from Exhibition</span>
                </>
              ) : (
                <>
                  <Plus size={20} aria-hidden="true" />
                  <span>Add to Exhibition</span>
                  </>
              )}
            </button>

            <a
              href={artwork.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              aria-label={`View ${artwork.title} on museum website (opens in new tab)`}
            >
              <ExternalLink size={20} aria-hidden="true" />
              <span>View on Museum Site</span>
            </a>
          </div>
        </div>
      </article>

      <div className="mt-8 border-t border-gray-200 pt-8">
        <p className="text-sm text-gray-500">
          This artwork is located at {artwork.location}
          {artwork.galleryNumber && ` in Gallery ${artwork.galleryNumber}`}.
        </p>
      </div>

      {/* Keyboard Navigation Instructions */}
      <div 
        className="mt-4 text-center text-sm text-gray-500"
        role="note"
        aria-label="Keyboard navigation instructions"
      >
        Use left and right arrow keys to navigate between artworks
      </div>
    </main>
  );
};

export default ArtworkViewer;