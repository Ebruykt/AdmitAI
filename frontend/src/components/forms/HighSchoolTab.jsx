import { useState } from "react";
import api from "../../services/api";

export default function HighSchoolTab({ appId, onNext }) {
  const [form, setForm] = useState({
    high_school_name: "",
    high_school_country: "",
    gpa: "",
    graduation_date: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await api.put(`/applications/${appId}/highschool`, {
        ...form,
        gpa: parseFloat(form.gpa),
      });
      onNext();
    } catch {
      setError("Kaydedilemedi, bilgileri kontrol edip tekrar dene");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <input name="high_school_name" placeholder="Mezun Olduğu Lise Adı" value={form.high_school_name}
        onChange={handleChange} className="border rounded p-2 col-span-2" />
      <input name="high_school_country" placeholder="Ülke" value={form.high_school_country}
        onChange={handleChange} className="border rounded p-2" />
      <input name="gpa" type="number" step="0.01" placeholder="Not Ortalaması" value={form.gpa}
        onChange={handleChange} className="border rounded p-2" />
      <input name="graduation_date" type="date" value={form.graduation_date}
        onChange={handleChange} className="border rounded p-2 col-span-2" />
      {error && <p className="col-span-2 text-red-500 text-sm">{error}</p>}
      <button onClick={handleSave} disabled={saving}
        className="col-span-2 bg-teal-600 text-white py-2 rounded mt-4 disabled:opacity-50">
        {saving ? "Kaydediliyor..." : "Kaydet ve İlerle"}
      </button>
    </div>
  );
}