import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router";
import { login } from "../services/authService";
import { useAuthStore } from "../stores/useAuthStore";
import axios from "axios";

export default function LoginPage() {
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }
    function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
    }
    
    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            setIsSubmitting(true);
            setError(null);
            const user = await login({email, password});
            setUser(user);
            navigate("/cars");
        }
        catch (caughtError) {
            if (axios.isAxiosError(caughtError)) {
                setError(caughtError.response?.data);
            }
            else if (caughtError instanceof Error) {
                setError(caughtError.message);
            }
            else {
                setError("Nie udało się zalogować.");
            }
        }
        finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="main-section">
            <h2 className="page-title">Logowanie</h2>
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">E-mail</label>
                    <input type="email" className="form-input" value={email}
                        onChange={handleEmailChange} required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Hasło</label>
                    <input type="password" className="form-input" value={password}
                        onChange={handlePasswordChange} required
                    />
                </div>
                {error && (
                <p className="error-message">{error}</p>
                )}
                <button type="submit" className="form-submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? "Logowanie..." : "Zaloguj"}
                </button>
            </form>
            <div className="login-item-actions">
                <p>
                    <Link className="form-back-btn" to="/forgot-password">Nie pamiętasz hasła?</Link>
                </p>
                <p>
                    Nie masz konta?{" "}
                    <Link className="form-back-btn" to="/register">Zarejestruj się</Link>
                </p>
            </div>
        </section>
    );
}