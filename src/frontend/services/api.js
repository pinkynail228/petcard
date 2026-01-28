import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);
    } else {
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
    }
};

// Initialize token from storage
const savedToken = localStorage.getItem('token');
if (savedToken) {
    setAuthToken(savedToken);
}

// Response interceptor for 401 handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            setAuthToken(null);
            // Optional: Redirect to login or handled by context
        }
        return Promise.reject(error);
    }
);

export const authService = {
    // Auth
    login: async (telegramData) => {
        const response = await api.post('/auth/login', telegramData);
        return response.data;
    },
    register: async (telegramData) => {
        const response = await api.post('/auth/register', telegramData);
        return response.data;
    },
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // Pets
    getPets: async () => {
        const response = await api.get('/pets/');
        return response.data;
    },
    createPet: async (petData) => {
        const response = await api.post('/pets/', petData);
        return response.data;
    },
    getPet: async (id) => {
        const response = await api.get(`/pets/${id}`);
        return response.data;
    },
    updatePet: async (id, data) => {
        const response = await api.put(`/pets/${id}`, data);
        return response.data;
    },
    deletePet: async (id) => {
        const response = await api.delete(`/pets/${id}`);
        return response.data;
    },

    // Vaccines
    getVaccines: async (petId) => {
        const response = await api.get(`/pets/${petId}/vaccines`);
        return response.data;
    },
    createVaccine: async (petId, data) => {
        const response = await api.post(`/pets/${petId}/vaccines`, data);
        return response.data;
    },
    deleteVaccine: async (petId, vaccineId) => {
        const response = await api.delete(`/pets/${petId}/vaccines/${vaccineId}`);
        return response.data;
    },

    // Medical Records
    getMedicalRecords: async (petId) => {
        const response = await api.get(`/pets/${petId}/records`);
        return response.data;
    },
    createMedicalRecord: async (petId, data) => {
        const response = await api.post(`/pets/${petId}/records`, data);
        return response.data;
    },
    deleteMedicalRecord: async (petId, recordId) => {
        const response = await api.delete(`/pets/${petId}/records/${recordId}`);
        return response.data;
    },

    // Clinic
    getClinic: async (petId) => {
        const response = await api.get(`/pets/${petId}/clinic`);
        return response.data;
    },
    validateClinicCode: async (code, petId) => {
        const response = await api.post('/clinic-codes/validate', { code, pet_id: petId });
        return response.data;
    }
};

export default api;
