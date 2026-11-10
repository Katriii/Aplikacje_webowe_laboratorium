import { useState, type ChangeEvent, type SubmitEvent } from "react";
import type { NewCar } from "../models/Car";
import { Link } from "react-router"
import { createCar } from "../services/carService";
import axios from 'axios';

const initialCarFormData: NewCar = {
    brand: "",
    model: "",
    productionDate: "",
    doorsNumber: 0,
    luggageCapacity: 0,
    engineCapacity: 0,
    fuelType: 0,
    averageFuelConsumption: 0,
    bodyType: 0,
};

export default function CreateCarPage() {
    const [formData, setFormData] = useState<NewCar>(initialCarFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Funkcja wykonywana, gdy użytkownik zmienia zawartość któregoś pola formularza
    function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
        ...currentFormData,
        [name]: value, 
    }));
    }

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const freshCar: NewCar = {
            brand: formData.brand.trim(),
            model: formData.model.trim(),
            productionDate: formData.productionDate.trim(),
            doorsNumber: Number(formData.doorsNumber),
            luggageCapacity: Number(formData.luggageCapacity),
            engineCapacity: Number(formData.engineCapacity),
            fuelType: Number(formData.fuelType),
            averageFuelConsumption: Number(formData.averageFuelConsumption),
            bodyType: Number(formData.bodyType),
        }

        try {
            setIsLoading(true);
            setError(null);
            await createCar(freshCar);
            setFormData(initialCarFormData);
            setIsLoading(false);
        }
        catch (caughtError) {
            setIsLoading(false);
            if (axios.isCancel(caughtError)) { return; }
            if (caughtError instanceof Error) {
                setError(caughtError.message);
            }
            else {
                setError("Wystąpił nieznany błąd.");
            }
        }
    }

    if (isLoading) {
        return <p>Wysyłanie...</p>;
    }

    if (error) {
        return <p className="error">Wystąpił błąd: {error}</p>
    }

    return (
    <section className="main-section">
        <h2 className="page-title">Stwórz nowy samochód</h2>
        <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
                <label className="form-label">Marka</label>
                <input
                    name="brand"
                    type="text"
                    className="form-input"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                />
            </div> 
            <div className="form-group">
                <label className="form-label">Model</label>
                <input
                    name="model"
                    type="text"
                    className="form-input"
                    value={formData.model}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label">Rok produkcji</label>
                <input
                    name="productionDate"
                    type="text"
                    className="form-input"
                    value={formData.productionDate}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label">Liczba drzwi</label>
                <input
                    name="doorsNumber"
                    type="number"
                    className="form-input"
                    value={formData.doorsNumber}
                    onChange={handleChange}
                    required
                />
            </div> 
            <div className="form-group">
                <label className="form-label">Pojemność bagażu</label>
                <input
                    name="luggageCapacity"
                    type="number"
                    className="form-input"
                    value={formData.luggageCapacity}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label">Pojemność silnika</label>
                <input
                    name="engineCapacity"
                    type="number"
                    className="form-input"
                    value={formData.engineCapacity}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label">Typ paliwa</label>
                <select name="fuelType" value={formData.fuelType} 
                    onChange={handleChange} className="form-select" required>
                    <option value="0">Petrol</option>
                    <option value="1">Diesel</option>
                    <option value="2">Hybrid</option>
                    <option value="3">Elektyczny</option>
                    <option value="4">LPG</option>
                </select>
            </div>
            <div className="form-group">
                <label className="form-label">Średnie spalanie</label>
                <input
                    name="averageFuelConsumption"
                    type="number"
                    className="form-input"
                    value={formData.averageFuelConsumption}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label">Typ podwozia</label>
                <select name="bodyType" value={formData.bodyType} 
                    onChange={handleChange} className="form-select" required>
                    <option value="0">Hatchback</option>
                    <option value="1">Sedan</option>
                    <option value="2">Kombi</option>
                    <option value="3">SUV</option>
                    <option value="4">Roadster</option>
                </select>  
            </div> 
            <button type="submit" className="form-submit-btn">Dodaj samochód</button>
        </form>
        {/* type="submit" informuje przeglądarkę, że przycisk służy do zatwierdzania 
        formularza. */}
        <br/>
        <Link className="form-back-btn" to={`/cars`}>Powrót do listy</Link>
    </section>
    );
}