const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this based on your frontend URL for better security
  },
});

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Join chat room
  socket.on("joinRoom", ({ chatId }) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  // Handle new message
  socket.on("sendMessage", ({ chatId, message }) => {
    if (!chatId || !message) {
      return socket.emit("error", { message: "Invalid chatId or message." });
    }
    io.to(chatId).emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    socket.leave(chatId);
  });
});

// Start server with Socket.IO support
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
