import axios from 'axios';

const API_BASE_URL = 'https://api.harvardartmuseums.org';
const API_KEY = process.env.REACT_APP_HARVARD_API_KEY;
const PAGE_SIZE = 40;

export const searchArtworks = async (query, page = 1) => {
  try {
    const countResponse = await axios.get(`${API_BASE_URL}/object`, {
      params: {
        apikey: API_KEY,
        q: query,          
        hasimage: 1,
        size: 1,
        fields: 'id'
      }
    });

    const total = countResponse.data?.info?.totalrecords || 0;
    
    if (total === 0) {
      return { items: [], total: 0, page, totalPages: 0 };
    }

    const response = await axios.get(`${API_BASE_URL}/object`, {
      params: {
        apikey: API_KEY,
        q: query,          
        hasimage: 1,       
        size: PAGE_SIZE,
        page: page,
        fields: 'id,title,primaryimageurl,people,dated,division,classification,technique,medium,dimensions'
      }
    });

    const records = response.data?.records || [];

    const formattedRecords = records.map(record => ({
      id: record.id?.toString(),
      title: record.title || 'Untitled',
      artist: record.people?.[0]?.name || 'Unknown Artist',
      image: record.primaryimageurl || '',
      source: 'harvard',
      date: record.dated || '',
      medium: record.technique || record.classification || '',
      dimensions: record.dimensions || '',
      link: `https://harvardartmuseums.org/collections/object/${record.id}`,
      hasImage: Boolean(record.primaryimageurl)
    }));

    return {
      items: formattedRecords,
      total,
      page,
      totalPages: Math.ceil(total / PAGE_SIZE),
      hasMore: page * PAGE_SIZE < total,
      nextIndex: page + 1
    };

  } catch (error) {
    console.error('Harvard API Error:', error);
    return { items: [], total: 0, page, totalPages: 0, hasMore: false };
  }
};

export const loadMoreArtworks = async (query, page) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/object`, {
      params: {
        apikey: API_KEY,
        q: query,          
        hasimage: 1,       
        size: PAGE_SIZE,
        page: page,
        fields: 'id,title,primaryimageurl,people,dated,division,classification,technique,medium,dimensions'
      }
    });

    const records = response.data?.records || [];
    const total = response.data?.info?.totalrecords || 0;

    const formattedRecords = records.map(record => ({
    }));

    return {
      items: formattedRecords,
      hasMore: page * PAGE_SIZE < total,
      nextIndex: page + 1
    };
  } catch (error) {
    console.error('Error loading more Harvard artworks:', error);
    return { items: [], hasMore: false, nextIndex: page };
  }
};


export const getArtworkDetails = async (objectId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/object/${objectId}`, {
      params: {
        apikey: API_KEY,
        fields: 'id,title,description,primaryimageurl,people,dated,division,classification,culture,technique,medium,dimensions,provenance',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching artwork details from Harvard Art Museums:', error);
    throw error;
  }
};

export const getClassifications = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/classification`, {
      params: {
        apikey: API_KEY,
        size: 100,
        sort: 'name',
        fields: 'name,objectcount',
      },
    });
    return response.data.records;
  } catch (error) {
    console.error('Error fetching classifications from Harvard Art Museums:', error);
    throw error;
  }
};

export const getArtworksByClassification = async (classification, limit = 8) => {
  try {
    
    const response = await axios.get(`${API_BASE_URL}/object`, {
      params: {
        apikey: API_KEY,
        keyword: classification,
        hasimage: 1,
        size: limit * 2,
        fields: 'id,title,primaryimageurl,people,dated,division,classification,images,technique,medium',
        sort: 'random'
      }
    });

    const records = response.data?.records || [];

    return records
      .filter(record => record.primaryimageurl)
      .slice(0, limit);

  } catch (error) {
    console.error('Error fetching Harvard artworks:', error);
    return [];
  }
};