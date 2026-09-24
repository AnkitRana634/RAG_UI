import React from 'react'
import Upload from '../components/Upload'

export default function UploadPage(){
  return (
    <section className="page-panel">
      <div className="page-header">
        <div>
          <p className="eyebrow">Knowledge Base</p>
          <h2>Upload Document</h2>
        </div>
      </div>
      <Upload />
    </section>
  )
}
