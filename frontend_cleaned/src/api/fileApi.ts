import axios from "./axiosInstance";

export const uploadFile = async (projectId: number, file: File) => {
  const form = new FormData();
  form.append("file", file); // just the file
  const res = await axios.post(`/files/${projectId}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
