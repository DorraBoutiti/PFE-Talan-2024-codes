

import axios from 'axios';

const baseUrl = 'http://localhost:3001/'; 

const api = axios.create({
    baseURL: baseUrl,
});


export const getDocumentsByCandidatId = async (candidatId) => {
    try {
        const response = await api.get(`/document/Candidat/${candidatId}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
};

export const addCandidatRequest = async (data) => {
    try {
        console.log(data);
        const response = await api.post('/candidat/', data);
        
        return response.data;
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
};

export const search = async (query) => {
    try {
        const response = await api.post('/candidat/search', {
            query: query
        });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to search candidats: ${error.message}`);
    }
};

