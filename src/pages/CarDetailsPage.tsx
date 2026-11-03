import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import type { Car } from "../models/Car";
import { getCarsById } from "../services/carService";

export default function CarDetailsPage() {
    const [car, setCar] = useState<Car>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams();

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

    return (
        <section>
            <article key={car.id} className="car-item">
                <h2>
                    {car.brand} {car.model}
                </h2>
                <p>Rok produkcji: {car.productionDate}</p>
                <p>Typ podwozia: {car.bodyType}</p>
                <p>Liczba drzwi: {car.doorsNumber}</p>
                <p>Pojemność bagażu: {car.luggageCapacity}</p>
                <p>Pojemność silnika: {car.engineCapacity}l</p>
                <p>Średnie spalanie: {car.averageFuelConsumption}</p>
                <Link to="/cars">
                Powrót to listy
                </Link>
                {" - "}
                <Link to={`/cars/${car.id}/edit`}>
                Edytuj samochód
                </Link>
            </article>
        </section>
    )
}