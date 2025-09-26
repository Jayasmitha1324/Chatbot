// src/components/Project/PromptManager.tsx
import React, { useEffect, useState } from "react";
import { createPrompt, listPrompts } from "../../api/promptApi";

const PromptManager: React.FC<{ projectId: number; onSelect: (p: any) => void }> = ({ projectId, onSelect }) => {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const fetch = async () => {
    if (!projectId) return;
    try {
      const data = await listPrompts(projectId);
      setPrompts(data || []);
    } catch (err) {
      console.error("list prompts", err);
    }
  };

  useEffect(() => {
    fetch();
  }, [projectId]);

  const handleCreate = async () => {
    if (!content) return alert("Enter prompt content");
    try {
      const p = await createPrompt(projectId, name || "Untitled", content);
      setPrompts([p, ...prompts]);
      setName("");
      setContent("");
    } catch (err) {
      console.error("create prompt", err);
    }
  };

  return (
    <div className="p-3 border rounded bg-white">
      <h4 className="font-semibold mb-2">Prompts</h4>
      <div className="flex gap-2 my-2">
        <input className="border p-1 flex-1" placeholder="Prompt name" value={name} onChange={e=>setName(e.target.value)} />
        <button onClick={handleCreate} className="bg-sky-600 text-white px-3 rounded">Create</button>
      </div>
      <textarea className="w-full border p-2" placeholder="Prompt content" value={content} onChange={e=>setContent(e.target.value)} />
      <ul className="mt-3">
        {prompts.map(p => (
          <li key={p.id} className="py-2 border-b cursor-pointer" onClick={() => onSelect(p)}>
            <div className="font-medium">{p.name}</div>
            <div className="text-sm text-gray-600">{p.content?.slice(0,120)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PromptManager;
