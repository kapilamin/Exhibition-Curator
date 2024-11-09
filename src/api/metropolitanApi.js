import axios from 'axios';

const API_BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';
const PAGE_SIZE = 40;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000
});

const fetchWithRetry = async (objectId) => {
  try {
    const response = await api.get(`/objects/${objectId}`);
    return response.data;
  } catch {
    return null;
  }
};

export const searchArtworks = async (query) => {
  try {
    
    const searchResponse = await api.get('/search', {
      params: {
        q: query,
        hasImages: true
      }
    });

    const allObjectIds = searchResponse.data.objectIDs || [];
    const initialTotal = allObjectIds.length;

    if (!allObjectIds.length) {
      return {
        items: [],
        total: 0,
        initialTotal: 0,
        hasMore: false,
        allIds: []
      };
    }

    // Get initial batch of IDs
    const initialIds = allObjectIds.slice(0, PAGE_SIZE);
    
    // Fetch initial batch
    const results = await Promise.all(
      initialIds.map(id => fetchWithRetry(id))
    );

    const formattedResults = results
      .filter(Boolean)
      .map(artwork => ({
        id: artwork.objectID?.toString(),
        title: artwork.title || 'Untitled',
        artist: artwork.artistDisplayName || 'Unknown Artist',
        image: artwork.primaryImageSmall || artwork.primaryImage || '',
        source: 'met',
        date: artwork.objectDate || '',
        medium: artwork.medium || '',
        dimensions: artwork.dimensions || '',
        link: artwork.objectURL || '',
        hasImage: Boolean(artwork.primaryImageSmall || artwork.primaryImage)
      }));

    return {
      items: formattedResults,
      total: formattedResults.length,
      initialTotal,
      hasMore: PAGE_SIZE < allObjectIds.length,
      nextIndex: PAGE_SIZE,
      allIds: allObjectIds
    };

  } catch (error) {
    console.error('Met API Error:', error);
    return { 
      items: [], 
      total: 0, 
      initialTotal: 0,
      hasMore: false,
      allIds: []
    };
  }
};

// Add this new function to load more results
export const loadMoreArtworks = async (allIds, startIndex) => {
  try {
    const batchIds = allIds.slice(startIndex, startIndex + PAGE_SIZE);
    
    const results = await Promise.all(
      batchIds.map(id => fetchWithRetry(id))
    );

    const formattedResults = results
      .filter(Boolean)
      .map(artwork => ({
        id: artwork.objectID?.toString(),
        title: artwork.title || 'Untitled',
        artist: artwork.artistDisplayName || 'Unknown Artist',
        image: artwork.primaryImageSmall || artwork.primaryImage || '',
        source: 'met',
        date: artwork.objectDate || '',
        medium: artwork.medium || '',
        dimensions: artwork.dimensions || '',
        link: artwork.objectURL || '',
        hasImage: Boolean(artwork.primaryImageSmall || artwork.primaryImage)
      }));

    return {
      items: formattedResults,
      hasMore: startIndex + PAGE_SIZE < allIds.length,
      nextIndex: startIndex + PAGE_SIZE
    };
  } catch (error) {
    console.error('Error loading more artworks:', error);
    return { items: [], hasMore: false, nextIndex: startIndex };
  }
};

export const getArtworksByDepartment = async (departmentId, limit = 8) => {
  try {
    
    const searchResponse = await api.get('/search', {
      params: {
        departmentId,
        q: "*",
        hasImages: true
      }
    });

    const allObjectIds = searchResponse.data.objectIDs || [];
    const selectedIds = allObjectIds.slice(0, limit * 2);
    
    const results = await Promise.all(
      selectedIds.map(id => fetchWithRetry(id))
    );

    return results
      .filter(artwork => artwork?.primaryImageSmall)
      .slice(0, limit);

  } catch (error) {
    console.error('Error fetching Met department artworks:', error);
    return [];
  }
};

export const getArtworkDetails = async (objectId) => {
  return fetchWithRetry(objectId);
};
