import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const [apps, setApps] = useState([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const url = filter
      ? `/applications/staff/all?status=${filter}`
      : `/applications/staff/all`;
    api.get(url).then((res) => setApps(res.data));
  }, [filter]);

  return (
    <div className="p-8">
      <h1 className="text-xl font-medium mb-4">Başvuru Yönetimi</h1>
      <select
        onChange={(e) => setFilter(e.target.value)}
        className="border rounded p-2 mb-4"
      >
        <option value="">Tümü</option>
        <option value="submitted">Gönderildi</option>
        <option value="approved">Onaylandı</option>
        <option value="rejected">Reddedildi</option>
      </select>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Ad Soyad</th>
            <th className="p-2">Uyruk</th>
            <th className="p-2">AI Skoru</th>
            <th className="p-2">Durum</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {apps.map((a) => (
            <tr key={a.id} className="border-b">
              <td className="p-2">{a.first_name} {a.last_name}</td>
              <td className="p-2">{a.nationality}</td>
              <td className="p-2">{a.ai_score ?? "-"}</td>
              <td className="p-2">{a.status}</td>
              <td className="p-2">
                <button
                  onClick={() => navigate(`/admin/applications/${a.id}`)}
                  className="text-teal-600 underline"
                >
                  İncele
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}