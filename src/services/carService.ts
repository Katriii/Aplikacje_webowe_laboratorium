import axios from "axios";
import { apiClient } from "../api/apiClient";
import type { Car, NewCar } from '../models/Car';

function createServiceError(error: unknown, message: string) : Error {
    if(axios.isAxiosError(error)) {
        if(error.request) {
            return new Error(
                `${message} Brak odpowiedzi z serwera.`,
                { cause: error }
            );
        }

        if(error.response) {
            return new Error(
                `${message} Status HTTP: ${error.response.status}.`,
                { cause: error }
            );
        }

        return new Error(
            `${message} ${error.message}`,
            { cause: error }
        );
    }

    return new Error(message, { cause : error } );
}

export async function getCars(signal?: AbortSignal): Promise<Car[]> {
    try {
        const response = await apiClient.get<Car[]>(`/cars`, { signal });
        return response.data;
    }
    catch(error) {
        if(axios.isCancel(error)) {
            throw error;
        }
        throw createServiceError(error, "Nie udało się pobrać samochodów.");
    }
}

export async function getCarsById(id: string, signal?: AbortSignal): Promise<Car> {
    try {
        const response = await apiClient.get<Car>(`/cars/${id}`, { signal });
        return response.data;
    }
    catch(error) {
        if(axios.isCancel(error)) {
            throw error;
        }
        throw createServiceError(error, "Nie udało się pobrać samochodu.");
    }
}

export async function createCar(car: NewCar): Promise<Car> {
    try {
        const response = await apiClient.post<Car>(`/cars`, car );
        return response.data;
    }
    catch(error) {
        throw createServiceError(error, "Nie udało się stworzyć samochodu.");
    }
}

export async function updateCar(id: string, car: NewCar): Promise<void> {
    try {
        await apiClient.put<Car>(`/cars/${id}`, car );
    }
    catch(error) {
        throw createServiceError(error, "Nie udało się zaktualizować samochodu.");
    }
}

export async function deleteCar(id: string): Promise<void> {
    try {
        await apiClient.delete<Car>(`/cars/${id}`);
    }
    catch(error) {
        throw createServiceError(error, "Nie udało się usunąć samochodu.");
    }
}
