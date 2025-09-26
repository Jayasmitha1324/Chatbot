// src/components/Chat/ChatInterface.tsx
import React, { useEffect, useState } from "react";
import { chatWithAgent, getChatHistory } from "../../api/chatApi";
import { listPrompts } from "../../api/promptApi";

const ChatInterface: React.FC<{ projectId: number }> = ({ projectId }) => {
  const [messages, setMessages] = useState<{ userMsg: string; botMsg: string }[]>([]);
  const [input, setInput] = useState("");
  const [prompts, setPrompts] = useState<any[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      const data = await getChatHistory(projectId);
      setMessages(
        (data || []).map((m: any) => ({
          userMsg: m.userMessage ?? "",
          botMsg: m.botMessage ?? "",
        }))
      );
    } catch (err) {
      console.error("get history", err);
    }
  };

  const fetchPrompts = async () => {
    try {
      const data = await listPrompts(projectId);
      setPrompts(data || []);
    } catch (err) {
      console.error("list prompts", err);
    }
  };

  useEffect(() => {
    if (!projectId) return;
    fetchHistory();
    fetchPrompts();
  }, [projectId]);

  const handleSend = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const resp = await chatWithAgent(projectId, input, selectedPrompt?.id);
      setMessages([...messages, { userMsg: input, botMsg: resp.response }]);
      setInput("");
    } catch (err) {
      console.error("chat error", err);
      setMessages([...messages, { userMsg: input, botMsg: "Error: failed to get reply" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 border rounded bg-white">
      <div className="mb-2">
        <label className="mr-2">Prompt:</label>
        <select value={selectedPrompt?.id ?? ""} onChange={(e) => {
          const id = e.target.value ? parseInt(e.target.value) : undefined;
          setSelectedPrompt(prompts.find(p => p.id === id) ?? null);
        }}>
          <option value="">(none)</option>
          {prompts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div className="h-64 overflow-y-auto mb-3 p-2 border bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className="mb-2">
            <div><strong>You:</strong> {m.userMsg}</div>
            <div className="text-blue-800"><strong>Bot:</strong> {m.botMsg}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input className="flex-1 border p-2 rounded" value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message" />
        <button onClick={handleSend} className="bg-indigo-600 text-white px-4 rounded" disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
