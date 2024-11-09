import axios from 'axios';

const API_BASE_URL = 'https://api.harvardartmuseums.org';
const API_KEY = process.env.REACT_APP_HARVARD_API_KEY;

export const searchArtworks = async (query, page = 1, limit = 100) => {
  try {
    console.log('Starting Harvard search for:', query);
    
    const response = await axios.get(`${API_BASE_URL}/object`, {
      params: {
        apikey: API_KEY,
        q: query,          
        hasimage: 1,       
        size: 100,
        fields: 'id,title,primaryimageurl,people,dated,division,classification,technique,medium,dimensions'
      }
    });

    const records = response.data?.records || [];
    console.log('Harvard total records:', records.length);

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

    console.log('Harvard processed results:', {
      total: formattedRecords.length,
      withImages: formattedRecords.filter(r => r.hasImage).length,
      sample: formattedRecords[0]
    });

    return {
      items: formattedRecords,
      total: formattedRecords.length,
      page,
      totalPages: Math.ceil(formattedRecords.length / limit)
    };

  } catch (error) {
    console.error('Harvard API Error:', error);
    return { items: [], total: 0, page, totalPages: 0 };
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
    console.log(`Fetching Harvard artworks for classification: ${classification}`);
    
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
    console.log(`Found ${records.length} Harvard records`);

    return records
      .filter(record => record.primaryimageurl)
      .slice(0, limit);

  } catch (error) {
    console.error('Error fetching Harvard artworks:', error);
    return [];
  }
};