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
        <div className="card shadow-lg border-0 mb-2 animate-fade-in-up"
          style={{ width: 360, height: 500, borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 16px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="d-flex align-items-center">
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                <i className="bi bi-robot text-white"></i>
              </div>
              <div>
                <div className="fw-bold text-white" style={{ fontSize: 14 }}>FixIt Bot</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Online · Ask me anything</div>
              </div>
            </div>
            <button className="btn btn-sm text-white p-0" onClick={() => setOpen(false)}><i className="bi bi-x-lg"></i></button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 12, background: 'var(--bg)' }}>
            {messages.map((m, i) => (
              <div key={i} className={`d-flex ${m.role === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-2 animate-fade-in-up`}>
                <div className="px-3 py-2" style={{
                  maxWidth: '85%',
                  borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: m.role === 'user' ? 'var(--primary)' : 'var(--card-bg)',
                  color: m.role === 'user' ? 'var(--text-white)' : 'var(--text)',
                  fontSize: 13,
                  lineHeight: 1.5,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  whiteSpace: 'pre-wrap',
                  border: m.role === 'bot' ? '1px solid var(--border)' : 'none',
                }}>{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="d-flex justify-content-start mb-2">
                <div className="px-3 py-2" style={{ borderRadius: '16px 16px 16px 4px', background: 'var(--card-bg)', fontSize: 13, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid var(--border)' }}>
                  <div className="d-flex gap-1">
                    <span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', display: 'inline-block' }}></span>
                    <span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', display: 'inline-block', animationDelay: '0.2s' }}></span>
                    <span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', display: 'inline-block', animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)', background: 'var(--card-bg)' }}>
            <div className="d-flex flex-wrap gap-1 mb-2">
              {quickReplies.map((q, i) => (
                <button key={i} className="btn btn-sm"
                  style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', border: 'none', borderRadius: 20, fontSize: 11, fontWeight: 600 }}
                  onClick={() => sendMessage(q.text)}>
                  <i className={`bi ${q.icon} me-1`}></i>{q.text}
                </button>
              ))}
            </div>
            <div className="input-group">
              <input type="text" className="form-control" style={{ borderRadius: 20, border: '1px solid var(--border)', fontSize: 13, background: 'var(--input-bg)', color: 'var(--text)' }}
                placeholder="Type a message..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} />
              <button className="btn btn-sm" style={{ borderRadius: 20, background: 'var(--primary)', color: 'var(--text-white)', border: 'none', marginLeft: 4, padding: '6px 14px' }}
                onClick={() => sendMessage()} disabled={loading}>
                <i className="bi bi-send"></i>
              </button>
            </div>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)}
        style={{ width: 56, height: 56, borderRadius: '50%', border: 'none', background: 'var(--primary)', color: 'var(--text-white)', fontSize: 24, boxShadow: '0 4px 15px rgba(124,58,237,0.35)', cursor: 'pointer', transition: 'transform 0.3s', transform: open ? 'rotate(45deg)' : 'none' }}>
        <i className={`bi ${open ? 'bi-x' : 'bi-chat-dots'}`}></i>
      </button>
    </div>
  );
}
