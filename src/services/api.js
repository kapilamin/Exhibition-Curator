import axios from 'axios';

const API_URL = 'https://api.example-museum.com/v1';

export const searchArtworks = async (searchTerm) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching artworks:', error);
    throw error;
  }
};

export const getArtworkDetails = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/artwork/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching artwork details:', error);
    throw error;
  }
};