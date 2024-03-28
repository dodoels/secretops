import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL!;

export const api = axios.create({
    baseURL: API_BASE_URL,
});

export const fetchReservation = async (page: number = 1, per_page: number = 10) => {
    try {
        const response = await api.get('/api/v1/reservations', {
            params: { offset: page * per_page - per_page, limit: per_page }
        });
        return response.data.responseObject;
    } catch (error) {
        throw new Error('Error fetching data');
    }
};

