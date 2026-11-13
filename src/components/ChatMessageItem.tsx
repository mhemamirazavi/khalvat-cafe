import React from 'react';
import { Message, ReplyTarget } from '../store/useCafeStore';

const COLORS = {
  espresso: '#180e0b',
  amber: '#f09d38',
  cream: '#f6e9d7',
};

const msgWrapperStyle = (isOwn: boolean): React.CSSProperties => ({
  display: 'flex',
  justifyContent: isOwn ? 'flex-start' : 'flex-end',
  cursor: 'pointer',
});

const msgBubbleStyle = (isOwn: boolean): React.CSSProperties => ({
  maxWidth: '80%',
  padding: '8px 12px',
  borderRadius: isOwn ? '12px 12px 12px 4px' : '12px 12px 4px 12px',
  background: isOwn ? 'rgba(240, 157, 56, 0.20)' : 'rgba(24, 14, 11, 0.50)',
  border: '1px solid rgba(240, 157, 56, 0.12)',
  direction: 'rtl',
});

interface ChatMessageItemProps {
  msg: Message;
  isOwn: boolean;
  onReply: (target: ReplyTarget) => void;
}

export function ChatMessageItem({ msg, isOwn, onReply }: ChatMessageItemProps) {
  const handleClick = () => {
    onReply({ id: msg.id, text: msg.text, senderName: msg.senderName });
  };

  return (
    <div style={msgWrapperStyle(isOwn)} onClick={handleClick} title="برای ریپلای کلیک کنید">
      <div style={msgBubbleStyle(isOwn)}>
        <div style={{ fontFamily: 'RooyinBold, serif', fontSize: 12, color: COLORS.amber, marginBottom: 3 }}>
          {msg.senderName}
        </div>
        {msg.replyTo && (
          <div
            style={{
              background: 'rgba(240, 157, 56, 0.10)',
              borderRight: `3px solid ${COLORS.amber}`,
              borderRadius: '4px 6px 6px 4px',
              padding: '4px 8px',
              marginBottom: 6,
              fontSize: 12,
              color: COLORS.cream,
              fontFamily: 'RooyinRegular, serif',
              opacity: 0.85,
            }}
          >
            ↩ {msg.replyTo.senderName}: {msg.replyTo.text.slice(0, 50)}
          </div>
        )}
        <div style={{ fontFamily: 'RooyinRegular, serif', fontSize: 14, color: COLORS.cream, lineHeight: 1.5 }}>
          {msg.text}
        </div>
      </div>
    </div>
  );
}

export default ChatMessageItem;
