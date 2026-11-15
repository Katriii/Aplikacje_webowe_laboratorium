import { useEffect, useState } from "react";
import { Link, useSearchParams} from "react-router";
import { confirmEmail } from "../services/authService";

export default function ConfirmEmailPage() {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("userId");
    const token = searchParams.get("token");
    const [message, setMessage] = useState("Potwierdzanie konta...");
    
    useEffect(() => {
        if (!userId || !token) {
            return;
        }

        async function confirm() {
            try {
                const result = await confirmEmail(userId!, token!);
                setMessage(result);
            }
            catch {
                setMessage("Nie udało się potwierdzić konta.");
            }
        }
        confirm();
    }, [userId, token]);

    if (!userId || !token) {
        return (
        <section className="main-section">
            <p>Nieprawidłowy link</p>
            <Link className="form-back-btn" to="/login">Przejdź do logowania</Link>
        </section>
        );
    }

    return (
    <section className="main-section">
        <h2 className="page-title">Potwierdzenie konta</h2>
        <p>{message}</p>
        <Link className="form-back-btn" to="/login">Przejdź do logowania</Link>
    </section>
    );
}