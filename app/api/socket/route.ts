import { NextResponse } from "next/server"
import { Server as SocketIOServer } from "socket.io"
import type { Server as HTTPServer } from "http"
import type { Socket as NetSocket } from "net"
import type { NextApiResponse } from "next"
import type { Server as IOServer } from "socket.io"

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined
}

interface SocketWithIO extends NetSocket {
  server: SocketServer
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO
}

// Message storage - in a production app, this would be a database
let messageHistory: any[] = []

export async function GET(req: Request, res: NextApiResponseWithSocket) {
  try {
    if (res.socket.server.io) {
      // Socket.io server is already running
      return NextResponse.json({ success: true, message: "Socket is already running" }, { status: 200 })
    }

    // Set up Socket.io server
    const io = new SocketIOServer(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    })

    // Store the Socket.io server instance
    res.socket.server.io = io

    // Set up event handlers
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

    return NextResponse.json({ success: true, message: "Socket server started" }, { status: 200 })
  } catch (error) {
    console.error("Error setting up socket server:", error)
    return NextResponse.json({ success: false, message: "Failed to start socket server" }, { status: 500 })
  }
}
