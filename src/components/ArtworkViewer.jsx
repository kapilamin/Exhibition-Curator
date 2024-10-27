import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useExhibition } from '../contexts/ExhibitionContext';
import { 
  getArtworkDetails as getMetArtworkDetails 
} from '../api/metropolitanApi';
import { 
  getArtworkDetails as getHarvardArtworkDetails 
} from '../api/harvardApi';
import { ChevronLeft, ChevronRight, Plus, Minus, ExternalLink } from 'lucide-react';

const getImageUrl = (url, source) => {
  if (!url) return null;
  
  if (source === 'harvard') {
    if (url.includes('ids.lib.harvard.edu')) {
      const baseUrl = 'https://nrs.harvard.edu/urn-3:HUAM:';
      const imageId = url.split('/').pop().split('_')[0];
      return `${baseUrl}${imageId}`;
    }
    return url;
  }
  
  return url;
};

const ArtworkViewer = () => {
  const { source, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { exhibition, addToExhibition, removeFromExhibition } = useExhibition();
  
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [artworkList, setArtworkList] = useState([]);

  const isInExhibition = artwork 
    ? exhibition.some(item => item.id === artwork.id) 
    : false;

  useEffect(() => {
    const list = location.state?.artworkList || exhibition;
    setArtworkList(list);
    if (list.length > 0) {
      const index = list.findIndex(art => `${art.source}/${art.id}` === `${source}/${id}`);
      setCurrentIndex(index >= 0 ? index : 0);
    }
  }, [location.state, exhibition, source, id]);

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
            artist: artworkData.artistDisplayName || 'Unknown',
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
            artist: artworkData.people ? artworkData.people[0].name : 'Unknown',
            image: getImageUrl(artworkData.primaryimageurl, 'harvard'),
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

  const handleKeyPress = (event) => {
    if (event.key === 'ArrowLeft') {
      handlePrevious();
    } else if (event.key === 'ArrowRight') {
      handleNext();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentIndex, artworkList]); 

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8"
        >
          <ChevronLeft size={20} />
          Go Back
        </button>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">
            {error || 'Artwork not found'}
          </p>
          <button
            onClick={() => navigate('/search')}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Return to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" tabIndex="-1">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
        >
          <ChevronLeft size={20} />
          Back to {location.state?.from || 'Search'}
        </button>
        
        <div className="text-sm text-gray-500">
          {artworkList.length > 0 && (
            <span>Artwork {currentIndex + 1} of {artworkList.length}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {artwork.image ? (
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-artwork.jpg';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                No image available
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Previous artwork"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === artworkList.length - 1}
              className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Next artwork"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Rest of the detail content remains the same */}
        <div className="space-y-6">
          {/* ... existing detail content ... */}
        </div>
      </div>

      {/* Navigation hints */}
      <div className="mt-8 text-center text-sm text-gray-500">
        Use arrow keys ← → to navigate between artworks
      </div>
    </div>
  );
};

export default ArtworkViewer;