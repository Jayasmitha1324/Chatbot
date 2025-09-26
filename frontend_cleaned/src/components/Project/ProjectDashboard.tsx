// src/components/Project/ProjectDashboard.tsx
import React, { useEffect, useState } from "react";
import { createProject, listProjects } from "../../api/projectApi";

const ProjectDashboard: React.FC<{ onSelect: (id: number) => void }> = ({ onSelect }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    try {
      const data = await listProjects();
      setProjects(data || []);
    } catch (err) {
      console.error("Load projects", err);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleCreate = async () => {
    if (!name) return alert("Project name required");
    setLoading(true);
    try {
      const p = await createProject(name);
      setProjects([p, ...projects]);
      setName("");
    } catch (err) {
      console.error("Create project", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 border rounded bg-white">
      <h3 className="font-bold mb-2">🚀 Your Projects</h3>
      <div className="flex gap-2 mb-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Project"
          className="border p-1 rounded flex-1"
        />
        <button onClick={handleCreate} className="bg-blue-600 text-white px-3 rounded">
          {loading ? "..." : "Create"}
        </button>
      </div>
      <ul>
        {projects.map((p) => (
          <li
            key={p.id}
            className="py-2 border-b cursor-pointer"
            onClick={() => onSelect(p.id)}
          >
            <div className="font-medium">{p.name}</div>
            <div className="text-sm text-gray-500">{p.createdAt?.slice(0, 10)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectDashboard;
