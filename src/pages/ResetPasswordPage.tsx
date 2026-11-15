import { useState, type ChangeEvent, type SyntheticEvent} from "react";
import { Link, useSearchParams} from "react-router";
import { resetPassword} from "../services/authService";
import axios from "axios";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const token = searchParams.get("token");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
        setNewPassword(event.target.value);
    }

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!email || !token) {
            return;
        }
        try {
            setIsSubmitting(true);
            setError(null);
            const result = await resetPassword(email, token, newPassword);
            setMessage(result);
        }
        catch (caughtError) {
            if (axios.isAxiosError(caughtError)) {
                setError(caughtError.response?.data);
            }
            else if (caughtError instanceof Error) {
                setError(caughtError.message);
            }
            else {
                setError("Nie udało się zmienić hasła.",);
            }
        }
        finally {
            setIsSubmitting(false);
        }
    }

    if (!email || !token) {
        return (
        <section className="main-section">
            <h2>Nieprawidłowy link</h2>
            <Link className="form-back-btn" to="/login">Wróć do logowania</Link>
        </section>
        );
    }
    return (
    <section className="main-section">
        <h2 className="page-title">Ustaw nowe hasło</h2>
        {message && <p>{message}</p>}
        {error && (
        <p className="error-message">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
                <label className="form-label">Nowe hasło</label>
                <input type="password" className="form-input" value={newPassword}
                onChange={handlePasswordChange} required
                />
            </div>
            <button type="submit" className="form-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? "Zapisywanie..." : "Zmień hasło"}
            </button>
        </form>
    </section>
    );
}