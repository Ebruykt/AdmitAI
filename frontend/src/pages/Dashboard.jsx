import { useNavigate } from "react-router-dom";
import Chatbot from "../components/Chatbot";

export default function Dashboard({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
    navigate("/login");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Hoş geldin!</h1>
        <button onClick={handleLogout} className="text-red-600 text-sm">Çıkış Yap</button>
      </div>
      <p className="text-gray-600 mb-6">AdmitAI başvuru paneline hoş geldin.</p>
      <button
        onClick={() => navigate("/application")}
        className="bg-teal-600 text-white px-4 py-2 rounded"
      >
        Başvuru Yap
      </button>

      <div className="fixed bottom-6 right-6">
        <Chatbot />
      </div>
    </div>
  );
}