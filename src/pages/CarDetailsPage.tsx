import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import type { Car } from "../models/Car";
import { getCarsById } from "../services/carService";
import { useCarUiStore } from "../stores/useCarUiStore";
import { useAuthStore } from "../stores/useAuthStore";
import axios from 'axios';

export default function CarDetailsPage() {
    const [car, setCar] = useState<Car>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams();
    
    const user = useAuthStore((state) => state.user);

    const favoriteCarIdsByUser = useCarUiStore((state) => state.favoriteCarIdsByUser);
    const favoriteCarIds = user ? favoriteCarIdsByUser[user.id] ?? [] : [];
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
        return (
            <section className="main-section">
                <p>Samochód o zadanym id nie istnieje.</p>
                <br/>
                <Link className="form-back-btn" to={`/`}>Powrót do strony głównej</Link>
            </section>
        )
    }

    if (isLoading) {
        return (
            <section className="main-section">
                <p>Ładowanie danych...</p>
            </section>
        )
    }

    if (error) {
        return (
            <section className="main-section">
                <p className="error-message">Wystąpił błąd: {error}</p>
                <br/>
                <Link className="form-back-btn" to={`/`}>Powrót do strony głównej</Link>
            </section> 
        )
    }


    const isFavorite = favoriteCarIds.includes(car.id);

    return (
        <section className="main-section">
            <h1 className="page-title">Szczegóły samochodu</h1>
            <article key={car.id} className="car-item">
                <div className="car-item-header">
                    <h2 className="car-item-title">{car.brand} {car.model}</h2>
                    <button type="button" className="favorite-button"
                        onClick={() => {if(user) {toggleFavorite(user.id, car.id)}}}>
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
        </section>
    )
}