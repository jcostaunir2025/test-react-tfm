import { NavLink } from "react-router-dom";

export default function Menu() {
  const items = [
    { to: "/", label: "INICIO" },
    { to: "/evaluaciones", label: "EVALUACIONES" },
    { to: "/reportes", label: "REPORTES" },
    { to: "/configuracion", label: "CONFIGURACIÓN" },
    { to: "/ayuda", label: "AYUDA" },
  ];

  return (
    <nav className="bg-indigo-500 text-white p-3 flex gap-6">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            isActive ? "underline font-semibold" : ""
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}