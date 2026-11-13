import { useState } from 'react';
import useCafeStore, { WeatherType } from '../store/useCafeStore';
import { EventBus } from '../game/EventBus';

const WEATHER_OPTIONS: { value: WeatherType; label: string }[] = [
  { value: 'rain', label: '🌧️ باران' },
  { value: 'autumn', label: '🍂 پاییز' },
  { value: 'snow', label: '❄️ برف' },
];

export function TopHud() {
  const { myName, myRole, roomCode, gridX, gridY, isSitting, weather, setWeather, isMuted, toggleMute } = useCafeStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectWeather = (next: WeatherType) => {
    setWeather(next);
    EventBus.emit('weather_changed', next);
  };

  const currentWeather = WEATHER_OPTIONS.find((w) => w.value === weather);
  const roleIcon = myRole === 'female' ? '🌸 خانم' : '🎩 آقا';

  return (
    <header
      dir="rtl"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 52,
        background: 'rgba(24, 14, 11, 0.90)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(240, 157, 56, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 40,
        color: '#f6e9d7',
        fontFamily: 'RooyinRegular, sans-serif',
      }}
    >
      {/* راست: مشخصات کاربر و نقش */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: '#f09d38', fontFamily: 'RooyinBold, sans-serif', fontSize: 15 }}>
          کافه خلوت ☕
        </span>
        <span style={{ fontSize: 13, background: 'rgba(240, 157, 56, 0.15)', padding: '2px 8px', borderRadius: 6 }}>
          {roleIcon} {myName || 'مهمان'}
        </span>
      </div>

      {/* وسط: موقعیت شطرنجی و وضعیت نشستن */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
        <span style={{ color: '#f09d38' }}>موقعیت:</span>
        <span dir="ltr">[{gridX}, {gridY}]</span>
        {isSitting && (
          <span style={{ background: '#4e2b19', color: '#ffd166', padding: '1px 8px', borderRadius: 12, fontSize: 11 }}>
            🪑 نشسته
          </span>
        )}
      </div>

      {/* چپ: کد میز و انتخاب آب‌وهوا */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ color: '#f6e9d7', fontSize: 13 }}>
          میز: <strong style={{ color: '#f09d38' }}>{roomCode || '۱'}</strong>
        </span>

        <button
          onClick={toggleMute}
          aria-label={isMuted ? 'روشن کردن صدای محیط' : 'قطع صدای محیط'}
          title={isMuted ? 'روشن کردن صدای محیط' : 'قطع صدای محیط'}
          aria-pressed={isMuted}
          style={{
            background: isMuted ? 'rgba(37, 21, 15, 0.9)' : 'rgba(240, 157, 56, 0.18)',
            border: '1px solid rgba(240, 157, 56, 0.4)',
            color: '#f6e9d7',
            borderRadius: 8,
            padding: '4px 9px',
            fontSize: 14,
            lineHeight: 1,
            cursor: 'pointer',
          }}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => selectWeather(WEATHER_OPTIONS[(WEATHER_OPTIONS.findIndex(w => w.value === weather) + 1) % 3].value)}
            title="تغییر آب‌وهوا"
            style={{
              background: 'rgba(37, 21, 15, 0.9)',
              border: '1px solid rgba(240, 157, 56, 0.4)',
              color: '#f6e9d7',
              borderRadius: 8,
              padding: '4px 10px',
              fontFamily: 'RooyinRegular, sans-serif',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {currentWeather?.label ?? '🌧️ باران'}
          </button>

          <button onClick={() => setDropdownOpen(!dropdownOpen)} aria-label="انتخاب آب‌وهوا" style={{ color: '#f09d38', background: 'none', border: 0 }}>▾</button>
          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '120%',
                left: 0,
                background: '#25150f',
                border: '1px solid #f09d38',
                borderRadius: 8,
                overflow: 'hidden',
                zIndex: 60,
                boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
              }}
            >
              {WEATHER_OPTIONS.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    selectWeather(opt.value);
                    setDropdownOpen(false);
                  }}
                  style={{
                    padding: '8px 14px',
                    cursor: 'pointer',
                    fontSize: 13,
                    color: opt.value === weather ? '#f09d38' : '#f6e9d7',
                    background: opt.value === weather ? 'rgba(240,157,56,0.15)' : 'transparent',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopHud;
