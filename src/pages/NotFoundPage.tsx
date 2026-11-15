import {Link} from "react-router";

export default function NotFoundPage() {
    return (
        <section className="main-page-section">
            <h1 className="page-title">404: Nie znaleziono strony 🚗💥🚙</h1>
            <br/>
            <Link className="form-back-btn" to={`/`}>Powrót do strony głównej</Link>
        </section>
    )
}