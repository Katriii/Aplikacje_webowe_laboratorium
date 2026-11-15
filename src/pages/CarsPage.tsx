import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Car } from "../models/Car";
import axios from 'axios';
import { getCars, deleteCar } from "../services/carService";
import { useCarUiStore } from '../stores/useCarUiStore';
import { useAuthStore } from "../stores/useAuthStore";

export default function CarsPage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const searchTerm = useCarUiStore((state) => state.searchTerm);
    const setSearchTerm = useCarUiStore((state) => state.setSearchTerm);
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const showFavoritesOnly = useCarUiStore((state) => state.showFavoritesOnly);
    const setShowFavoritesOnly = useCarUiStore((state) => state.setShowFavoritesOnly);

    const user = useAuthStore((state) => state.user);

    const favoriteCarIdsByUser = useCarUiStore((state) => state.favoriteCarIdsByUser);
    const favoriteCarIds = user ? favoriteCarIdsByUser[user.id] ?? [] : [];

    const visibleCars = cars.filter((car) => {
        const matchesSearch = car.brand.toLowerCase().includes(normalizedSearch) || car.model.toLowerCase().includes(normalizedSearch);
        const matchesFavorite = !showFavoritesOnly || favoriteCarIds.includes(car.id);

        return (matchesSearch && matchesFavorite);
    })

    const toggleFavorite = useCarUiStore((state) => state.toggleFavorite);
    const removeFavorite = useCarUiStore((state) => state.removeFavorite);

    function isFavorite(id: string): boolean {
        return favoriteCarIds.includes(id);
    }

    useEffect(() => {
        const controller = new AbortController();

        async function loadCars() {
            try {
                setIsLoading(true);
                setError(null);
                const loadedCars = await getCars(controller.signal);
                setCars(loadedCars);
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
        
        loadCars();
        return () => {
            controller.abort();
        };

    }, []);

    async function onDeleteCar(id: string) {
        const confirmed = window.confirm("Czy na pewno chcesz usunąć ten samochód?")
        if(!confirmed) {
            return;
        }
        else {
            await deleteCar(id)
            if (user) {removeFavorite(user.id, id)};
            setCars(cars.filter((car) => car.id !== id))
        }
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


    if (cars.length === 0) {
        return <p>Nie znaleziono samochodów.</p>;
    }

    return (
        <section className="main-section">
            <section className="cars-toolbar">
                <input type="search" placeholder="Szukaj po marce lub modelu..."
                    value={searchTerm} onChange={(event) =>
                    setSearchTerm(event.target.value)}/>
                <label className="favorite-filter">
                    <input type="checkbox" checked={showFavoritesOnly}
                    onChange={(event) =>
                        setShowFavoritesOnly(event.target.checked)}/>
                Tylko ulubione
                </label>
            </section>
            <section className="cars-list">
            {visibleCars.map((car) => (
                <article key={car.id} className="car-item">
                    <div className="car-item-header">
                        <h2 className="car-item-title">{car.brand} {car.model}</h2>
                        <button type="button" className="favorite-button"
                            onClick={() => {if(user) {toggleFavorite(user.id, car.id)}}}>
                            {isFavorite(car.id) ? "⭐" : "☆"}
                        </button>
                    </div>
                    <p>Rok produkcji: {car.productionDate}</p>
                    <p>Średnie spalanie: {car.averageFuelConsumption}L/100km</p>
                    <div className="car-item-actions">
                        <Link className="car-item-details-btn" to={`/cars/${car.id}`}>
                            Szczegóły
                        </Link>
                        {" - "}
                        <button className="car-item-delete-btn" onClick={ () => onDeleteCar(car.id) }>
                            Usuń
                        </button>
                    </div>
                </article>
            ))}
            </section>
        </section>
    )
}