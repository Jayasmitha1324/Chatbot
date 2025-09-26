// src/components/Auth/Login.tsx
import React, { useState } from "react";
import { loginUser } from "../../api/authApi";

const Login: React.FC<{ onLogin: (token: string) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      if (data?.token) {
        // store token in localStorage using key "token" (axiosInstance expects this)
        localStorage.setItem("token", data.token);
        onLogin(data.token);
      } else {
        setError(data?.error || "Login failed");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.response?.data?.error || "Network or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
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
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default Login;
