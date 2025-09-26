// src/components/Auth/Register.tsx
import React, { useState } from "react";
import { registerUser } from "../../api/authApi";

const Register: React.FC<{ onRegister: (token: string) => void }> = ({ onRegister }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await registerUser(name, email, password);
      if (data?.token) {
        localStorage.setItem("token", data.token);
        onRegister(data.token);
      } else {
        setError(data?.error || "Registration failed");
      }
    } catch (err: any) {
      console.error("Register error", err);
      setError(err?.response?.data?.error || "Network or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full name"
        required
        className="border p-2 w-full rounded"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="border p-2 w-full rounded"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
        required
        className="border p-2 w-full rounded"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default Register;
