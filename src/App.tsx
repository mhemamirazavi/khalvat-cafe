import { CafeGame } from './components/CafeGame';
import { LoginOverlay } from './components/LoginOverlay';
import { TopHud } from './components/TopHud';
import { ChatPanel } from './components/ChatPanel';
import useCafeStore from './store/useCafeStore';

export function App() {
  const { isLoggedIn } = useCafeStore();

  return (
    <div
      id="app"
      dir="rtl"
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#180e0b',
        fontFamily: 'RooyinRegular, sans-serif',
      }}
    >
      {/* جهان ایزومتریک دوبعدی Phaser */}
      <CafeGame />

      {/* رابط کاربری روی بازی */}
      {!isLoggedIn && <LoginOverlay />}

      {isLoggedIn && (
        <>
          <TopHud />
          <ChatPanel />
        </>
      )}
    </div>
  );
}

export default App;
