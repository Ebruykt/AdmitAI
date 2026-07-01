import { useState, useRef, useEffect } from "react";
import api from "../services/api";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Merhaba! Başvuru süreciyle ilgili sorularını cevaplayabilirim." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.post("/chat/", { message: input });
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Bir hata oluştu, tekrar dene." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg bg-white flex flex-col h-[480px] w-96 shadow-lg">
      <div className="bg-teal-600 text-white p-3 rounded-t-lg font-medium">
        Akıllı Başvuru Asistanı
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`rounded-lg px-3 py-2 text-sm max-w-[80%] ${
              m.role === "user" ? "bg-teal-600 text-white" : "bg-gray-100"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <p className="text-xs text-gray-400">Yazıyor...</p>}
        <div ref={bottomRef} />
      </div>
      <div className="flex border-t p-2 gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded px-2 py-1 text-sm"
          placeholder="Sorunu yaz..."
        />
        <button onClick={sendMessage} className="bg-teal-600 text-white px-3 rounded text-sm">
          Gönder
        </button>
      </div>
    </div>
  );
}