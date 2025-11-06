import { Server as SocketIOServer, Socket } from 'socket.io';
import http from 'http';
import { MessageRepository, UserRepository } from '../repositories';
import { MessageService, UserService } from '../services';

interface CustomSocket extends Socket {
  user_id?: string;
}

const onlineUsers = new Map<string, string>();
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

    // --- USER ONLINE ---
    socket.on('userOnline', async (user_id: string) => {
      try {
        if (!user_id) return;

        const alreadyOnline = onlineUsers.has(user_id);
        onlineUsers.set(user_id, socket.id);
        socket.join(`user:${user_id}`);
        socket.user_id = user_id;
        console.log(`🏠 User ${user_id} joined room: user:${user_id}`);
        console.log(`📊 Online users:`, Array.from(onlineUsers.keys()));

        // Emit only if new online status
        if (!alreadyOnline) {
          io.emit('updateOnlineStatus', { user_id, isOnline: true });
        }
      } catch (error) {
        console.error('❌ Error in userOnline:', error);
      }
    });

    // --- GET ONLINE USERS ---
    socket.on('getOnlineUsers', () => {
      const users = Array.from(onlineUsers.keys()).reduce((acc, userId) => {
        acc[userId] = true;
        return acc;
      }, {} as Record<string, boolean>);
      socket.emit('onlineUsers', users);
      console.log(`📤 Sent online users list to ${socket.id}`);
    });

    // --- SEND MESSAGE ---
    socket.on('sendMessage', async (data) => {
      try {
        const { sender_id, receiver_id, text } = data;
        console.log(`📨 Message from ${sender_id} to ${receiver_id}: ${text}`);

        const savedMessage = await messageService.sendMessage(data);
        socket.to(`user:${receiver_id}`).emit('receiveMessage', savedMessage);
        socket.emit('messageSent', savedMessage);

        console.log(`✅ Message delivered to user:${receiver_id}`);
      } catch (error) {
        console.error('❌ Error sending message:', error);
        socket.emit('messageError', { error: 'Failed to send message' });
      }
    });

    // --- DISCONNECT ---
    socket.on('disconnect', async (reason) => {
      try {
        const user_id = socket.user_id;
        if (!user_id || !onlineUsers.has(user_id)) return;

        const lastSeen = new Date();
        onlineUsers.delete(user_id);

        io.emit('updateOnlineStatus', { user_id, isOnline: false, lastSeen });
        console.log(`🔴 User ${user_id} disconnected`);
      } catch (error) {
        console.error('❌ Error during disconnection:', error);
      }

      console.log('❌ Socket disconnected:', socket.id, 'Reason:', reason);
    });

    socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });
  });

  io.engine.on("connection_error", (err) => {
    console.log('❌ Socket connection error:', err);
  });

  return io;
};
