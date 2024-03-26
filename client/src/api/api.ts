import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL!;

export const api = axios.create({
    baseURL: API_BASE_URL,
});

// TODO:  params: { offset: page * per_page - per_page, limit: per_page }

export const fetchData = async () => {
    try {
        const response = await api.get('/api/v1/users');
        return response.data.responseObject;
    } catch (error) {
        throw new Error('Error fetching data');
    }
};

// export const deleteData = async (id: number) => {
//     try {
//         const response = await api.delete(`/v1/data/${id}`);
//         return { statusCode: response.status }
//     } catch (error) {
//         throw new Error(`Data ${id} does not exist.`);
//     }
// };
