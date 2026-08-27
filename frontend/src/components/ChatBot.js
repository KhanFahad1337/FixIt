import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

import API from '../config';

const quickReplies = [
  { text: 'Find an electrician', icon: 'bi-lightning' },
  { text: 'Cheapest providers', icon: 'bi-currency-dollar' },
  { text: 'Top rated', icon: 'bi-star' },
  { text: 'How to book?', icon: 'bi-question-circle' },
  { text: 'Contact support', icon: 'bi-headset' },
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I\'m FixIt Bot. Ask me about services, providers, or anything about FixIt!' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    const history = messages.filter(m => m.text).map(m => ({ role: m.role, text: m.text }));
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post(`${API}/chatbot/chat`, { message: msg, history });
      setMessages(prev => [...prev, { role: 'bot', text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I had trouble connecting. Try again!' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') sendMessage(); };

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}>
      {open && (
        <div className="animate-scale-in" style={{
          width: 370, height: 520,
          borderRadius: 20, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          background: 'var(--card-bg)',
          border: '1px solid var(--glass-border)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px var(--glass-border)',
          marginBottom: 12,
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 18px',
            background: 'var(--gradient-1)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}></div>
            <div className="d-flex align-items-center" style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginRight: 10, backdropFilter: 'blur(4px)',
              }}>
                <i className="bi bi-robot text-white"></i>
              </div>
              <div>
                <div className="fw-bold text-white" style={{ fontSize: 14 }}>FixIt Bot</div>
                <div className="d-flex align-items-center gap-1" style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }}></span>
                  Online · Ask me anything
                </div>
              </div>
            </div>
            <button className="btn btn-sm text-white p-0" style={{ position: 'relative', zIndex: 1 }} onClick={() => setOpen(false)}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 14, background: 'var(--bg)' }}>
            {messages.map((m, i) => (
              <div key={i} className={`d-flex ${m.role === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-2 animate-fade-in-up`}>
                {m.role === 'bot' && (
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: 'var(--gradient-1)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    marginRight: 8, flexShrink: 0, marginTop: 2,
                  }}>
                    <i className="bi bi-robot text-white" style={{ fontSize: '0.7rem' }}></i>
                  </div>
                )}
                <div className="px-3 py-2" style={{
                  maxWidth: '80%',
                  borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: m.role === 'user' ? 'var(--gradient-1)' : 'var(--card-bg)',
                  color: m.role === 'user' ? 'white' : 'var(--text)',
                  fontSize: 13, lineHeight: 1.6,
                  boxShadow: m.role === 'user' ? '0 4px 12px rgba(var(--primary-rgb), 0.25)' : '0 2px 8px rgba(0,0,0,0.06)',
                  whiteSpace: 'pre-wrap',
                  border: m.role === 'bot' ? '1px solid var(--border)' : 'none',
                }}>{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="d-flex justify-content-start mb-2">
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'var(--gradient-1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  marginRight: 8, flexShrink: 0, marginTop: 2,
                }}>
                  <i className="bi bi-robot text-white" style={{ fontSize: '0.7rem' }}></i>
                </div>
                <div className="px-3 py-2" style={{
                  borderRadius: '16px 16px 16px 4px',
                  background: 'var(--card-bg)',
                  fontSize: 13,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '10px 14px',
                }}>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Replies + Input */}
          <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', background: 'var(--card-bg)' }}>
            <div className="d-flex flex-wrap gap-1 mb-2">
              {quickReplies.map((q, i) => (
                <button key={i} className="btn btn-sm chat-quick-reply"
                  style={{ borderRadius: 20, fontSize: 11, fontWeight: 600, padding: '4px 10px' }}
                  onClick={() => sendMessage(q.text)}>
                  <i className={`bi ${q.icon} me-1`}></i>{q.text}
                </button>
              ))}
            </div>
            <div className="input-group">
              <input type="text" className="form-control" style={{
                borderRadius: 20, border: '1.5px solid var(--border)',
                fontSize: 13, background: 'var(--input-bg)', color: 'var(--text)',
                paddingLeft: 14, transition: 'var(--transition)',
              }}
                placeholder="Type a message..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} />
              <button className="btn btn-sm" style={{
                borderRadius: 20,
                background: 'var(--gradient-1)',
                color: 'white', border: 'none',
                marginLeft: 6, padding: '6px 16px',
                boxShadow: '0 2px 8px rgba(var(--primary-rgb), 0.3)',
                transition: 'var(--transition)',
              }}
                onClick={() => sendMessage()} disabled={loading}>
                <i className="bi bi-send"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button onClick={() => setOpen(!open)} style={{
        width: 58, height: 58, borderRadius: '50%', border: 'none',
        background: 'var(--gradient-1)', color: 'white',
        fontSize: 24, cursor: 'pointer',
        boxShadow: '0 6px 24px rgba(var(--primary-rgb), 0.4)',
        transition: 'var(--transition-bounce)',
        transform: open ? 'rotate(135deg) scale(0.95)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <i className={`bi ${open ? 'bi-x-lg' : 'bi-chat-dots-fill'}`}></i>
      </button>
    </div>
  );
}
