import { useToast } from '../contexts/ToastContext';
import React, { useState, useEffect } from 'react';
import { useExhibition } from '../contexts/ExhibitionContext';
import SearchForm from '../components/SearchForm';
import SearchFilters from '../components/SearchFilters';
import ArtworkList from '../components/ArtworkList';
import { 
  searchArtworks as searchMetArtworks, 
  getArtworksByDepartment,
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

const MEDIUM_KEYWORDS = {
  'painting': ['oil', 'acrylic', 'tempera', 'panel', 'canvas', 'painting'],
  'sculpture': ['sculpture', 'bronze', 'marble', 'stone', 'wood', 'ceramic', 'terracotta', 'plaster'],
  'photography': ['photograph', 'gelatin', 'silver', 'print', 'daguerreotype'],
  'prints': ['print', 'etching', 'engraving', 'lithograph', 'woodcut', 'drawing', 'graphite', 'charcoal', 'chalk', 'pencil', 'ink', 'watercolor', 'pastel'],
  'decorative': ['furniture', 'textile', 'ceramic', 'glass', 'metal', 'jewelry', 'decorative']
};

const getYearFromDate = (dateStr) => {
  if (!dateStr) return null;
  const matches = dateStr.match(/\d{4}/g);
  if (!matches) return null;
  return parseInt(matches[matches.length - 1]);
};

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allResults, setAllResults] = useState([]);
  const [displayedResults, setDisplayedResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [featuredArtworks, setFeaturedArtworks] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 18;

  const [filters, setFilters] = useState({
    source: 'all',
    sortBy: 'title',
    period: 'all',
    medium: 'all',
    hasImage: true,
    hasDetails: false
  });

  const { exhibition, addToExhibition, removeFromExhibition } = useExhibition();
  const { showToast } = useToast();

  const isInExhibition = (artworkId) => {
    return exhibition.some(item => item.id === artworkId);
  };


  const handleSearch = async (term) => {
    let isMounted = true;
    setSearchTerm(term);
    
    if (!term.trim()) {
      setHasSearched(false);
      setAllResults([]);
      setDisplayedResults([]);
      setTotalItems(0);
      setTotalPages(0);
      setCurrentPage(1);
      return;
    }
  
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setCurrentPage(1);
  
    try {
      const [metResults, harvardResults] = await Promise.all([
        searchMetArtworks(term, currentPage, itemsPerPage),
        searchHarvardArtworks(term)
      ]);
  
      const metArtworks = metResults?.items || [];
      const harvardArtworks = harvardResults?.items || [];
  
      const combinedResults = [...metArtworks, ...harvardArtworks];
  
      const totalMetItems = metResults.total || 0;
      const totalHarvardItems = harvardResults.total || 0;
      
      setTotalItems(totalMetItems + totalHarvardItems);
      setTotalPages(Math.ceil((totalMetItems + totalHarvardItems) / itemsPerPage));
      setAllResults(combinedResults);
      applyFiltersAndPagination(combinedResults, 1);
  
    } catch (error) {
      console.error('Search failed:', error);
      setError('An error occurred while searching. Please try again.');
      setAllResults([]);
      setDisplayedResults([]);
    } finally {
      if (isMounted) {
      setIsLoading(false);
      }
    }
  };


  const applyFiltersAndPagination = (results, page) => {

    let filtered = [...results];
  
    if (filters.source !== 'all') {
      const beforeCount = filtered.length;
      filtered = filtered.filter(artwork => artwork.source === filters.source);
    }
  
    if (filters.hasImage) {
      const beforeCount = filtered.length;
      filtered = filtered.filter(artwork => {
        const hasValidImage = Boolean(artwork.image);
        return hasValidImage;
      });
    }
  
    if (filters.hasDetails) {
      const beforeCount = filtered.length;
      filtered = filtered.filter(artwork => {
        const hasValidDetails = Boolean(
          (artwork.medium && artwork.medium.trim()) || 
          (artwork.classification && artwork.classification.trim())
        ) && Boolean(artwork.dimensions && artwork.dimensions.trim());
        return hasValidDetails;
      });
    }
  
    if (filters.medium !== 'all') {
      const beforeCount = filtered.length;
      const keywords = MEDIUM_KEYWORDS[filters.medium.toLowerCase()] || [];
      filtered = filtered.filter(artwork => {
        const mediumText = (artwork.medium || '').toLowerCase();
        const matches = keywords.some(keyword => mediumText.includes(keyword));
        return matches;
      });
    }
  
    if (filters.period !== 'all') {
      const beforeCount = filtered.length;
      filtered = filtered.filter(artwork => {
        const year = getYearFromDate(artwork.date);
        let matches = false;
        
        if (year) {
          switch (filters.period) {
            case 'ancient': matches = year < 500; break;
            case 'medieval': matches = year >= 500 && year < 1400; break;
            case 'renaissance': matches = year >= 1400 && year < 1600; break;
            case 'modern': matches = year >= 1600 && year < 1900; break;
            case 'contemporary': matches = year >= 1900; break;
            default: matches = true;
          }
        }
        
        return matches;
      });
    }
    
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
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
  
    const total = filtered.length;
    const totalPagesCount = Math.ceil(total / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    setTotalItems(total);
    setTotalPages(totalPagesCount);
    setDisplayedResults(filtered.slice(startIndex, endIndex));
  };
  

  const handleExhibitionAction = (artwork, action) => {
    showToast(
      `${artwork.title} has been ${action} ${action === 'added' ? 'to' : 'from'} your exhibition`,
      action === 'added' ? 'success' : 'error'
    );
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    applyFiltersAndPagination(allResults, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchFeaturedArtworks = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const categoriesMap = {};
        
        await Promise.all(FEATURED_CATEGORIES.map(async (category) => {
          const artworks = category.source === 'met'
            ? await getArtworksByDepartment(category.departmentId, category.limit)
            : await getArtworksByClassification(category.classification, category.limit);

          if (artworks.length > 0) {
            categoriesMap[category.id] = {
              ...category,
              artworks: artworks
                .filter(artwork => artwork?.primaryImageSmall || artwork?.primaryimageurl)
                .map(artwork => ({
                  id: (artwork.objectID || artwork.id)?.toString() || '',
                  title: artwork.title || 'Untitled',
                  artist: artwork.artistDisplayName || artwork.people?.[0]?.name || 'Unknown Artist',
                  image: artwork.primaryImageSmall || artwork.primaryimageurl || '',
                  source: category.source,
                  date: artwork.objectDate || artwork.dated || '',
                  medium: artwork.medium || artwork.technique || artwork.classification || '',
                  dimensions: artwork.dimensions || '',
                  link: category.source === 'met' 
                    ? artwork.objectURL 
                    : `https://harvardartmuseums.org/collections/object/${artwork.id}`,
                  hasImage: true,
                  hasDetails: Boolean(artwork.medium || artwork.technique) && Boolean(artwork.dimensions)
                }))
            };
          }
        }));

        setFeaturedArtworks(categoriesMap);
      } catch (error) {
        console.error('Error fetching featured artworks:', error);
        setError('Failed to load featured artworks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedArtworks();
  }, []);

  useEffect(() => {
    if (hasSearched) {
      applyFiltersAndPagination(allResults, currentPage);
    } else if (Object.keys(featuredArtworks).length > 0) {
      const featuredResults = Object.values(featuredArtworks).reduce((acc, category) => {
        return category?.artworks ? [...acc, ...category.artworks] : acc;
      }, []);
      applyFiltersAndPagination(featuredResults, currentPage);
    }
  }, [filters, hasSearched, allResults, featuredArtworks, currentPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Artworks</h1>
        <p className="text-xl text-gray-600">
          Discover masterpieces from the world's leading museums
        </p>
      </div>

      <SearchForm onSearch={handleSearch} isLoading={isLoading} />

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

      {!isLoading && (
        <>
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              {hasSearched ? (
                `Found ${totalItems} artwork${totalItems !== 1 ? 's' : ''}
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

          {showFilters && (
            <SearchFilters 
              filters={filters} 
              setFilters={setFilters}
            />
          )}

          {hasSearched ? (
            <>
              <ArtworkList 
                artworks={displayedResults}
                onAddToExhibition={addToExhibition}
                onRemoveFromExhibition={removeFromExhibition}
                isInExhibition={isInExhibition}
                onExhibitionAction={handleExhibitionAction}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
              />
            </>
          ) : (
            <div className="space-y-12">
              {FEATURED_CATEGORIES.map(category => {
                if (filters.source !== 'all' && category.source !== filters.source) {
                  return null;
                }
                const categoryData = featuredArtworks[category.id];
                
                if (!categoryData?.artworks?.length) {
                  return null;
                }

                return (
                  <div key={category.id} className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                    <ArtworkList 
                      artworks={categoryData.artworks}
                      onAddToExhibition={addToExhibition}
                      onRemoveFromExhibition={removeFromExhibition}
                      isInExhibition={isInExhibition}
                      onExhibitionAction={handleExhibitionAction}
                    />
                  </div>
                );
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