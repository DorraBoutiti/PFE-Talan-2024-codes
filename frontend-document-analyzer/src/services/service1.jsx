

import axios from 'axios';

const baseUrl = 'http://localhost:3001/'; 
const baseStt = 'http://localhost:8001/';

const api = axios.create({
    baseURL: baseUrl,
});


export const getDocumentsByCandidatId = async (candidatId) => {
    try {
        const response = await api.get(`/document/Candidat/${candidatId}`);      
        return response.data;
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
};

export const addCandidatRequest = async (data) => {
    try {  
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
            query, 
        });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to search candidats: ${error.message}`);
    }
};

export const extractSkills = async (text) => {
    try {
        const response = await axios.post(`${baseStt}/extract_skills`, { text });       
        return response.data;
    } catch (error) {
        throw new Error(`Failed to extract skills: ${error.message}`);
    }
};

export const SpeechToTextProcess = async (candidatId, text) => {
    try {
        const response = await axios.post(`${baseUrl}document/interview/${candidatId}`, {"interviewText": text });        
        return response.data;
    } catch (error) {
        throw new Error(`Failed to extract skills: ${error.message}`);
    }
};

export const getAllInterviews = async (candidatId) => {
    try {
        const response = await axios.get(`${baseUrl}document/interviews/${candidatId}`);    
        return response.data;
    } catch (error) {
        throw new Error(`Failed to extract skills: ${error.message}`);
    }
};

export const getCandidatDocuments = async (candidatId, filterName) => {
    try {
        console.log(candidatId, filterName)
        const response = await axios.get(`${baseUrl}document/details/${candidatId}`, {
            params: {
                filterKey : filterName 
            }
        });    
        // console.log(response.data);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to extract skills: ${error.message}`);
    }
}

export const fetchDocumentInfos = async (key) => {
    try {
        const response = await api.get(`${ baseUrl }document/${key}`);      
        return response.data;
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
};

export const addDocumentsRequest = async (addDocuments, candidatId) => {
    try {
        const response = await api.post(`/document/request/${candidatId}`, addDocuments);      
        return response;
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }    
}
