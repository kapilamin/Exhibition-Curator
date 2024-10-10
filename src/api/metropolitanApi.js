// src/api/metropolitanApi.js
import axios from 'axios';

const API_BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';

// Function to search for artworks
export const searchArtworks = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: {
        q: query,
        hasImages: true
      }
    });
    return response.data.objectIDs;
  } catch (error) {
    console.error('Error searching Metropolitan Museum of Art:', error);
    throw error;
  }
};

// Function to get details of a specific artwork
export const getArtworkDetails = async (objectId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/objects/${objectId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching artwork details from Metropolitan Museum of Art:', error);
    throw error;
  }
};

// Function to get multiple artwork details
export const getMultipleArtworkDetails = async (objectIds, limit = 10) => {
  try {
    const artworksPromises = objectIds.slice(0, limit).map(id => getArtworkDetails(id));
    return await Promise.all(artworksPromises);
  } catch (error) {
    console.error('Error fetching multiple artwork details:', error);
    throw error;
  }
};

// Function to get a list of departments
export const getDepartments = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/departments`);
    return response.data.departments;
  } catch (error) {
    console.error('Error fetching departments from Metropolitan Museum of Art:', error);
    throw error;
  }
};

// Function to get artworks by department
export const getArtworksByDepartment = async (departmentId, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/objects`, {
      params: {
        departmentIds: departmentId,
        hasImages: true
      }
    });
    const objectIds = response.data.objectIDs.slice(0, limit);
    return await getMultipleArtworkDetails(objectIds);
  } catch (error) {
    console.error('Error fetching artworks by department from Metropolitan Museum of Art:', error);
    throw error;
  }
};