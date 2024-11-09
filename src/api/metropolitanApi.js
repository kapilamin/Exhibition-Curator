import axios from 'axios';

const API_BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';

export const searchArtworks = async (query, page = 1, limit = 100) => {
  try {
    console.log('Starting Met search for:', query);
    console.log('Met search URL:', `${API_BASE_URL}/search`, {
      params: {
        q: query,
        hasImages: true
      }
    });

    const searchResponse = await axios.get(`${API_BASE_URL}/search`, {
      params: {
        q: query,
        hasImages: true
      }
    });

    console.log('Met raw search response:', searchResponse.data);

    const allObjectIds = searchResponse.data.objectIDs || [];
    console.log('Met object IDs:', {
      total: allObjectIds.length,
      firstFew: allObjectIds.slice(0, 5)
    });

    if (!allObjectIds.length) {
      console.log('No Met results found');
      return {
        items: [],
        total: 0,
        page,
        totalPages: 0
      };
    }

    const firstTwenty = allObjectIds.slice(0, 20);
    console.log('Fetching details for first 20 Met artworks:', firstTwenty);

    const artworksPromises = firstTwenty.map(id => {
      console.log(`Fetching Met artwork ${id}`);
      return axios.get(`${API_BASE_URL}/objects/${id}`)
        .then(response => {
          console.log(`Successfully fetched Met artwork ${id}:`, response.data);
          return response.data;
        })
        .catch(error => {
          console.error(`Failed to fetch Met artwork ${id}:`, error);
          return null;
        });
    });

    const artworks = await Promise.all(artworksPromises);
    console.log('Met artworks fetched:', artworks.length);

    const formattedArtworks = artworks
      .filter(artwork => {
        if (!artwork) {
          console.log('Filtering out null artwork');
          return false;
        }
        const hasImage = Boolean(artwork.primaryImageSmall || artwork.primaryImage);
        console.log('Checking artwork images:', {
          id: artwork.objectID,
          hasImage,
          primaryImageSmall: Boolean(artwork.primaryImageSmall),
          primaryImage: Boolean(artwork.primaryImage)
        });
        return true;
      })
      .map(artwork => {
        const formatted = {
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
        };
        console.log('Formatted Met artwork:', formatted);
        return formatted;
      });

    console.log('Met final formatted results:', {
      total: formattedArtworks.length,
      sample: formattedArtworks[0]
    });

    return {
      items: formattedArtworks,
      total: formattedArtworks.length,
      page,
      totalPages: Math.ceil(formattedArtworks.length / limit)
    };

  } catch (error) {
    console.error('Met API Error:', error);
    console.error('Met API Error details:', {
      message: error.message,
      response: error.response?.data
    });
    return { items: [], total: 0, page, totalPages: 0 };
  }
};
export const getArtworkDetails = async (objectId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/objects/${objectId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching artwork details:', error);
    return null;
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
    
    const artworksPromises = selectedIds.map(id => 
      axios.get(`${API_BASE_URL}/objects/${id}`)
        .then(response => response.data)
        .catch(() => null)
    );

    const artworks = await Promise.all(artworksPromises);

    return artworks.filter(artwork => artwork?.primaryImageSmall);

  } catch (error) {
    console.error('Error fetching Met department artworks:', error);
    return [];
  }
};