import React, { useEffect, useRef, useState } from 'react'
import { chat } from '../api'

function normalizeResponse(resp){
  if(typeof resp === 'string'){
    try {
      const parsed = JSON.parse(resp)
      return typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2)
    } catch {
      return resp
    }
  }

  return typeof resp === 'object' ? JSON.stringify(resp, null, 2) : String(resp ?? '')
}

export default function Chat(){
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const animationRef = useRef(null)
  const chatRef = useRef(null)
  const stopRequestedRef = useRef(false)
  const abortControllerRef = useRef(null)

  useEffect(() => {
    if(chatRef.current){
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages, draft, loading])

  useEffect(() => {
    return () => {
      if(animationRef.current && typeof animationRef.current.cancel === 'function'){
        animationRef.current.cancel()
      }
      if(abortControllerRef.current){
        abortControllerRef.current.abort()
      }
    }
  }, [])

  function stopTyping(){
    stopRequestedRef.current = true
    if(animationRef.current && typeof animationRef.current.cancel === 'function'){
      animationRef.current.cancel()
    }
    if(abortControllerRef.current){
      abortControllerRef.current.abort()
    }
    setLoading(false)
  }

  function typeStream(fullText, messageId){
    if(animationRef.current && typeof animationRef.current.cancel === 'function'){
      animationRef.current.cancel()
    }

    stopRequestedRef.current = false
    let index = 0
    const interval = setInterval(() => {
      if(stopRequestedRef.current){
        clearInterval(interval)
        setLoading(false)
        return
      }

      index += 1
      setMessages(prev => prev.map(msg => {
        if(msg.id !== messageId) return msg
        return { ...msg, text: fullText.slice(0, index) }
      }))

      if(index >= fullText.length) {
        clearInterval(interval)
        setLoading(false)
      }
    }, 18)

    animationRef.current = { cancel: () => clearInterval(interval) }
  }

  async function handleSubmit(e){
    e.preventDefault()
    const trimmed = draft.trim()
    setError(null)

    if(!trimmed) return setError('Please enter a question')
    if(loading) return

    const userMessage = { id: Date.now(), role: 'user', text: trimmed }
    const assistantId = Date.now() + 1

    setMessages(prev => [...prev, userMessage])
    setDraft('')
    setLoading(true)

    try{
      abortControllerRef.current = new AbortController()
      const data = await chat(trimmed, abortControllerRef.current.signal)
      const response = normalizeResponse(data?.response ?? data)

      if(!response || response.trim() === '') {
        setLoading(false)
        return
      }

      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', text: '' }])
      typeStream(response, assistantId)
    }catch(err){
      if(err?.name === 'AbortError') return
      setError(err.message)
      setLoading(false)
    }
  }

  const isStreaming = loading

  return (
    <div className="card chat-panel">
      <div ref={chatRef} className="chat-thread">
        {messages.length === 0 && (
          <div className="empty-thread">Ask a question to begin the conversation.</div>
        )}

        {messages
          .filter(msg => !(msg.role === 'assistant' && msg.text === ''))
          .map(msg => (
            <div key={msg.id} className={`message-row ${msg.role}`}>
              <div className="message-bubble">
                {msg.text}
                {msg.role === 'assistant' && msg.text && !stopRequestedRef.current && <span className="typing-cursor" aria-hidden="true">|</span>}
              </div>
            </div>
          ))}
      </div>

      <form onSubmit={handleSubmit} className="chat-form">
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Ask anything..."
          className="chat-textarea"
          disabled={loading}
        />

        <div className="actions">
          <button
            type={isStreaming ? 'button' : 'submit'}
            className={isStreaming ? 'stop-btn' : ''}
            onClick={isStreaming ? stopTyping : undefined}
            disabled={false}
            aria-label={isStreaming ? 'Stop response' : 'Send message'}
          >
            {isStreaming ? '■' : 'Send'}
          </button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  )
}
