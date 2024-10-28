import React, { useState, useEffect } from 'react';
import { useExhibition } from '../contexts/ExhibitionContext';
import SearchForm from '../components/SearchForm';
import SearchFilters from '../components/SearchFilters';
import ArtworkList from '../components/ArtworkList';
import { 
  searchArtworks as searchMetArtworks, 
  getArtworksByDepartment,
  getArtworkDetails as getMetArtworkDetails 
} from '../api/metropolitanApi';
import { 
  searchArtworks as searchHarvardArtworks, 
  getArtworksByClassification 
} from '../api/harvardApi';
import { Filter } from 'lucide-react';

const FEATURED_CATEGORIES = [
  {
    id: 'european-paintings',
    title: 'European Paintings',
    source: 'met',
    departmentId: 11,
    limit: 8
  },
  {
    id: 'asian-art',
    title: 'Asian Art',
    source: 'harvard',
    classification: 'Asian Art',
    limit: 8
  }
];

const getYearFromDate = (dateStr) => {
  if (!dateStr) return null;
  const match = dateStr.match(/\d{4}/);
  return match ? parseInt(match[0]) : null;
};

// Medium keywords mapping for improved filtering
const MEDIUM_KEYWORDS = {
  'painting': ['oil', 'acrylic', 'tempera', 'panel', 'canvas', 'painting'],
  'sculpture': ['sculpture', 'bronze', 'marble', 'stone', 'wood', 'ceramic', 'terracotta', 'plaster'],
  'photography': ['photograph', 'gelatin', 'silver', 'print', 'daguerreotype'],
  'prints': ['print', 'etching', 'engraving', 'lithograph', 'woodcut'],
  'drawings': ['drawing', 'graphite', 'charcoal', 'chalk', 'pencil', 'ink', 'watercolor', 'pastel'],
  'decorative': ['furniture', 'textile', 'ceramic', 'glass', 'metal', 'jewelry', 'decorative']
};

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [featuredArtworks, setFeaturedArtworks] = useState({});

  const [filters, setFilters] = useState({
    source: 'all',
    sortBy: 'title',
    period: 'all',
    medium: 'all',
    hasImage: true,
    hasDetails: false
  });

  const { addToExhibition } = useExhibition();

  // Fetch featured artworks on component mount
  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedArtworks = async () => {
      if (!isMounted) return;
      setIsLoading(true);
      setError(null);
      
      try {
        const categoryResults = await Promise.all(
          FEATURED_CATEGORIES.map(async (category) => {
            try {
              if (!isMounted) return null;
              
              if (category.source === 'met') {
                const ids = await getArtworksByDepartment(category.departmentId, category.limit);
                if (!isMounted) return null;
                
                const artworksPromises = ids.map(id => getMetArtworkDetails(id));
                const details = await Promise.all(artworksPromises);
                if (!isMounted) return null;

                return {
                  ...category,
                  artworks: details.map(artwork => ({
                    id: artwork.objectID.toString(),
                    title: artwork.title,
                    artist: artwork.artistDisplayName || 'Unknown',
                    image: artwork.primaryImageSmall,
                    source: 'met',
                    date: artwork.objectDate,
                    medium: artwork.medium,
                    dimensions: artwork.dimensions,
                    link: artwork.objectURL
                  })).filter(art => art.image)
                };
              } else {
                const artworks = await getArtworksByClassification(category.classification, category.limit);
                if (!isMounted) return null;

                return {
                  ...category,
                  artworks: artworks.map(artwork => ({
                    id: artwork.id.toString(),
                    title: artwork.title,
                    artist: artwork.people ? artwork.people[0].name : 'Unknown',
                    image: artwork.primaryimageurl,
                    source: 'harvard',
                    date: artwork.dated,
                    medium: artwork.classification,
                    dimensions: artwork.dimensions,
                    link: `https://harvardartmuseums.org/collections/object/${artwork.id}`
                  })).filter(art => art.image)
                };
              }
            } catch (error) {
              console.error(`Error fetching ${category.title}:`, error);
              return { ...category, artworks: [], error: true };
            }
          })
        );

        if (!isMounted) return;

        const artworksMap = categoryResults.reduce((acc, category) => {
          if (category) {
            acc[category.id] = category;
          }
          return acc;
        }, {});

        if (isMounted) {
          setFeaturedArtworks(artworksMap);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching featured artworks:', error);
          setError('Failed to load featured artworks. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchFeaturedArtworks();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle search
  const handleSearch = async (searchTerm) => {
    let isMounted = true;
    setSearchTerm(searchTerm);
    
    if (!searchTerm.trim()) {
      setHasSearched(false);
      setResults([]);
      setFilteredResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const [metResults, harvardResults] = await Promise.all([
        searchMetArtworks(searchTerm),
        searchHarvardArtworks(searchTerm, 10)
      ]);

      if (!isMounted) return;

      const metArtworksPromises = (metResults || [])
        .slice(0, 10)
        .map(id => getMetArtworkDetails(id));
      
      const metArtworks = await Promise.all(metArtworksPromises);
      
      if (!isMounted) return;

      const combinedResults = [
        ...metArtworks.map(artwork => ({
          id: artwork.objectID.toString(),
          title: artwork.title,
          artist: artwork.artistDisplayName || 'Unknown',
          image: artwork.primaryImageSmall,
          source: 'met',
          date: artwork.objectDate,
          medium: artwork.medium,
          dimensions: artwork.dimensions,
          link: artwork.objectURL
        })),
        ...(harvardResults || []).map(artwork => ({
          id: artwork.id.toString(),
          title: artwork.title,
          artist: artwork.people ? artwork.people[0].name : 'Unknown',
          image: artwork.primaryimageurl,
          source: 'harvard',
          date: artwork.dated,
          medium: artwork.classification,
          dimensions: artwork.dimensions,
          link: `https://harvardartmuseums.org/collections/object/${artwork.id}`
        }))
      ].filter(artwork => artwork.image || !filters.hasImage);

      if (isMounted) {
        setResults(combinedResults);
      }
    } catch (error) {
      if (isMounted) {
        console.error('Search failed:', error);
        setError('An error occurred while searching. Please try again.');
        setResults([]);
        setFilteredResults([]);
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  // Apply filters and sorting
  useEffect(() => {
    let isMounted = true;

    const applyFilters = () => {
      let filtered = [];
      
      // Get initial set of artworks
      if (hasSearched) {
        filtered = [...results];
      } else {
        filtered = Object.values(featuredArtworks).reduce((acc, category) => {
          return [...acc, ...(category.artworks || [])];
        }, []);
      }

      // Apply source filter first
      if (filters.source !== 'all') {
        filtered = filtered.filter(artwork => artwork.source === filters.source);
      }

      // Apply remaining filters
      filtered = filtered.filter(artwork => {
        // Medium filter with improved matching
        if (filters.medium !== 'all') {
          const normalizedMedium = artwork.medium?.toLowerCase() || '';
          const selectedMedium = filters.medium.toLowerCase();
          
          // Get keywords for the selected medium
          const keywords = MEDIUM_KEYWORDS[selectedMedium] || [];
          
          // Check if the artwork medium contains any of the relevant keywords
          if (!keywords.some(keyword => normalizedMedium.includes(keyword))) {
            return false;
          }
        }

        // Other filters
        if (filters.hasImage && !artwork.image) return false;
        if (filters.hasDetails && (!artwork.medium || !artwork.dimensions)) return false;

        // Period filter
        if (filters.period !== 'all') {
          const year = getYearFromDate(artwork.date);
          if (!year) return false;
          
          switch (filters.period) {
            case 'ancient': return year < 500;
            case 'medieval': return year >= 500 && year < 1400;
            case 'renaissance': return year >= 1400 && year < 1600;
            case 'modern': return year >= 1600 && year < 1900;
            case 'contemporary': return year >= 1900;
            default: return true;
          }
        }
        
        return true;
      });

      // Apply sorting
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'title':
            return a.title.localeCompare(b.title);
          case 'artist':
            return (a.artist || 'Unknown').localeCompare(b.artist || 'Unknown');
          case 'dateAsc':
          case 'dateDesc': {
            const yearA = getYearFromDate(a.date) || 0;
            const yearB = getYearFromDate(b.date) || 0;
            return filters.sortBy === 'dateAsc' ? yearA - yearB : yearB - yearA;
          }
          default:
            return 0;
        }
      });

      if (isMounted) {
        setFilteredResults(filtered);
      }
    };

    applyFilters();

    return () => {
      isMounted = false;
    };
  }, [results, featuredArtworks, filters, hasSearched]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Artworks</h1>
        <p className="text-xl text-gray-600">
          Discover masterpieces from the world's leading museums
        </p>
      </div>

      {/* Search Form */}
      <SearchForm onSearch={handleSearch} isLoading={isLoading} />

      {/* Error Message */}
      {error && (
        <div className="mb-8 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {!isLoading && (
        <>
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              {hasSearched ? (
                `Found ${filteredResults.length} artwork${filteredResults.length !== 1 ? 's' : ''}
                 ${searchTerm ? ` for "${searchTerm}"` : ''}`
              ) : (
                'Featured Collections'
              )}
            </p>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Filter size={20} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {showFilters && <SearchFilters filters={filters} setFilters={setFilters} />}

          {hasSearched ? (
            <ArtworkList 
              artworks={filteredResults} 
              onAddToExhibition={addToExhibition}
            />
          ) : (
            <div className="space-y-12">
              {FEATURED_CATEGORIES.map(category => {
                const categoryArtworks = filteredResults.filter(
                  artwork => artwork.source === category.source
                );

                return categoryArtworks.length > 0 ? (
                  <div key={category.id}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.title}</h2>
                    <ArtworkList 
                      artworks={categoryArtworks}
                      onAddToExhibition={addToExhibition}
                    />
                  </div>
                ) : null;
              })}
            </div>
          )}
        </>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default Search;
