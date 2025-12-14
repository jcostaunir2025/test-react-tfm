import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/vite.svg" alt="logo" className="h-8 w-8" />
          <span className="text-xl font-extrabold text-slate-900">Docmed</span>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-slate-700">{user.username}</span>
              <button
                onClick={logout}
                className="px-3 py-2 border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md"
            >
              Iniciar sesión
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}