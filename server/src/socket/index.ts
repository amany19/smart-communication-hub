import { Server as SocketIOServer, Socket } from 'socket.io';
import http from 'http';
import { MessageRepository, UserRepository } from '../repositories';
import { MessageService, UserService } from '../services';

interface CustomSocket extends Socket {
  user_id?: string;
}

const onlineUsers = new Map<string, string>();
const userRepo = new UserRepository();
const userService = new UserService(userRepo);
const messageRepo = new MessageRepository();
const messageService = new MessageService(messageRepo);

export const initSocket = (server: http.Server) => {
  const io = new SocketIOServer(server, {
    cors: { 
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    },
  });

  io.on('connection', async (socket: CustomSocket) => {
    console.log('✅ Socket connected:', socket.id);

    socket.on('userOnline', async (user_id: string) => {
      try {
        onlineUsers.set(user_id, socket.id);
        socket.join(`user:${user_id}`);
        socket.user_id = user_id;

        await userService.updateUser(user_id, { isOnline: true });
        
        // Debug logging
        console.log(`🏠 User ${user_id} joined room: user:${user_id}`);
        console.log(`📊 Online users:`, Array.from(onlineUsers.keys()));
        
        io.emit('updateOnlineStatus', { user_id, isOnline: true });
        console.log(`🟢 User ${user_id} is now online`);
      } catch (error) {
        console.error('❌ Error in userOnline:', error);
      }
    });

    socket.on('sendMessage', async (data) => {
      try {
        console.log(data)
        const { sender_id, receiver_id, text } = data;
        console.log(`📨 Message from ${sender_id} to ${receiver_id}: ${text}`);

        const savedMessage = await messageService.sendMessage(data);
        
        // ✅ FIXED: Use socket.to() for targeted messaging
        console.log("✅ EMIT TO",receiver_id )
        socket.to(`user:${receiver_id}`).emit('receiveMessage', savedMessage);
        console.log(`✅ Message delivered to room: user:${receiver_id}`);
        
        // Send confirmation to sender
        socket.emit('messageSent', savedMessage);
        
      } catch (error) {
        console.error('❌ Error sending message:', error);
        socket.emit('messageError', { error: 'Failed to send message' });
      }
    });

    socket.on('disconnect', async (reason) => {
      try {
        const user_id = socket.user_id;
        if (user_id) {
          const lastSeen = new Date();
          await userRepo.updateUser(user_id, { isOnline: false, lastSeen });
          onlineUsers.delete(user_id);
          io.emit('updateOnlineStatus', { user_id, isOnline: false, lastSeen });
          console.log(`🔴 User ${user_id} disconnected`);
        }
      } catch (error) {
        console.error('❌ Error during disconnection:', error);
      }
      console.log('❌ Socket disconnected:', socket.id, 'Reason:', reason);
    });

    // Add error handling
    socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });
  });

  // Add server-level error handling
  io.engine.on("connection_error", (err) => {
    console.log('❌ Socket connection error:', err);
  });

  return io;
};