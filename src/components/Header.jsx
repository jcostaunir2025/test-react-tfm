import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-indigo-600 text-white p-4 flex justify-between">
      <div className="font-bold text-xl">React MFA App</div>
      {user && (
        <div className="flex gap-4 items-center">
          <span>{user.username}</span>
          <button
            onClick={logout}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  );
}