import { useState } from 'react';
import useCafeStore, { RoleType } from '../store/useCafeStore';

export interface LoginOverlayProps {
  onLogin?: (name: string, roomCode: string, role: RoleType) => void;
}

export function LoginOverlay({ onLogin }: LoginOverlayProps) {
  const { setUser } = useCafeStore();
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [role, setRole] = useState<RoleType>('male');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('لطفاً نام خود را وارد کنید');
      return;
    }
    if (!roomCode.trim()) {
      setError('لطفاً کد میز را وارد کنید');
      return;
    }
    setError('');
    setUser(name.trim(), roomCode.trim(), role);
    onLogin?.(name.trim(), roomCode.trim(), role);
  };

  return (
    <div
      dir="rtl"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(24, 14, 11, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        fontFamily: 'RooyinRegular, sans-serif',
      }}
    >
      <div
        style={{
          background: '#25150f',
          border: '1.5px solid rgba(240, 157, 56, 0.35)',
          borderRadius: 16,
          padding: '36px 32px',
          width: 340,
          maxWidth: '90vw',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
        }}
      >
        <h1 style={{ fontFamily: 'RooyinBold, sans-serif', fontSize: 24, color: '#f09d38', textAlign: 'center', margin: 0 }}>
          ورود به کافه خلوت ☕
        </h1>

        <div>
          <label style={{ display: 'block', fontSize: 13, color: '#f6e9d7', marginBottom: 6 }}>نام شما</label>
          <input
            type="text"
            placeholder="مثلاً: سهراب"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, color: '#f6e9d7', marginBottom: 6 }}>کد میز (اتاق)</label>
          <input
            type="text"
            placeholder="مثلاً: 101"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, color: '#f6e9d7', marginBottom: 6 }}>نقش کاراکتر</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={() => setRole('male')}
              style={roleBtnStyle(role === 'male')}
            >
              🎩 آقا
            </button>
            <button
              type="button"
              onClick={() => setRole('female')}
              style={roleBtnStyle(role === 'female')}
            >
              🌸 خانم
            </button>
          </div>
        </div>

        {error && (
          <p style={{ color: '#ff6b6b', fontSize: 12, margin: 0, textAlign: 'center' }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          style={{
            background: '#f09d38',
            color: '#180e0b',
            border: 'none',
            borderRadius: 8,
            padding: '12px 0',
            fontFamily: 'RooyinBold, sans-serif',
            fontSize: 16,
            cursor: 'pointer',
            marginTop: 4,
          }}
        >
          ورود به کافه
        </button>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#180e0b',
  border: '1px solid rgba(240, 157, 56, 0.4)',
  borderRadius: 8,
  padding: '9px 12px',
  color: '#f6e9d7',
  fontFamily: 'RooyinRegular, sans-serif',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
};

const roleBtnStyle = (selected: boolean): React.CSSProperties => ({
  flex: 1,
  padding: '10px 0',
  borderRadius: 8,
  border: `1.5px solid ${selected ? '#f09d38' : 'rgba(240,157,56,0.25)'}`,
  background: selected ? 'rgba(240,157,56,0.18)' : 'transparent',
  color: selected ? '#f09d38' : '#f6e9d7',
  fontFamily: 'RooyinBold, sans-serif',
  fontSize: 14,
  cursor: 'pointer',
});

export default LoginOverlay;
