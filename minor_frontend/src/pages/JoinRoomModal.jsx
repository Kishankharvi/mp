"use client"

import { useState, useContext } from "react"
import { getRoom } from "../services/api"
import { UserContext } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import { toast } from "../utils/toast"

export default function JoinRoomModal({ open, onClose }) {
  const [roomId, setRoomId] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = useContext(UserContext)
  const nav = useNavigate()

  async function doJoin() {
    if (!roomId.trim()) return toast.warning("Enter Room ID")

    try {
      setLoading(true)
      const response = await getRoom(roomId, user)

      if (response?.roomId || response?.id) {
        toast.success("Joining...")
        onClose()
        nav(`/room/${roomId}`)
      } else toast.error("Room not found")
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join room")
    } finally { setLoading(false) }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center 
                    bg-black/60 backdrop-blur-sm">

      <div className="w-[400px] bg-gray-800/95 text-white rounded-xl p-6 shadow-xl">

        <h2 className="text-2xl font-semibold mb-5 text-center">Join a Room</h2>

        <div className="mb-5">
          <label className="block mb-2 text-gray-300 text-sm font-medium">Room ID</label>
          <input
            type="text"
            placeholder="Enter Room ID (e.g. a9xk3b)"
            value={roomId}
            onChange={(e)=>setRoomId(e.target.value)}
            onKeyDown={(e)=> e.key=="Enter" && doJoin()}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600
                       focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded bg-white/10 hover:bg-white/20"
          >
            Cancel
          </button>

          <button 
            onClick={doJoin}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Joining..." : "Join"}
          </button>
        </div>
      </div>
    </div>
  )
}
