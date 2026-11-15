import axios from 'axios';
import { useAuthStore } from "../stores/useAuthStore.ts";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000, // 10s
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },    
});

apiClient.interceptors.request.use(
    (config) => {
        const user = useAuthStore.getState().user;
        if(user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }

        console.log(`[Axios] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
    (response) => {
        console.log(`[Axios] ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);