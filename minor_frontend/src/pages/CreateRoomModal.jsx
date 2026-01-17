"use client"

import { useState, useContext } from "react"
import { createRoom } from "../services/api"
import { UserContext } from "../context/UserContext"
import { useNavigate } from "react-router-dom"

export default function CreateRoomModal({ open, onClose }) {
  const { user: userData } = useContext(UserContext)
  const nav = useNavigate()

  const [mode, setMode] = useState("one-to-one")
  const [language, setLanguage] = useState("javascript")
  const [maxUsers, setMaxUsers] = useState(5)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function doCreate() {
    if (!userData?._id) return setError("Login required to create room")

    setLoading(true)
    try {
      const res = await createRoom(userData, mode, maxUsers, language)
      if(res?.room?.roomId){
        onClose()
        nav(`/room/${res.room.roomId}`)
      } else setError("Room creation failed")
    } catch (err){
      setError(err.response?.data?.message || "Error while creating room")
    } finally { setLoading(false) }
  }

  if(!open) return null

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center
                 bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-gray-800/95 w-[400px] rounded-xl p-6 text-white shadow-xl">

        <h2 className="text-2xl font-semibold mb-5 text-center">Create Room</h2>

        <div className="space-y-4">

          <div>
            <label>Mode</label>
            <select value={mode} onChange={(e)=>setMode(e.target.value)}
              className="w-full p-2 mt-1 bg-gray-700 rounded">
              <option value="one-to-one">One-to-One</option>
              <option value="class">Class</option>
            </select>
          </div>

          <div>
            <label>Language</label>
            <select value={language} onChange={(e)=>setLanguage(e.target.value)}
              className="w-full p-2 mt-1 bg-gray-700 rounded">
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="typescript">TypeScript</option>
            </select>
          </div>

          {mode==="class" && (
            <div>
              <label>Max Users</label>
              <input type="number" min="2" max="50"
                value={maxUsers}
                onChange={(e)=>setMaxUsers(+e.target.value)}
                className="w-full p-2 mt-1 bg-gray-700 rounded" />
            </div>
          )}

          {error && <p className="text-red-400">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose}
            className="px-4 py-2 rounded bg-white/10 hover:bg-white/20">
            Cancel
          </button>

          <button onClick={doCreate} disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500">
            {loading? "Creating..." : "Create"}
          </button>
        </div>

      </div>
    </div>
  )
}
