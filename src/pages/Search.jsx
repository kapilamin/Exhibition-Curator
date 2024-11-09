import { useToast } from '../contexts/ToastContext';
import React, { useState, useEffect } from 'react';
import { useExhibition } from '../contexts/ExhibitionContext';
import SearchForm from '../components/SearchForm';
import SearchFilters from '../components/SearchFilters';
import ArtworkList from '../components/ArtworkList';
import { 
  searchArtworks as searchMetArtworks, 
  getArtworksByDepartment,
  loadMoreArtworks
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
  const [shouldRestoreSearch, setShouldRestoreSearch] = useState(true);
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
    sortBy: 'relevance',
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

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextIndex, setNextIndex] = useState(0);
  const [allMetIds, setAllMetIds] = useState([]);

  useEffect(() => {
    const restoreLastSearch = async () => {
      const lastSearchTerm = sessionStorage.getItem('lastSearchTerm');
      if (lastSearchTerm && shouldRestoreSearch) {
        setShouldRestoreSearch(false);
        await handleSearch(lastSearchTerm);
      }
    };
    restoreLastSearch();
  }, [shouldRestoreSearch]); // eslint-disable-line react-hooks/exhaustive-deps


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


  const calculateRelevanceScore = (artwork) => {
    if (!searchTerm) return 0;
    const searchTerms = searchTerm.toLowerCase().split(' ');
    let score = 0;
  
    if (artwork.title) {
      const titleLower = artwork.title.toLowerCase();
      searchTerms.forEach(term => {
        if (titleLower.includes(term)) {
          score += 10;
          if (titleLower === term) score += 5; 
        }
      });
    }
  
    if (artwork.artist) {
      const artistLower = artwork.artist.toLowerCase();
      searchTerms.forEach(term => {
        if (artistLower.includes(term)) score += 8;
      });
    }
  
    if (artwork.medium) {
      const mediumLower = artwork.medium.toLowerCase();
      searchTerms.forEach(term => {
        if (mediumLower.includes(term)) score += 6;
      });
    }
  
    if (artwork.date) {
      const dateLower = artwork.date.toLowerCase();
      searchTerms.forEach(term => {
        if (dateLower.includes(term)) score += 4;
      });
    }
  
    if (artwork.hasImage) score += 2;
  
    if (artwork.hasDetails) score += 1;
  
    return score;
  };
  

  const handleSearch = async (term) => {
    let isMounted = true;
    setSearchTerm(term);

    if (term.trim()) {
      sessionStorage.setItem('lastSearchTerm', term);
    } else {
      sessionStorage.removeItem('lastSearchTerm');
    }
    
    if (!term.trim()) {
      setHasSearched(false);
      setAllResults([]);
      setDisplayedResults([]);
      setTotalItems(0);
      setTotalPages(0);
      setCurrentPage(1);
      setHasMore(false);
      setNextIndex(0);
      setAllMetIds([]);
      return;
    }
  
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setCurrentPage(1);
  
    try {
      
      const [metResults, harvardResults] = await Promise.all([
        searchMetArtworks(term),
        searchHarvardArtworks(term)
      ]);
    
      const metArtworks = metResults?.items || [];
      const harvardArtworks = harvardResults?.items || [];  
      const combinedResults = [...metArtworks, ...harvardArtworks];
  
      setHasMore(metResults.hasMore);
      setNextIndex(metResults.nextIndex);
      setAllMetIds(metResults.allIds);
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

  const handleLoadMore = async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const moreResults = await loadMoreArtworks(allMetIds, nextIndex);
      
      if (moreResults.items.length) {
        const newResults = [...allResults, ...moreResults.items];
        setAllResults(newResults);
        setHasMore(moreResults.hasMore);
        setNextIndex(moreResults.nextIndex);
        applyFiltersAndPagination(newResults, currentPage);
      }
    } catch (error) {
      console.error('Failed to load more results:', error);
      setError('Failed to load more results. Please try again.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const LoadMoreButton = () => {
    if (!hasMore || !hasSearched) return null;

    return (
      <div className="mt-8 text-center">
        <button
          onClick={handleLoadMore}
          disabled={isLoadingMore}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {isLoadingMore ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Loading more...
            </span>
          ) : (
            'Load More Results'
          )}
        </button>
      </div>
    );
  };


  const applyFiltersAndPagination = (results, page) => {
  
    let filtered = [...results];
    let filterLog = {};
  
    if (filters.source !== 'all') {
      filtered = filtered.filter(artwork => artwork.source === filters.source);
    }
  
    if (filters.hasImage) {
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
      filterLog.details = {
        before: beforeCount,
        after: filtered.length,
        removed: beforeCount - filtered.length
      };
    }
  
    if (filters.medium !== 'all') {
      const beforeCount = filtered.length;
      const keywords = MEDIUM_KEYWORDS[filters.medium.toLowerCase()] || [];
      filtered = filtered.filter(artwork => {
        const mediumText = (artwork.medium || '').toLowerCase();
        const matches = keywords.some(keyword => mediumText.includes(keyword));
        return matches;
      });
      filterLog.medium = {
        before: beforeCount,
        after: filtered.length,
        removed: beforeCount - filtered.length
      };
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
      filterLog.period = {
        before: beforeCount,
        after: filtered.length,
        removed: beforeCount - filtered.length
      };
    }
    
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'relevance':
      return calculateRelevanceScore(b) - calculateRelevanceScore(a);
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


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Artworks</h1>
        <p className="text-xl text-gray-600">
          Discover masterpieces from the world's leading museums
        </p>
      </div>

      <SearchForm 
        onSearch={handleSearch} 
        isLoading={isLoading}
        initialSearchTerm={sessionStorage.getItem('lastSearchTerm') || ''} 
      />

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
              <LoadMoreButton />
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
        
              let filteredArtworks = [...categoryData.artworks];
        
              if (filters.medium !== 'all') {
                const keywords = MEDIUM_KEYWORDS[filters.medium.toLowerCase()] || [];
                filteredArtworks = filteredArtworks.filter(artwork => {
                  const mediumText = (artwork.medium || '').toLowerCase();
                  return keywords.some(keyword => mediumText.includes(keyword));
                });
              }
        
              if (filters.period !== 'all') {
                filteredArtworks = filteredArtworks.filter(artwork => {
                  const year = getYearFromDate(artwork.date);
                  if (year) {
                    switch (filters.period) {
                      case 'ancient': return year < 500;
                      case 'medieval': return year >= 500 && year < 1400;
                      case 'renaissance': return year >= 1400 && year < 1600;
                      case 'modern': return year >= 1600 && year < 1900;
                      case 'contemporary': return year >= 1900;
                      default: return true;
                    }
                  }
                  return false;
                });
              }
        
              filteredArtworks.sort((a, b) => {
                switch (filters.sortBy) {
                  case 'relevance':
                    return calculateRelevanceScore(b) - calculateRelevanceScore(a);
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
        
              if (!filteredArtworks.length) {
                return null;
              }
        
              return (
                <div key={category.id} className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                  <ArtworkList 
                    artworks={filteredArtworks}
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
  
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        )}
      </div>
    );
  };

  export default Search;
