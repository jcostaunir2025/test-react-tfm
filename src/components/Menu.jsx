import { NavLink } from "react-router-dom";

export default function Menu() {
  const items = [
    { to: "/", label: "Inicio" },
    { to: "/evaluaciones", label: "Evaluaciones" },
    { to: "/reportes", label: "Reportes" },
    { to: "/configuracion", label: "Configuración" },
    { to: "/ayuda", label: "Ayuda" },
  ];

  return (
    <nav className="bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex gap-6 py-3 justify-center overflow-x-auto">
          {items.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  (isActive ? "text-sky-600 font-semibold" : "text-slate-700") +
                  " hover:text-slate-900"
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}