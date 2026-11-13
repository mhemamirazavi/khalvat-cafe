# Khalvat Cafe (کافه خلوت) - AI Agent Guidelines

## 1. Architecture & Tech Stack
- **UI & Overlays:** React 18 + TypeScript + Tailwind CSS (RTL layout `dir="rtl"`).
- **2D Isometric World:** Phaser 3 (`src/game/scenes/`).
- **State Bridge:** Zustand (`src/store/useCafeStore.ts`) + EventBus for React-Phaser communication.
- **Audio Engine:** Howler.js (`src/services/audioManager.ts`). NEVER use raw Web Audio API OscillatorNodes without proper cleanup.
- **Local DB:** Dexie.js (`src/services/dbService.ts`) wrapping IndexedDB.
- **Realtime Network:** Socket.io-client (`src/services/socketService.ts`). NEVER use public MQTT brokers (`broker.emqx.io`) or Base64 file streaming over sockets.

## 2. Typography & Styling Rules
- Primary Heading/UI Font: `RooyinBold` (`src/assets/fonts/RooyinFree-Bold.ttf`).
- Primary Body/Chat Font: `RooyinRegular` (`src/assets/fonts/RooyinFree-Regular.ttf`).
- Color Palette: Warm cozy dark espresso (`#180e0b`), dark wood (`#25150f`), amber glow (`#f09d38`), soft cream (`#f6e9d7`).

## 3. Modularity Rule (Strict)
- Keep every file under 200 lines of code.
- Each modal (Gramophone, Archive, CoffeeMenu) and each UI section (ChatPanel, TopHud, LoginOverlay) MUST be in its own separate `.tsx` file.
- Never delete existing features when editing a file.