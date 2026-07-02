import { useState, useRef, useEffect } from "react";
import api from "../services/api";

const DOC_TYPES = [
  { key: "diploma", label: "Lise Diploması (Aslı)" },
  { key: "transcript", label: "Lise Transkript (Aslı)" },
  { key: "passport", label: "Pasaport" },
];

export default function DocumentUpload({ applicationId }) {
  const [uploaded, setUploaded] = useState({});
  const [uploading, setUploading] = useState({});
  const [missing, setMissing] = useState([]);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const fileInputs = useRef({});

  const checkMissing = async () => {
    const res = await api.get(`/applications/${applicationId}/missing`);
    setMissing(res.data.missing);
  };

  useEffect(() => {
    checkMissing();
  }, []);

  const handleUpload = async (docType, file) => {
    if (!file) return;
    setUploading({ ...uploading, [docType]: true });
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post(
        `/documents/upload?application_id=${applicationId}&doc_type=${docType}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setUploaded({ ...uploaded, [docType]: res.data });
      await checkMissing();
    } catch {
      alert("Yükleme başarısız, tekrar dene");
    } finally {
      setUploading({ ...uploading, [docType]: false });
    }
  };

  const handleSubmit = async () => {
    setSubmitError("");
    try {
      await api.post(`/applications/${applicationId}/submit`);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.response?.data?.detail || "Gönderilemedi");
    }
  };

  return (
    <div>
      <div className="space-y-3">
        {DOC_TYPES.map((d) => (
          <div
            key={d.key}
            className="flex items-center justify-between border rounded-lg p-4"
          >
            <span className="font-medium">{d.label}</span>
            <div className="flex items-center gap-3">
              {uploading[d.key] && (
                <span className="text-gray-400 text-sm">Yükleniyor...</span>
              )}
              {uploaded[d.key] && !uploading[d.key] && (
                <span className={`text-sm font-medium ${
                  uploaded[d.key].is_valid ? "text-teal-600" : "text-amber-600"
                }`}>
                  {uploaded[d.key].is_valid ? "✓ Doğrulandı" : "⚠ Kontrol edilmeli"}
                </span>
              )}
              <input
                type="file"
                ref={(el) => (fileInputs.current[d.key] = el)}
                onChange={(e) => handleUpload(d.key, e.target.files[0])}
                className="hidden"
              />
              <button
                onClick={() => fileInputs.current[d.key]?.click()}
                disabled={uploading[d.key]}
                className={`px-4 py-2 rounded font-medium text-sm transition-colors disabled:opacity-50 ${
                  uploaded[d.key]
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
              >
                {uploaded[d.key] ? "Değiştir" : "Dosya Seç"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {!submitted ? (
        <div className="mt-6">
          {missing.length > 0 && (
            <p className="text-amber-600 text-sm mb-3">
              Eksik belgeler: {missing.join(", ")}
            </p>
          )}
          {submitError && (
            <p className="text-red-500 text-sm mb-3">{submitError}</p>
          )}
          <button
            onClick={handleSubmit}
            disabled={missing.length > 0}
            className="bg-teal-600 text-white px-6 py-2 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Başvurumu Gönder
          </button>
        </div>
      ) : (
        <p className="mt-6 text-teal-600 font-medium">
          ✓ Başvurun başarıyla gönderildi.
        </p>
      )}
    </div>
  );
}