import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import type { Car } from "../models/Car";
import { getCarsById } from "../services/carService";
import { useCarUiStore } from "../stores/useCarUiStore";
import axios from 'axios';

export default function CarDetailsPage() {
    const [car, setCar] = useState<Car>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams();
    
    const favoriteCarIds = useCarUiStore((state) => state.favoriteCarIds);
    const toggleFavorite = useCarUiStore((state) => state.toggleFavorite);

    useEffect(() => {
        const controller = new AbortController();

        async function loadCarById() {
            try {
                if(!id) {
                    setError("Parametr Id strony nie może być pusty.");
                    return;
                }

                setIsLoading(true);
                setError(null);
                const loadedCar = await getCarsById(id, controller.signal);
                setCar(loadedCar);
            }
            catch (caughtError) {
                if (axios.isCancel(caughtError)) { return; }
                if (caughtError instanceof Error) {
                    setError(caughtError.message);
                }
                else {
                    setError("Wystąpił nieznany błąd.");
                }
            }
            finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }
        
        loadCarById();
        return () => {
            controller.abort();
        };

    }, []);

    if (!car) {
        return <p>Samochód o zadanym id nie istnieje.</p>;
    }

    if (isLoading) {
        return <p>Ładowanie danych...</p>;
    }

    if (error) {
        return <p className="error">Wystąpił błąd: {error}</p>
    }

    const isFavorite = favoriteCarIds.includes(car.id);

    return (
        <section className="main-section">
            <h1 className="page-title">Szczegóły samochodu</h1>
            <article key={car.id} className="car-item">
                <div className="car-item-header">
                    <h2 className="car-item-title">{car.brand} {car.model}</h2>
                    <button type="button" className="favorite-button"
                        onClick={() => toggleFavorite(car.id)}>
                        {isFavorite ? "⭐" : "☆"}
                    </button>
                </div>
                <p>Rok produkcji: {car.productionDate}</p>
                <p>Typ podwozia: {car.bodyType}</p>
                <p>Liczba drzwi: {car.doorsNumber}</p>
                <p>Pojemność bagażu: {car.luggageCapacity}L</p>
                <p>Pojemność silnika: {car.engineCapacity}L</p>
                <p>Typ paliwa: {car.fuelType}</p>
                <p>Średnie spalanie: {car.averageFuelConsumption}L/100km</p>
                <div className="car-item-actions">
                    <Link className="car-item-details-btn" to="/cars">
                        Powrót do listy
                    </Link>
                    {" - "}
                    <Link className="car-item-edit-btn" to={`/cars/${car.id}/edit`}>
                    Edytuj samochód
                    </Link>
                </div>
            </article>
            {/* <article key={car.id} className="car-item">
                    <div className="car-item-header">
                        <h2 className="car-item-title">{car.brand} {car.model}</h2>
                        <button type="button" 
                            className={isFavorite(car.id) 
                                ? "favorite-button active-favorite"
                                : "favorite-button"
                            } 
                            onClick={() => toggleFavorite(car.id)}>
                            {isFavorite(car.id) ? "⭐" : "☆"}
                        </button>
                    </div>
                    <p>Rok produkcji: {car.productionDate}</p>
                    <p>Średnie spalanie: {car.averageFuelConsumption}</p>
                    <div className="car-item-actions">
                        <Link className="car-item-details-btn" to={`/cars/${car.id}`}>
                            Szczegóły
                        </Link>
                        {" - "}
                        <button className="car-item-delete-btn" onClick={ () => onDeleteCar(car.id) }>
                            Usuń
                        </button>
                    </div>
                </article> */}
        </section>
    )
}