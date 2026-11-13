import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('کافه خلوت سرور رله چت در حال اجراست ☕');
});

io.on('connection', (socket) => {
  console.log(`[Socket] کلاینت متصل شد: ${socket.id}`);

  // دریافت پیام چت و پخش (broadcast) آن به بقیه کلاینت‌ها
  socket.on('chat_message', (message) => {
    console.log('[Socket] رله پیام چت:', message);
    socket.broadcast.emit('chat_message', message);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] کلاینت قطع شد: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`سرور کافه خلوت روی پورت ${PORT} آماده به کار است. ☕`);
});
