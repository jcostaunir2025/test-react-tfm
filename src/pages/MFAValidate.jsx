import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MFAValidate() {
  const { validateMFA } = useAuth();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      validateMFA(code);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="w-full p-2 border mb-2"
        placeholder="Código MFA"
        onChange={(e) => setCode(e.target.value)}
      />
      {error && <p className="text-red-500">{error}</p>}
      <button className="w-full bg-indigo-600 text-white py-2">
        Validar
      </button>
    </form>
  );
}