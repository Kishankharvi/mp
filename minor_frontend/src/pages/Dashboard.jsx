"use client"

import { useContext, useEffect, useState } from "react"
import { useNavigate ,Link} from "react-router-dom"
import { UserContext } from "../context/UserContext"
import CreateRoomModal from "../pages/CreateRoomModal"
import JoinRoomModal from "../pages/JoinRoomModal"

export default function Dashboard() {
  const nav = useNavigate()
  const { user, logout, loading } = useContext(UserContext)
  const [history, setHistory] = useState([])
  const [fetchingHistory, setFetchingHistory] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  
const [openJoin, setOpenJoin] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      nav("/login")
    }
  }, [user, loading, nav])

  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_SERVER_URL || "http://localhost:5000"}/api/rooms/history/${user._id || user.id}`,
          )
          const data = await res.json()
          if (Array.isArray(data)) {
            setHistory(data)
          }
        } catch (err) {
          // Silently fail history fetch
        } finally {
          setFetchingHistory(false)
        }
      }
      fetchHistory()
    }
  }, [user])

  function handleLogout() {
    logout()
    nav("/")
  }

  return (
    <div className="dashboard-container relative" style={{ background: "#0a0a0b", minHeight: "100vh", color: "#e2e8f0" }}>
      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "1rem 2rem", background: "#0f0f11" }}>
        <div className="header-content">
          <Link to="/" className="logo">
          <h1>Code Room</h1></Link>
          <div className="header-actions">
            <span className="user-info">
              Welcome, <strong>{user?.username || "User"}</strong>
            </span>
            <button onClick={handleLogout} className="btn btn-outline">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main" style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div
          className="dashboard-cards"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            marginBottom: "3rem",
          }}
        >
          <div className="card">
            <div className="card-icon">📝</div>
            <h2>Create a Room</h2>
            <p>Start a new collaborative coding session with customizable settings</p>
            {/* <button onClick={() => nav("/create-room")} className="btn btn-primary">
              Create Room
            </button> */}
             <button 
          className="btn btn-primary"
          onClick={() => setOpenModal(true)}
        >
          Create Room
        </button>
          </div>



          <div className="card">
            <div className="card-icon">🚪</div>
            <h2>Join a Room</h2>
            <p>Enter an existing session using a room code shared by others</p>
           <button className="btn btn-primary" onClick={()=>setOpenJoin(true)}>
  Join Room
</button>
          </div>
        </div>

        <div
          className="history-section"
          style={{
            marginTop: "3rem",
            background: "#0f0f11",
            padding: "2rem",
            borderRadius: "1.5rem",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>📜</span> Recent Sessions
          </h2>

          {fetchingHistory ? (
            <div style={{ color: "#64748b", padding: "1rem" }}>Loading history...</div>
          ) : history.length === 0 ? (
            <div
              style={{
                color: "#64748b",
                padding: "1rem",
                border: "1px dashed #334155",
                borderRadius: "1rem",
                textAlign: "center",
              }}
            >
              No recent rooms found. Start your first session!
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {history.map((room) => (
                <div
                  key={room._id}
                  onClick={() => room.status !== "closed" && nav(`/room/${room.roomId}`)}
                  style={{
                    padding: "1rem 1.5rem",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "1rem",
                    cursor: room.status === "closed" ? "default" : "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    opacity: room.status === "closed" ? 0.6 : 1,
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) =>
                    room.status !== "closed" && (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
                  }
                  onMouseOut={(e) =>
                    room.status !== "closed" && (e.currentTarget.style.background = "rgba(255,255,255,0.02)")
                  }
                >
                  <div>
                    <h3 style={{ fontWeight: "600", color: "#fff", marginBottom: "0.25rem" }}>{room.name}</h3>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                      {room.mode} • {room.language} • {new Date(room.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {room.status !== "closed" ? (
                    <div style={{ fontSize: "0.875rem", color: "#3b82f6", fontWeight: "600" }}>Join →</div>
                  ) : (
                    <div style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: "500" }}>Closed</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      {openModal && <CreateRoomModal open={openModal} onClose={()=>setOpenModal(false)} />}
          {openJoin && <JoinRoomModal open={openJoin} onClose={()=>setOpenJoin(false)} />}
    </div>
  )
}
