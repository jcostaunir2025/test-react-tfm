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
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h2 className="text-xl mb-4">Login</h2>
      {step === 1 && (
        <form onSubmit={handleSubmit}>
          <input
            className="w-full p-2 border mb-2"
            placeholder="Usuario"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="password"
            className="w-full p-2 border mb-2"
            placeholder="Contraseña"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {error && <p className="text-red-500">{error}</p>}
          <button className="w-full bg-indigo-600 text-white py-2">
            Continuar
          </button>
        </form>
      )}
      {step === 2 && <MFAValidate />}
    </div>
  );
}