import { NavLink, useNavigate } from "react-router";
import { useAuthStore } from "../stores/useAuthStore";

export function MainNavigation() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navigation">
      <div className="nav-left">
        <p className="nav-title">Salon samochodowy 🚗</p>
      </div>
      <div className="nav-center">
        <NavLink to="/" end 
          className={({ isActive }) => (isActive ? "nav-text-active" : "nav-text")}>
          Strona główna
        </NavLink>

        {user && (
          <>
            <NavLink to="/cars"
              className={({ isActive }) => (isActive ? "nav-text-active" : "nav-text")}>
              Samochody
            </NavLink>
            <NavLink to="/cars/new"
              className={({ isActive }) => (isActive ? "nav-text-active" : "nav-text")}>
              Dodaj nowy samochód
            </NavLink>
          </>
        )}
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <span className="nav-text">
              {user.userName}{" ("}{user.roles.join(", ")}{")"}
            </span>
            <button type="button" className="nav-text" onClick={handleLogout}>
              Wyloguj
            </button>
          </>
        ) : (
          <>
            <NavLink className="nav-text" to="/login">Logowanie</NavLink>
            <NavLink className="nav-text" to="/register">Rejestracja</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}