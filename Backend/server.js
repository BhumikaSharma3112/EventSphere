const http = require('http');
const socketIo = require('socket.io');
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Initialize Server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Socket connection registry
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  // User registers their userId with socket
  socket.on('register', (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`👤 User registered socket: User ID ${userId} -> Socket ID ${socket.id}`);
  });

  // Handle client disconnect
  socket.on('disconnect', () => {
    // Find and remove disconnected user
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`👤 User disconnected: User ID ${userId}`);
        break;
      }
    }
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Global Socket Broadcaster helper
app.set('io', io);
app.set('connectedUsers', connectedUsers);

// Connect DB and Start Listening
const startServer = async () => {
  await connectDB();
  
  server.listen(PORT, () => {
    console.log(`✨ ============================================= ✨`);
    console.log(`✨  EventSphere Luxury Server running on Port ${PORT}  ✨`);
    console.log(`✨ ============================================= ✨`);
  });
};

startServer();
