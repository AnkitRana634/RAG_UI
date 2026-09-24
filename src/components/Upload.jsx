import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadFile } from '../api'

export default function Upload(){
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function handleSubmit(e){
    e.preventDefault();
    setError(null);
    setResult(null);
    if(!file) return setError('Please select a file');
    setLoading(true);
    try{
      await uploadFile(file);
      setResult({ success: true, message: 'File uploaded successfully. You can now chat with the agent to ask questions based on this document.' });
    }catch(err){
      setError(err.message);
    }finally{ setLoading(false); }
  }

  return (
    <div className="card upload-panel">
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={e=>setFile(e.target.files?.[0] ?? null)} />
        <div className="actions">
          <button type="submit" disabled={loading}>Upload</button>
        </div>
      </form>

      {loading && <p>Uploading...</p>}
      {error && <p className="error">{error}</p>}

      {result?.success && (
        <div className="success-overlay">
          <div className="success-popup">
            <div className="success-icon">✓</div>
            <h3>Upload successful</h3>
            <p>{result.message}</p>
            <div className="success-actions">
              <button type="button" onClick={() => navigate('/chat')}>Go to Chat</button>
              <button type="button" className="secondary-btn" onClick={() => setResult(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
