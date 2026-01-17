// "use client"

// import { useState, useContext, useEffect } from "react"
// import { getRoom } from "../services/api"
// import { useNavigate } from "react-router-dom"
// import { UserContext } from "../context/UserContext"
// import { toast } from "../utils/toast"

// export default function JoinRoom() {
//   const [roomId, setRoomId] = useState("")
//   const [loading, setLoading] = useState(false)
//   const { user, loading: userLoading } = useContext(UserContext)
//   const nav = useNavigate()

//   useEffect(() => {
//     if (!userLoading && !user) {
//       nav("/")
//     }
//   }, [user, userLoading, nav])

//   if (userLoading) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           height: "100vh",
//           background: "#0f172a",
//           color: "white",
//         }}
//       >
//         <div style={{ textAlign: "center" }}>
//           <div style={{ marginBottom: "1rem", fontSize: "1.125rem" }}>Loading...</div>
//           <div
//             style={{
//               width: "2rem",
//               height: "2rem",
//               border: "4px solid #2563eb",
//               borderTop: "transparent",
//               borderRadius: "50%",
//               animation: "spin 1s linear infinite",
//               margin: "0 auto",
//             }}
//           ></div>
//         </div>
//       </div>
//     )
//   }

//   async function doJoin() {
//     if (!roomId.trim()) {
//       toast.warning("Please enter a room ID")
//       return
//     }

//     if (!user) {
//       toast.error("You must be logged in to join a room")
//       return
//     }

//     try {
//       setLoading(true)
//       console.log("[v0] Attempting to join room:", roomId)
//       const response = await getRoom(roomId, user)
//       console.log("[v0] Join room response:", response)

//       if (response?.roomId || response?.id) {
//         toast.success("Joining room...")
//         nav(`/room/${roomId}`)
//       } else {
//         toast.error("Room not found")
//       }
//     } catch (err) {
//       console.error("[v0] Join room error:", err)
//       const errorMsg = err.response?.data?.message || err.message || "Failed to join room"
//       toast.error(errorMsg)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         minHeight: "100vh",
//         background: "linear-gradient(to bottom right, #0f172a, #1e293b)",
//         color: "white",
//         fontFamily: "system-ui, -apple-system, sans-serif",
//       }}
//     >
//       <div
//         style={{
//           background: "#1e293b",
//           borderRadius: "0.75rem",
//           border: "1px solid #334155",
//           padding: "2rem",
//           width: "100%",
//           maxWidth: "400px",
//           boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
//           <button
//             onClick={() => nav("/dashboard")}
//             style={{
//               padding: "0.5rem",
//               background: "transparent",
//               color: "#2563eb",
//               border: "none",
//               cursor: "pointer",
//               fontSize: "1.5rem",
//               fontWeight: "bold",
//             }}
//           >
//             ←
//           </button>
//           <h2 style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold" }}>Join a Room</h2>
//         </div>

//         <div style={{ marginBottom: "2rem" }}>
//           <label
//             style={{
//               display: "block",
//               marginBottom: "0.5rem",
//               fontSize: "0.875rem",
//               fontWeight: "500",
//               color: "#cbd5e1",
//             }}
//           >
//             Room ID
//           </label>
//           <input
//             type="text"
//             placeholder="Enter the room ID (e.g., 5je3po5q)"
//             value={roomId}
//             onChange={(e) => setRoomId(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && doJoin()}
//             style={{
//               width: "100%",
//               padding: "0.75rem",
//               fontSize: "1rem",
//               background: "#0f172a",
//               color: "white",
//               border: "1px solid #334155",
//               borderRadius: "0.5rem",
//               boxSizing: "border-box",
//               outline: "none",
//               transition: "border-color 0.2s",
//             }}
//             disabled={loading}
//             onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
//             onBlur={(e) => (e.target.style.borderColor = "#334155")}
//           />
//         </div>

//         <button
//           onClick={doJoin}
//           style={{
//             width: "100%",
//             padding: "0.75rem",
//             fontSize: "1rem",
//             fontWeight: "600",
//             background: loading ? "#475569" : "#2563eb",
//             color: "white",
//             border: "none",
//             borderRadius: "0.5rem",
//             cursor: loading ? "not-allowed" : "pointer",
//             transition: "all 0.2s",
//             opacity: loading ? 0.7 : 1,
//           }}
//           disabled={loading}
//           onMouseOver={(e) => !loading && (e.target.style.background = "#1d4ed8")}
//           onMouseOut={(e) => !loading && (e.target.style.background = "#2563eb")}
//         >
//           {loading ? "Joining..." : "Join Room"}
//         </button>
//       </div>

//       <style>{`
//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   )
// }
