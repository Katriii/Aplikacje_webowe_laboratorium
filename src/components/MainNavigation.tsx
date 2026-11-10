import { NavLink } from "react-router";

export function MainNavigation() {
  return (
    <nav className="navigation">
        <NavLink
        to="/" end 
        className={({ isActive }) => (isActive ? "nav-text-active" : "nav-text")}>
        Strona główna
        </NavLink>
        <NavLink
        to="/cars"
        className={({ isActive }) => (isActive ? "nav-text-active" : "nav-text")}>
        Samochody
        </NavLink>
        <NavLink
        to="/cars/new"
        className={({ isActive }) => (isActive ? "nav-text-active" : "nav-text")}>
        Dodaj nowy samochód
        </NavLink>
    </nav>
  );
}