import { useState, useRef, useEffect } from 'react';
import useCafeStore, { Message } from '../store/useCafeStore';
import { EventBus } from '../game/EventBus';
import socketService from '../services/socketService';
import { ChatMessageItem } from './ChatMessageItem';

export function ChatPanel() {
  const { messages, replyingTo, setReplyingTo, addMessage, receiveMessage, myName, myRole, roomCode } = useCafeStore();
  const [text, setText] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socketService.joinRoom(roomCode);
    socketService.connect();
    const unsub = socketService.onChatMessage((incomingMsg: Message) => {
      const seen = useCafeStore.getState().messages.some(m => m.id === incomingMsg.id);
      receiveMessage(incomingMsg);
      if (!seen && incomingMsg.role) EventBus.emit('chat_bubble', { role: incomingMsg.role, text: incomingMsg.text });
    });
    return () => unsub();
  }, [receiveMessage, roomCode]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    const newMsg: Message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      senderId: myName || 'user',
      role: myRole,
      senderName: myName || 'شما',
      text: text.trim(),
      timestamp: Date.now(),
      replyTo: replyingTo ? { id: replyingTo.id, text: replyingTo.text, senderName: replyingTo.senderName } : undefined,
    };

    addMessage(newMsg);
    socketService.sendMessage(newMsg);
    EventBus.emit('chat_message_sent', text.trim());
    EventBus.emit('chat_bubble', { role: myRole, text: text.trim() });

    setText('');
    setReplyingTo(null);
  };

  const triggerAction = (emoji: string) => {
    EventBus.emit('show_reaction', { emoji, isMe: true });
  };

  if (isMinimized) {
    return (
      <div dir="rtl" style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 40 }}>
        <button
          onClick={() => setIsMinimized(false)}
          style={{
            background: '#25150f',
            border: '1.5px solid #f09d38',
            color: '#f6e9d7',
            padding: '10px 16px',
            borderRadius: 24,
            cursor: 'pointer',
            fontFamily: 'RooyinBold, sans-serif',
            boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
          }}
        >
          💬 چت کافه ({messages.length})
        </button>
      </div>
    );
  }

  return (
    <aside
      dir="rtl"
      style={{
        position: 'fixed',
        right: 0,
        top: 52,
        bottom: 0,
        width: 310,
        background: 'rgba(37, 21, 15, 0.94)',
        backdropFilter: 'blur(10px)',
        borderLeft: '1px solid rgba(240, 157, 56, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 35,
        fontFamily: 'RooyinRegular, sans-serif',
        color: '#f6e9d7',
      }}
    >
      {/* هدر چت با دکمه‌های اکشن */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(240, 157, 56, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'RooyinBold, sans-serif', color: '#f09d38', fontSize: 14 }}>💬 چت خلوت</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button onClick={() => triggerAction('☕')} title="نوشیدن قهوه" style={actionBtnStyle}>☕</button>
          <button onClick={() => triggerAction('❤️')} title="ابراز علاقه" style={actionBtnStyle}>❤️</button>
          <button onClick={() => triggerAction('👋')} title="دست تکان دادن" style={actionBtnStyle}>👋</button>
          <button onClick={() => setIsMinimized(true)} title="بستن پنل" style={actionBtnStyle}>⚊</button>
        </div>
      </div>

      {/* لیست پیام‌ها */}
      <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'rgba(246, 233, 215, 0.4)', fontSize: 13, marginTop: 40 }}>
            هنوز پیامی رد و بدل نشده است...
          </div>
        )}
        {messages.map((m) => (
          <ChatMessageItem
            key={m.id}
            msg={m}
            isOwn={m.senderName === myName || m.senderId === myName}
            onReply={(target) => setReplyingTo({ id: target.id, text: target.text, senderName: target.senderName, senderId: '', timestamp: 0 })}
          />
        ))}
      </div>

      {/* ورودی پیام */}
      <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(240, 157, 56, 0.2)', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {replyingTo && (
          <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(240, 157, 56, 0.1)', padding: '4px 8px', borderRadius: 4, fontSize: 12, borderRight: '2px solid #f09d38' }}>
            <span>↩ ریپلای به {replyingTo.senderName}: {replyingTo.text.slice(0, 30)}</span>
            <button onClick={() => setReplyingTo(null)} style={{ background: 'none', border: 'none', color: '#f09d38', cursor: 'pointer' }}>✕</button>
          </div>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            placeholder="پیامت رو بنویس..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && handleSend()}
            style={{ flex: 1, background: '#180e0b', border: '1px solid rgba(240, 157, 56, 0.4)', color: '#f6e9d7', borderRadius: 8, padding: '8px 10px', fontSize: 13, outline: 'none' }}
          />
          <button onClick={handleSend} style={{ background: '#f09d38', color: '#180e0b', border: 'none', borderRadius: 8, padding: '0 14px', fontFamily: 'RooyinBold, sans-serif', cursor: 'pointer' }}>
            ارسال
          </button>
        </div>
      </div>
    </aside>
  );
}

const actionBtnStyle: React.CSSProperties = {
  background: 'rgba(240, 157, 56, 0.15)',
  border: '1px solid rgba(240, 157, 56, 0.35)',
  borderRadius: 6,
  padding: '3px 8px',
  cursor: 'pointer',
  fontSize: 14,
  color: '#f6e9d7',
};

export default ChatPanel;
