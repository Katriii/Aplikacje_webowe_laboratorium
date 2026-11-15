import { useState, type ChangeEvent, type SyntheticEvent} from "react";
import { Link } from "react-router";
import { forgotPassword } from "../services/authService";
import axios from "axios";

export default function ForgotPasswordPage() {
    const [recoveryEmail, setRecoveryEmail] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
        setRecoveryEmail(event.target.value);
    }

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            setIsSubmitting(true);
            setError(null);
            const result = await forgotPassword(recoveryEmail);
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

    return (
    <section className="main-section">
        <h2 className="page-title">Zmiana hasła</h2>
        {message && <p>{message}</p>}
        {error && (
        <p className="error-message">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
                <label className="form-label">Podaj mail do resetu hasła</label>
                <input type="text" className="form-input" value={recoveryEmail}
                onChange={handleEmailChange} required
                />
            </div>
            <button type="submit" className="form-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? "Wysyłanie..." : "Wyślij maila"}
            </button>
        </form>
        <Link className="form-back-btn" to="/">Powrót do strony głównej</Link>
    </section>
    );
}