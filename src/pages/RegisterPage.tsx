import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Link } from "react-router";
import axios from "axios";
import { register } from "../services/authService.ts";
import type { RegisterData } from "../models/Auth.ts";

const initialRegisterFormData: RegisterData = {
    userName: "",
    password: "",
    email: ""
};

export default function RegisterPage() {
    const [formData, setFormData] = useState<RegisterData>(initialRegisterFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [registerMessage, setRegisterMessage] = useState<string | null>(null);
    
    function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value } = event.target;

        setFormData((currentFormData) => ({
            ...currentFormData,
            [name]: value, 
        }));
    }

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const newRegistration: RegisterData = {
            userName: formData.userName.trim(),
            password: formData.password.trim(),
            email: formData.email.trim()
        }

        try {
            setIsLoading(true);
            setError(null);
            setRegisterMessage(await register(newRegistration));
            setIsLoading(false);
            setFormData(initialRegisterFormData);
        }
        catch (caughtError) {
            setIsLoading(false);
            if (axios.isCancel(caughtError)) { 
                return; 
            }
            else if (axios.isAxiosError(caughtError)) {
                setError(caughtError.response?.data);
            }
            else if (caughtError instanceof Error) {
                setError(caughtError.message);
            }
            else {
                setError("Wystąpił nieznany błąd.");
            }
        }
    }

    if (isLoading) {
        return (
            <section className="main-section">
                <p>Tworzenie konta...</p>
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

    if (registerMessage) {
        return <p>{registerMessage}</p>
    }

    return (
    <section className="main-section">
        <h2 className="page-title">Stwórz nowe konto</h2>
        <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
                <label className="form-label">Nazwa użytkownika</label>
                <input
                    name="userName"
                    type="text"
                    className="form-input"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                />
            </div> 
            <div className="form-group">
                <label className="form-label">Hasło</label>
                <input
                    name="password"
                    type="password"
                    className="form-input"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label">Adres e-mail</label>
                <input
                    name="email"
                    type="text"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit" className="form-submit-btn">Stwórz konto</button>
        </form>
        <br/>
        <Link className="form-back-btn" to={`/`}>Powrót do strony głównej</Link>
    </section>
    )
}