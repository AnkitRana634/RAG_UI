import React from 'react'
import Chat from '../components/Chat'

export default function ChatPage(){
  return (
    <section className="page-panel">
      <div className="page-header">
        <div>
          <p className="eyebrow">AI Workspace</p>
          <h2>Chat / Agent</h2>
        </div>
      </div>
      <Chat />
    </section>
  )
}
