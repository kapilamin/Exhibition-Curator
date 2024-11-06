import axios from 'axios';

const API_BASE_URL = 'https://api.harvardartmuseums.org';
const API_KEY = process.env.REACT_APP_HARVARD_API_KEY; 

// export const searchArtworks = async (query, limit = 10) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/object`, {
//       params: {
//         apikey: API_KEY,
//         q: query,
//         size: limit,
//         fields: 'id,title,primaryimageurl,people,dated,division,classification',
//       },
//     });
//     return response.data.records;
//   } catch (error) {
//     console.error('Error searching Harvard Art Museums:', error);
//     throw error;
//   }
// };

export const searchArtworks = async (query, page = 1, limit = 20) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/object`, {
      params: {
        apikey: API_KEY,
        q: query,
        size: limit,
        page: page - 1, // Harvard API uses 0-based pagination
        fields: 'id,title,primaryimageurl,people,dated,division,classification',
      },
    });

    return {
      items: response.data.records,
      total: response.data.info.totalrecords,
      page,
      totalPages: Math.ceil(response.data.info.totalrecords / limit)
    };
  } catch (error) {
    console.error('Error searching Harvard Art Museums:', error);
    throw error;
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

export const getArtworksByClassification = async (classification, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/object`, {
      params: {
        apikey: API_KEY,
        classification: classification,
        size: limit,
        fields: 'id,title,primaryimageurl,people,dated,division,classification',
      },
    });
    return response.data.records;
  } catch (error) {
    console.error('Error fetching artworks by classification from Harvard Art Museums:', error);
    throw error;
  }
};