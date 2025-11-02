import http from 'http';
import app from "./app"
import dotenv from 'dotenv'
import { connectDB } from "./config/database.config";
import { initSocket } from './socket';

dotenv.config()
const PORT = process.env.PORT || 5050;

const server = http.createServer(app);

// Initialize socket
initSocket(server);

(async () => {
    await connectDB();
    server.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`)
        console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`)
    })
})()