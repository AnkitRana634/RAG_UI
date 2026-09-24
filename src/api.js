export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export async function chat(question, signal){
  const url = `${API_BASE}/api/Chat/ChatWithOllama?question=${encodeURIComponent(question)}`;
  const res = await fetch(url, { signal });
  if(!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export async function uploadFile(file, signal){
  const url = `${API_BASE}/api/Document`;
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(url, { method: 'POST', body: fd, signal });
  if(!res.ok){
    const text = await res.text();
    throw new Error(text || `Upload failed ${res.status}`);
  }
  return res.json();
}
