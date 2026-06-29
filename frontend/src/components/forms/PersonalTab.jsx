import { useState } from "react";
import api from "../../services/api";

export default function PersonalTab({ appId, onNext }) {
  const [form, setForm] = useState({
    passport_no: "",
    first_name: "",
    last_name: "",
    nationality: "",
    gender: "",
    birth_place: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await api.put(`/applications/${appId}/personal`, form);
      onNext();
    } catch {
      setError("Kaydedilemedi, bilgileri kontrol edip tekrar dene");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <input name="passport_no" placeholder="Pasaport No" value={form.passport_no}
        onChange={handleChange} className="border rounded p-2" />
      <input name="first_name" placeholder="Adı" value={form.first_name}
        onChange={handleChange} className="border rounded p-2" />
      <input name="last_name" placeholder="Soyadı" value={form.last_name}
        onChange={handleChange} className="border rounded p-2" />
      <input name="nationality" placeholder="Uyruk" value={form.nationality}
        onChange={handleChange} className="border rounded p-2" />
      <input name="gender" placeholder="Cinsiyet" value={form.gender}
        onChange={handleChange} className="border rounded p-2" />
      <input name="birth_place" placeholder="Doğum Yeri" value={form.birth_place}
        onChange={handleChange} className="border rounded p-2" />
      {error && <p className="col-span-2 text-red-500 text-sm">{error}</p>}
      <button onClick={handleSave} disabled={saving}
        className="col-span-2 bg-teal-600 text-white py-2 rounded mt-4 disabled:opacity-50">
        {saving ? "Kaydediliyor..." : "Kaydet ve İlerle"}
      </button>
    </div>
  );
}