import axios from 'axios';
import { ACCESS_TOKEN } from './constants';

//const apiUrl = window?.configs?.apiUrl ? window.configs.apiUrl : "http://127.0.0.1:8000";

const api = axios.create({
    baseURL: 'http://localhost:8000',//apiUrl ? apiUrl : import.meta.env.VITE_API_URL,
});

//console.log(apiUrl)

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                        refresh: refreshToken,
                    });

                    const newAccess = response.data.access;
                    const newRefresh = response.data.access;

                    localStorage.setItem('access_token', newAccess);
                    if (newRefresh) {
                        localStorage.setItem('refresh_token', newRefresh);
                    }

                    originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.localStorage.href = '/login';
                    return Promise.reject(ReferenceError);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;