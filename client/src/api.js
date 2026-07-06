import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL,
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
            const refreshToken = localStorage.getItem(REFRESH_TOKEN);

            if (refreshToken) {
                try {
                    const response = await api.post('/api/token/refresh/', {
                        refresh: refreshToken,
                    });

                    const newAccess = response.data.access;
                    const newRefresh = response.data.refresh;

                    localStorage.setItem(ACCESS_TOKEN, newAccess);
                    if (newRefresh) {
                        localStorage.setItem(REFRESH_TOKEN, newRefresh);
                    }

                    originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem(ACCESS_TOKEN);
                    localStorage.removeItem(REFRESH_TOKEN);
                    window.location.href = "/login";
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;