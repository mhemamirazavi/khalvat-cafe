import { io, type Socket } from 'socket.io-client';
import type { Message, RoleType } from '../store/useCafeStore';
export interface MovementPacket {
  roomCode: string; senderId: string; role: RoleType;
  x: number; y: number; isSitting: boolean; sequence: number;
}
/** Integration contract: configure VITE_SOCKET_URL; server must authorize room membership. */
class SocketService {
  private socket?: Socket;
  private roomCode = '';
  private messages = new Set<(message: Message) => void>();
  private movements = new Set<(movement: MovementPacket) => void>();
  connect() {
    const url = import.meta.env.VITE_SOCKET_URL;
    if (!url || this.socket) return;
    this.socket = io(url, { autoConnect: false, transports: ['websocket', 'polling'] });
    this.socket.on('connect', () => this.socket?.emit('join_room', { roomCode: this.roomCode }));
    this.socket.on('chat_message', (m: Message & {roomCode?: string}) => {
      if (m?.roomCode !== this.roomCode || typeof m.id !== 'string' || typeof m.text !== 'string') return;
      this.messages.forEach(fn => fn(m));
    });
    this.socket.on('player_moved', (m: MovementPacket) => {
      if (m?.roomCode === this.roomCode) this.movements.forEach(fn => fn(m));
    });
    this.socket.connect();
  }
  joinRoom(roomCode: string) {
    if (roomCode === this.roomCode) return;
    this.socket?.emit('leave_room', { roomCode: this.roomCode });
    this.roomCode = roomCode;
    this.socket?.emit('join_room', { roomCode });
  }
  sendMessage(message: Message) { this.socket?.emit('chat_message', { ...message, roomCode: this.roomCode }); }
  sendMovement(m: MovementPacket) { if (this.socket?.connected) this.socket.emit('player_moved', m); }
  onChatMessage(fn: (m: Message) => void) { this.messages.add(fn); return () => { this.messages.delete(fn); }; }
  onMovement(fn: (m: MovementPacket) => void) { this.movements.add(fn); return () => { this.movements.delete(fn); }; }
  disconnect() { this.socket?.disconnect(); this.socket = undefined; }
}
export default new SocketService();
