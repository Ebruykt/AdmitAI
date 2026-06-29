import { useState, useEffect } from "react";
import api from "../services/api";
import PersonalTab from "../components/forms/PersonalTab";
import HighSchoolTab from "../components/forms/HighSchoolTab";
import ContactTab from "../components/forms/ContactTab";
import PreferencesTab from "../components/forms/PreferencesTab";
import DocumentUpload from "../components/DocumentUpload";
import ProgressBar from "../components/ProgressBar";

const TABS = ["Kişisel Bilgiler", "Lise Eğitim Bilgileri", "İletişim", "Belgeler", "Sınav", "Tercih"];

export default function Application() {
  const [activeTab, setActiveTab] = useState(0);
  const [appId, setAppId] = useState(localStorage.getItem("appId"));

  useEffect(() => {
    if (!appId) {
      api.post("/applications/").then((res) => {
        localStorage.setItem("appId", res.data.id);
        setAppId(res.data.id);
      });
    }
  }, [appId]);

  if (!appId) return <p className="p-8">Başvuru hazırlanıyor...</p>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <ProgressBar currentStep={activeTab} totalSteps={TABS.length} />
      <div className="flex border-b mb-6">
        {TABS.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 text-sm ${
              activeTab === i ? "border-b-2 border-teal-600 font-medium" : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {activeTab === 0 && <PersonalTab appId={appId} onNext={() => setActiveTab(1)} />}
      {activeTab === 1 && <HighSchoolTab appId={appId} onNext={() => setActiveTab(2)} />}
      {activeTab === 2 && <ContactTab appId={appId} onNext={() => setActiveTab(3)} />}
      {activeTab === 3 && <DocumentUpload applicationId={appId} />}
      {activeTab === 5 && <PreferencesTab appId={appId} />}
    </div>
  );
}