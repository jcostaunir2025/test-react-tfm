import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import MFAValidate from "./MFAValidate";

export default function LoginPage() {
  const { loginStepOne } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      loginStepOne(form);
      setStep(2);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container-max mt-10 flex justify-center">
      <div className="feature-card w-full max-w-md">
        <h2 className="text-xl mb-4">Login</h2>
        {step === 1 && (
          <form onSubmit={handleSubmit}>
            <input
              className="w-full p-3 border rounded mb-3"
              placeholder="Usuario"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <input
              type="password"
              className="w-full p-3 border rounded mb-3"
              placeholder="Contraseña"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <button className="w-full bg-sky-600 hover:bg-sky-500 text-white py-3 rounded">
              Continuar
            </button>
          </form>
        )}
        {step === 2 && <MFAValidate />}
      </div>
    </div>
  );
}