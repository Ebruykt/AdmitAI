import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function ApplicationDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/applications/${id}/full`).then((res) => setData(res.data));
  }, [id]);

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
    </div>
  );
}