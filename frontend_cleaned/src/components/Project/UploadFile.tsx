// src/components/Project/UploadFile.tsx
import React, { useState } from "react";
import { uploadFile } from "../../api/fileApi";

const UploadFile: React.FC<{ projectId: number }> = ({ projectId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return alert("Choose a file");
    try {
      const res = await uploadFile(projectId, file);
      setMsg("Upload successful");
      console.log("upload result", res);
    } catch (err: any) {
      console.error("upload failed", err);
      setMsg(err?.response?.data?.error || "Upload failed");
    }
  };

  return (
    <div className="p-3 border rounded bg-white">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button onClick={handleUpload} className="ml-2 bg-green-600 text-white px-3 rounded">Upload</button>
      {msg && <div className="mt-2 text-sm">{msg}</div>}
    </div>
  );
};

export default UploadFile;
