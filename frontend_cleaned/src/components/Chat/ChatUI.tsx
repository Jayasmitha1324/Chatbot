// src/components/Chat/ChatUI.tsx
import React, { useEffect, useRef, useState } from "react";
import axios from "../../api/axiosInstance";
import { listPrompts } from "../../api/promptApi";

type Message = { userMsg: string; botMsg: string; createdAt?: string };

const Avatar = ({ type }: { type: "user"|"bot" }) => (
  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${type==="user" ? "bg-sky-500 text-white" : "bg-gray-200 text-gray-800"}`}>
    {type === "user" ? "You" : "🤖"}
  </div>
);

const ChatUI: React.FC<{ projectId: number }> = ({ projectId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [selectedPromptId, setSelectedPromptId] = useState<number | "">("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`/chat/${projectId}`);
      setMessages(res.data || []);
    } catch (err) {
      console.error("history error", err);
    }
  };

  const fetchPrompts = async () => {
    try {
      const res = await axios.get(`/projects/${projectId}/prompts`);
      setPrompts(res.data || []);
    } catch (err) {
      console.error("prompts error", err);
    }
  };

  useEffect(() => {
    if (!projectId) return;
    fetchHistory();
    fetchPrompts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, typing]);

  const send = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages(prev => [...prev, { userMsg: userMessage, botMsg: "..." }]);
    setInput("");
    setLoading(true);
    setTyping(true);

    try {
      const payload:any = { projectId, prompt: userMessage };
      if (selectedPromptId) payload.promptId = selectedPromptId;

      const res = await axios.post("/chat", payload);
      const botText = res.data?.response ?? "(no response)";
      setMessages(prev => {
        const copy = [...prev];
        const idx = copy.map(c => c.botMsg).lastIndexOf("...");
        if (idx >= 0) copy[idx] = { ...copy[idx], botMsg: botText };
        else copy.push({ userMsg: "", botMsg: botText });
        return copy;
      });
    } catch (err) {
      console.error("send error", err);
      setMessages(prev => {
        const copy = [...prev];
        const idx = copy.map(c => c.botMsg).lastIndexOf("...");
        if (idx >= 0) copy[idx] = { ...copy[idx], botMsg: "Error: failed to get reply" };
        return copy;
      });
    } finally {
      setLoading(false);
      setTyping(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col h-full shadow rounded bg-white">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="text-lg font-semibold">Project Chat</div>
        <div className="flex items-center gap-2">
          <select className="border px-2 py-1 rounded text-sm" value={selectedPromptId} onChange={e => setSelectedPromptId(e.target.value ? Number(e.target.value) : "")}>
            <option value="">(No Prompt)</option>
            {prompts.map(p => <option key={p.id} value={p.id}>{p.name || p.content.slice(0,20)}</option>)}
          </select>
          <button className="text-sm px-3 py-1 bg-sky-600 text-white rounded" onClick={fetchPrompts}>Refresh</button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto space-y-4 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className="flex gap-3 items-start">
            <Avatar type={i % 2 === 0 ? "user" : "bot"} />
            <div>
              <div className={`${i % 2 === 0 ? "bg-sky-50 border-sky-200" : "bg-white border-gray-200"} border rounded-lg p-3 max-w-xl`}>
                <div className="whitespace-pre-wrap text-sm text-gray-800">{i % 2 === 0 ? m.userMsg : m.botMsg}</div>
              </div>
              <div className="text-xs text-gray-400 mt-1">{m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}</div>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex gap-3 items-start">
            <Avatar type="bot" />
            <div className="bg-white border rounded-lg p-3">
              <div className="flex gap-1 items-center">
                <span className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-200"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-400"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 border-t">
        <div className="flex gap-2">
          <input className="flex-1 border rounded px-3 py-2 focus:outline-none" placeholder="Type a message and press Enter" value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKeyDown} disabled={loading} />
          <button onClick={send} className="bg-sky-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? "Sending..." : "Send"}</button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
export {};