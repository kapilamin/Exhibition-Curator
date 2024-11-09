import axios from 'axios';

const API_BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';
const BATCH_SIZE = 10; // Process 10 artworks at a time

const fetchWithRetry = async (objectId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/objects/${objectId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch Met artwork ${objectId}:`, error);
    return null;
  }
};

export const searchArtworks = async (query, page = 1, limit = 18) => {
  try {    
    const searchResponse = await axios.get(`${API_BASE_URL}/search`, {
      params: {
        q: query,
        hasImages: true
      }
    });

    const allObjectIds = searchResponse.data.objectIDs || [];

    if (!allObjectIds.length) {
      return {
        items: [],
        total: allObjectIds.length,
        page,
        totalPages: 0
      };
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const pageObjectIds = allObjectIds.slice(startIndex, endIndex);

    const results = [];
    for (let i = 0; i < pageObjectIds.length; i += BATCH_SIZE) {
      const batch = pageObjectIds.slice(i, i + BATCH_SIZE);
      
      const batchResults = await Promise.all(
        batch.map(id => fetchWithRetry(id))
      );

      results.push(...batchResults.filter(Boolean));

      // Small delay between batches
      if (i + BATCH_SIZE < pageObjectIds.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    const formattedArtworks = results.map(artwork => ({
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
      items: formattedArtworks,
      total: allObjectIds.length,
      page,
      totalPages: Math.ceil(allObjectIds.length / limit)
    };

  } catch (error) {
    console.error('Met API Error:', error);
    return { items: [], total: 0, page, totalPages: 0 };
  }
};

export const getArtworksByDepartment = async (departmentId, limit = 8) => {
  try {

    const searchResponse = await axios.get(`${API_BASE_URL}/search`, {
      params: {
        departmentId,
        q: "*",
        hasImages: true
      }
    });

    const allObjectIds = searchResponse.data.objectIDs || [];
    const selectedIds = allObjectIds.slice(0, limit);
    
    const artworks = await Promise.all(
      selectedIds.map(id => 
        axios.get(`${API_BASE_URL}/objects/${id}`)
          .then(response => response.data)
          .catch(() => null)
      )
    );

    return artworks
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