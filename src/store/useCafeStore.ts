import { create } from 'zustand';

// مختصات گرید تاپ‌داون 3/4: اتاق 12x10 — دیوار در ردیف‌های 0 و 1، صندلی‌ها در (5,5) و (7,5)
const walkableTile = (x: number, y: number) => x >= 0 && x < 12 && y >= 2 && y < 10;
const isChairTile = (x: number, y: number) => y === 5 && (x === 5 || x === 7);

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  role?: RoleType;
  replyTo?: {
    id: string;
    text: string;
    senderName: string;
  };
}

export type RoleType = 'male' | 'female';
export type WeatherType = 'rain' | 'autumn' | 'snow';

export interface ReplyTarget {
  id: string;
  text: string;
  senderName: string;
}

export interface PeerState {
  name: string;
  role: RoleType;
  x: number;
  y: number;
  isSitting: boolean;
}

interface CafeState {
  // User info
  myName: string;
  myRole: RoleType;
  roomCode: string;
  isLoggedIn: boolean;

  // Isometric Grid Position & State
  gridX: number;
  gridY: number;
  isSitting: boolean;

  // Peer (second character)
  peerName: string;
  peerRole: RoleType;
  peerX: number;
  peerY: number;
  peerIsSitting: boolean;
  peerIsOnline: boolean;

  // Chat & Communication
  messages: Message[];
  replyingTo: Message | null;

  // Environment
  weather: WeatherType;
  isMuted: boolean;

  // Actions
  setUser: (name: string, roomCode: string, role: RoleType) => void;
  setGridPos: (gridX: number, gridY: number) => void;
  setIsSitting: (isSitting: boolean) => void;
  setPlayerPosition: (x: number, y: number, isSitting: boolean) => void;
  setPeer: (peer: PeerState) => void;
  setPeerOnline: (online: boolean) => void;
  addMessage: (msg: Omit<Message, 'id' | 'timestamp'> & { id?: string; timestamp?: number }) => void;
  receiveMessage: (msg: Message) => void;
  setReplyingTo: (reply: Message | null) => void;
  setWeather: (weather: WeatherType) => void;
  toggleMute: () => void;
  logout: () => void;
}

const initialUserState = {
  myName: '',
  myRole: 'male' as RoleType,
  roomCode: '',
  isLoggedIn: false,
  gridX: 2,
  gridY: 2,
  isSitting: false,
};

const initialPeerState = {
  peerName: '',
  peerRole: 'female' as RoleType,
  peerX: 6,
  peerY: 5,
  peerIsSitting: false,
  peerIsOnline: false,
};

export const useCafeStore = create<CafeState>()((set) => ({
  ...initialUserState,
  ...initialPeerState,
  messages: [],
  replyingTo: null,
  weather: 'rain',
  isMuted: false,

  setUser: (name, roomCode, role) =>
    set({
      myName: name,
      myRole: role,
      roomCode,
      isLoggedIn: true,
      gridX: role === 'female' ? 5 : 7,
      gridY: 5,
      isSitting: true,
    }),

  setGridPos: (gridX, gridY) => {
    if (walkableTile(gridX, gridY)) set({ gridX, gridY, isSitting: false });
  },
  setPlayerPosition: (gridX, gridY, isSitting) => {
    if (walkableTile(gridX, gridY))
      set({ gridX, gridY, isSitting: isSitting && isChairTile(gridX, gridY) });
  },

  setIsSitting: (isSitting) => set({ isSitting }),

  setPeer: ({ name, role, x, y, isSitting }) =>
    set({
      peerName: name,
      peerRole: role,
      peerX: x,
      peerY: y,
      peerIsSitting: isSitting,
      peerIsOnline: true,
    }),

  setPeerOnline: (online) =>
    set(online ? { peerIsOnline: true } : { ...initialPeerState }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...msg,
          id: msg.id || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          timestamp: msg.timestamp || Date.now(),
        },
      ],
    })),

  receiveMessage: (msg) =>
    set((state) => {
      if (state.messages.some((m) => m.id === msg.id)) return state;
      return { messages: [...state.messages, msg] };
    }),

  setReplyingTo: (reply) => set({ replyingTo: reply }),

  setWeather: (weather) => set({ weather }),

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  logout: () =>
    set({
      ...initialUserState,
      ...initialPeerState,
      messages: [],
      replyingTo: null,
    }),
}));

export default useCafeStore;
