import { useState } from "react";
import api from "../../services/api";

export default function ContactTab({ appId, onNext }) {
  const [form, setForm] = useState({
    country: "",
    city: "",
    district: "",
    address: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await api.put(`/applications/${appId}/contact`, form);
      onNext();
    } catch {
      setError("Kaydedilemedi, bilgileri kontrol edip tekrar dene");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <input name="country" placeholder="Ülke" value={form.country}
        onChange={handleChange} className="border rounded p-2" />
      <input name="city" placeholder="İl" value={form.city}
        onChange={handleChange} className="border rounded p-2" />
      <input name="district" placeholder="İlçe" value={form.district}
        onChange={handleChange} className="border rounded p-2" />
      <input name="phone" placeholder="Telefon" value={form.phone}
        onChange={handleChange} className="border rounded p-2" />
      <input name="address" placeholder="Adres" value={form.address}
        onChange={handleChange} className="border rounded p-2 col-span-2" />
      {error && <p className="col-span-2 text-red-500 text-sm">{error}</p>}
      <button onClick={handleSave} disabled={saving}
        className="col-span-2 bg-teal-600 text-white py-2 rounded mt-4 disabled:opacity-50">
        {saving ? "Kaydediliyor..." : "Kaydet ve İlerle"}
      </button>
    </div>
  );
}