import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Login({ onLogin}) { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", res.data.access_token);
        if (res.data.user.role === "staff") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } catch {
        setError("Email veya şifre hatalı");
      }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-xl font-medium mb-6">Giriş Yap</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded p-2 mb-3"
        />
        <input
          type="password" placeholder="Şifre" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />
        <button className="w-full bg-teal-600 text-white py-2 rounded">Giriş</button>
        <p className="text-sm text-center mt-4">
          Hesabın yok mu? <Link to="/register" className="text-teal-600">Kayıt ol</Link>
        </p>
      </form>
    </div>
  );
}