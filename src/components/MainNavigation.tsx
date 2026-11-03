import { NavLink } from "react-router";

export function MainNavigation() {
  return (
    <nav className="navigation">
        <NavLink
        to="/" end 
        className={({ isActive }) => (isActive ? "active" : undefined)}>
        Strona główna
        </NavLink>
        {" - "}
        <NavLink
        to="/cars"
        className={({ isActive }) => (isActive ? "active" : undefined)}>
        Samochody
        </NavLink>
        {" - "}
        <NavLink
        to="/cars/new"
        className={({ isActive }) => (isActive ? "active" : undefined)}>
        Dodaj nowy samochód
        </NavLink>
    </nav>
  );
}