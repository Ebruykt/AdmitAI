import { useState, useEffect } from "react";
import api from "../../services/api";

export default function PreferencesTab({ appId }) {
  const [choices, setChoices] = useState([]);
  const [faculty, setFaculty] = useState("");
  const [program, setProgram] = useState("");
  const [error, setError] = useState("");

  const addChoice = async () => {
    if (choices.length >= 4) return;
    setError("");
    try {
      const res = await api.post(`/applications/${appId}/choices`, {
        faculty,
        program_name: program,
        priority_order: choices.length + 1,
      });
      setChoices([...choices, res.data]);
      setFaculty("");
      setProgram("");
    } catch {
      setError("Eklenemedi, en fazla 4 program seçebilirsin");
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input value={faculty} onChange={(e) => setFaculty(e.target.value)}
          placeholder="Fakülte" className="border rounded p-2 flex-1" />
        <input value={program} onChange={(e) => setProgram(e.target.value)}
          placeholder="Program Adı" className="border rounded p-2 flex-1" />
        <button onClick={addChoice} disabled={choices.length >= 4}
          className="bg-teal-600 text-white px-4 rounded disabled:opacity-50">
          Ekle
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <table className="w-full border text-sm">
        <tbody>
          {choices.map((c, i) => (
            <tr key={c.id} className="border-b">
              <td className="p-2">{i + 1}</td>
              <td className="p-2">{c.faculty} - {c.program_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {choices.length >= 4 && (
        <p className="text-sm text-gray-500 mt-2">En fazla 4 program seçtin.</p>
      )}
    </div>
  );
}