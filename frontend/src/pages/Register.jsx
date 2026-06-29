import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", full_name: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);
      localStorage.setItem("token", res.data.access_token);
      onLogin();
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Kayıt sırasında bir hata oluştu");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-xl font-medium mb-6">Kayıt Ol</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          name="full_name" placeholder="Ad Soyad" value={form.full_name}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-3"
        />
        <input
          name="email" type="email" placeholder="Email" value={form.email}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-3"
        />
        <input
          name="password" type="password" placeholder="Şifre" value={form.password}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4"
        />
        <button className="w-full bg-teal-600 text-white py-2 rounded">Kayıt Ol</button>
        <p className="text-sm text-center mt-4">
          Zaten hesabın var mı? <Link to="/login" className="text-teal-600">Giriş yap</Link>
        </p>
      </form>
    </div>
  );
}