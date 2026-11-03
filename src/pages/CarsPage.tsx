import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Car } from "../models/Car";
import { getCars, deleteCar } from "../services/carService";

export default function CarsPage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
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
                if (caughtError instanceof DOMException &&
                    caughtError.name === "AbortError") {
                        return;
                    }
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
            setCars(cars.filter((car) => car.id !== id))
        }
    }

    if (isLoading) {
        return <p>Ładowanie danych...</p>;
    }

    if (error) {
        return <p className="error">Wystąpił błąd: {error}</p>
    }

    if (cars.length === 0) {
        return <p>Nie znaleziono samochodów.</p>;
    }

    return (
        <section className="cars-list">
            {cars.map((car) => (
                <article key={car.id} className="car-item">
                    <h2>
                        {car.brand} {car.model}
                    </h2>
                    <p>Rok produkcji: {car.productionDate}</p>
                    <p>Średnie spalanie: {car.averageFuelConsumption}</p>
                    <Link to={`/cars/${car.id}`}>
                        Szczegóły
                    </Link>
                    {" - "}
                    <button onClick={ () => onDeleteCar(car.id) }>
                        Usuń
                    </button>
                </article>
            ))}
        </section>
    )
}