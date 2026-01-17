"use client"

import { useContext, useEffect, useState } from "react"
import { RoomContext } from "../context/RoomContext"
import { UserContext } from "../context/UserContext"
import PresenceBar from "./PresenceBar"

export default function ChatBox({ participants }) {
  const { socket, room } = useContext(RoomContext)
  const { user } = useContext(UserContext)
  const [msg, setMsg] = useState("")
  const [list, setList] = useState([])

  useEffect(() => {
    if (!socket) return

    const handleMessage = (data) => {
      setList((prev) => [...prev, data])
    }

    socket.on("receive-chat", handleMessage)

    return () => {
      socket.off("receive-chat", handleMessage)
    }
  }, [socket])

  const sendMessage = () => {
    if (!msg.trim() || !user || !room) return

    const payload = {
      roomId: room.roomId,
      username: user.username,
      text: msg,
      timestamp: new Date(), // Add local timestamp
    }

    socket.emit("send-chat", payload)
    setMsg("") // removed setList local update to prevent duplication since socket broadcasts to self
  }

  return (
    <div className="h-full flex flex-col bg-slate-800 text-white p-3 gap-3 overflow-hidden">
      <div className="flex-shrink-0">
        <PresenceBar participants={participants} />
      </div>
      <h3 className="font-bold text-sm text-slate-200 flex-shrink-0">Chat</h3>
      <div className="flex-1 overflow-auto space-y-2 p-2 bg-slate-900 rounded border border-slate-700">
        {list.length === 0 ? (
          <p className="text-xs text-slate-500">No messages yet...</p>
        ) : (
          list.map((m, i) => (
            <p key={i} className="text-xs break-words leading-relaxed">
              <span className="text-blue-400 font-semibold">{m.username}</span>
              <span className="text-slate-400">: </span>
              <span className="text-slate-300">{m.text}</span>
            </p>
          ))
        )}
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <input
          className="flex-1 px-2 py-2 text-xs border rounded bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-xs font-medium transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  )
}
