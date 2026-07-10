import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function ApplicationDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    api.get(`/applications/${id}/full`).then((res) => setData(res.data));
  }, [id]);

  const decide = async (decision) => {
    await api.put(`/applications/${id}/decision`, { decision, note });
    alert("Karar kaydedildi");
    const res = await api.get(`/applications/${id}/full`);
    setData(res.data);
  };

  if (!data) return <p className="p-8">Yükleniyor...</p>;

  const { application, documents } = data;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="bg-white border rounded-lg p-4">
        <h2 className="font-medium mb-2">Kişisel Bilgiler</h2>
        <p>
          {application.first_name} {application.last_name} — {application.nationality}
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h2 className="font-medium mb-2">AI Değerlendirmesi</h2>
        <p className="text-2xl font-medium">{application.ai_score ?? "-"}/100</p>
        <p className="text-sm mt-2">{application.ai_summary ?? "Henüz değerlendirilmedi."}</p>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h2 className="font-medium mb-2">Belgeler</h2>
        {documents.map((d) => (
          <div key={d.id} className="flex justify-between text-sm border-b py-2">
            <span>{d.doc_type}</span>
            <span className={d.is_valid ? "text-teal-600" : "text-amber-600"}>
              {d.is_valid ? "Doğrulandı" : "Kontrol edilmeli"}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h2 className="font-medium mb-2">Karar</h2>
        <p className="text-sm text-gray-500 mb-2">
          Mevcut durum: <span className="font-medium">{application.status}</span>
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Not ekle (opsiyonel)"
          className="w-full border rounded p-2 mb-3"
        />
        <div className="flex gap-2">
          <button
            onClick={() => decide("approved")}
            className="bg-teal-600 text-white px-4 py-2 rounded"
          >
            Onayla
          </button>
          <button
            onClick={() => decide("rejected")}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Reddet
          </button>
        </div>
      </div>
    </div>
  );
}