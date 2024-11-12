import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
    'Content-Type': 'application/json',
    },
});

export const generateBrief = async (briefData) => {
    try {
    const response = await api.post('/brief', briefData);
    return response.data;
    } catch (error) {
    console.error('Error generating brief:', error.response?.data || error);
    throw new Error(error.response?.data?.detail || 'Failed to generate brief');
    }
};

export const getProjectTypes = async (difficulty) => {
    try {
    const response = await api.get(`/project-types/${difficulty}`);
    return response.data.project_types;
    } catch (error) {
    console.error('Error fetching project types:', error.response?.data || error);
    throw new Error(error.response?.data?.detail || 'Failed to fetch project types');
    }
};

export const healthCheck = async () => {
    try {
        const response = await api.get('/health');
        return response.data;
    } catch (error) {
        console.error('Error checking health:', error);
        throw error.response?.data || error.message;
    }
};