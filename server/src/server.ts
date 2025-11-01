import http from 'http';
import { Server } from 'socket.io';
import app from "./app"
import dotenv from 'dotenv'
import { connectDB } from "./config/database.config";
import {MessageService} from './services';
import { IMessageRepository,MessageRepository } from './repositories';
dotenv.config()
const PORT = process.env.PORT || 5050;
const CLIENT_URL = process.env.CLIENT_URL ;
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin:'*' }, 
}); 
const messageRepo =new MessageRepository()
const messageService= new MessageService(messageRepo);
io.on('connection', (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

  // Join user-specific room (for private messaging)
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Handle message sending
  socket.on('send_message', async (data) => {
    // data: { senderId, receiverId, text }

    // Save message to DB
    const savedMessage = await messageService.sendMessage(data);

    // Emit message to receiver (real-time)
    io.to(data.receiverId).emit('receive_message', savedMessage);
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});
(async () => {
    await connectDB();
    server.listen(PORT, () => {
        console.log(`Server running on ${PORT}`)
    })
})()