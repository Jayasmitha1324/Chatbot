// src/pages/Dashboard.tsx
import React, { useState } from "react";
import ProjectDashboard from "../components/Project/ProjectDashboard";
import PromptManager from "../components/Project/PromptManager";
import UploadFile from "../components/Project/UploadFile";
import ChatInterface from "../components/Chat/ChatInterface";

const Dashboard: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<any | null>(null);

  return (
    <div className="p-8 grid grid-cols-3 gap-6">
      <div className="col-span-1">
        <ProjectDashboard onSelect={(id) => setSelectedProject(id)} />
      </div>
      <div className="col-span-1">
        {selectedProject ? (
          <>
            <h3 className="font-semibold mb-2">Prompts</h3>
            <PromptManager projectId={selectedProject} onSelect={(p) => setSelectedPrompt(p)} />
            <h3 className="font-semibold mt-4 mb-2">Upload File</h3>
            <UploadFile projectId={selectedProject} />
          </>
        ) : (
          <div className="p-3 border rounded bg-white">Select a project to manage prompts and files</div>
        )}
      </div>
      <div className="col-span-1">
        {selectedProject ? (
          <>
            <h3 className="font-semibold mb-2">Chat</h3>
            <ChatInterface projectId={selectedProject} />
          </>
        ) : (
          <div className="p-3 border rounded bg-white">Select a project to chat with the agent</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
