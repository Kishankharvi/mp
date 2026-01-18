import Room from "./models/Room.js"

export default function registerSocketHandlers(io) {
  const getParticipants = async (roomId) => {
    const sockets = await io.in(roomId).fetchSockets()
    const participants = []
    for (const socket of sockets) {
      if (socket.data.user) {
        participants.push({
          userId: socket.data.user.userId || socket.data.user.id,
          username: socket.data.user.username,
          socketId: socket.id,
          role: socket.data.role
        })
      }
    }
    return participants
  }

  io.on("connection", (socket) => {
    // JOIN ROOM
    socket.on("join-room", async ({ roomId, userId, username }) => {
      console.log(`[SOCKET] User ${username} (${userId}) joining room ${roomId}`);
      try {
        const room = await Room.findOne({ roomId })
        if (!room) {
          console.log(`[SOCKET] Room ${roomId} not found`);
          socket.emit("error", { message: "Room not found" })
          return
        }

        const isMentor = room.createdBy && userId && room.createdBy.toString() === userId.toString()
        // Or check if user is in mentors list if applicable, but for now simple owner check or passed role

        socket.join(roomId)
        socket.data.user = { userId, username, id: userId } // Store standard user obj
        socket.data.roomId = roomId
        socket.data.role = isMentor ? "mentor" : "participant"

        // Broadcast user joined
        console.log(`[SOCKET] Emitting user-joined to ${roomId}`);
        io.to(roomId).emit("user-joined", { userId, username, role: socket.data.role })

        // Send current code if needed? Client fetches from DB, but maybe sync?
        // simple sync for now:
        // socket.emit("sync-code", { code: room.files[0]?.content })

      } catch (e) {
        console.error("Join Error:", e)
        socket.emit("error", { message: "Failed to join room" })
      }
    })

    // CODE CHANGE
    socket.on("code-change", ({ roomId, userId, code }) => {
      console.log(`[SOCKET] Code change in ${roomId} from ${userId}`);
      // Broadcast to everyone else in the room
      socket.to(roomId).emit("code-change", { userId, code })

      // Optional: Debounce save to DB here
    })

    // CHAT MESSAGE
    socket.on("chat-message", ({ roomId, userId, username, message }) => {
      socket.to(roomId).emit("chat-message", { userId, username, message })
    })

    // PERMISSIONS
    socket.on("request-access", ({ roomId, userId, username }) => {
      // Broadcast to room - Mentor checks 'isOwner' to display it
      socket.to(roomId).emit("request-access", { userId, username })
    })

    socket.on("grant-access", ({ roomId, userId }) => {
      io.to(roomId).emit("access-granted", { userId })
    })

    socket.on("revoke-access", ({ roomId, userId }) => {
      io.to(roomId).emit("access-revoked", { userId })
    })

    // CURSORS
    socket.on("cursor-change", ({ roomId, userId, username, position }) => {
      socket.to(roomId).emit("cursor-change", { userId, username, position })
    })

    // WHITEBOARD
    socket.on("whiteboard-draw", ({ roomId, x0, y0, x1, y1, color, width }) => {
      socket.to(roomId).emit("whiteboard-draw", { x0, y0, x1, y1, color, width })
    })

    socket.on("whiteboard-clear", ({ roomId }) => {
      socket.to(roomId).emit("whiteboard-clear")
    })

    // DISCONNECT
    socket.on("disconnect", async () => {
      if (socket.data.roomId) {
        io.to(socket.data.roomId).emit("user-left", {
          userId: socket.data.user?.userId,
          username: socket.data.user?.username
        })
      }
    })
  })
}
