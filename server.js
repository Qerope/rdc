const { createServer } = require("http")
const { parse } = require("url")
const next = require("next")
const { Server } = require("socket.io")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

// Message storage - in a production app, this would be a database
let messageHistory = []

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  // Initialize Socket.io
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  })

  // Set up Socket.io event handlers
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id)

    // Handle user joining
    socket.on("join", (data) => {
      const { role, username } = data

      // Join appropriate room
      socket.join(role)

      // Send message history to the newly connected client
      socket.emit("message_history", messageHistory)

      // Broadcast to other users
      socket.broadcast.emit("user_joined", { role, username })

      console.log(`${username} joined as ${role}`)
    })

    // Handle chat messages
    socket.on("chat_message", (data) => {
      console.log("Received chat message:", data)

      // Store message in history
      messageHistory.push(data)

      // Keep only the last 100 messages
      if (messageHistory.length > 100) {
        messageHistory = messageHistory.slice(-100)
      }

      // Broadcast message to all clients
      io.emit("chat_message", data)
    })

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id)
    })
  })

  // Start the server
  const PORT = process.env.PORT || 3000
  server.listen(PORT, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${PORT}`)
  })
})
