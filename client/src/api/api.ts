import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL!;

export const api = axios.create({
    baseURL: API_BASE_URL,
});

export const fetchData = async (page: number = 1, per_page: number = 10) => {
    try {
        const response = await api.get('/v1/users', {
            params: { offset: page * per_page - per_page, limit: per_page },
        });
        return response.data;
    } catch (error) {
        throw new Error("Error fetching data");
    }
};

// export const deleteData = async (id: number) => {
//     try {
//         const response = await api.delete(`/v1/users/${id}`);
//         return { statusCode: response.status }
//     } catch (error) {
//         throw new Error(`Data ${id} does not exist.`);
//     }
// };

