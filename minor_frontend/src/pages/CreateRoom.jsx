// "use client"

// import { useState, useContext, useEffect } from "react"
// import { createRoom } from "../services/api"
// import { useNavigate } from "react-router-dom"
// import {UserContext} from "./../context/UserContext"

// export default function CreateRoom() {
//   const { user: userData, loading: userLoading } = useContext(UserContext)
//   const nav = useNavigate()
//   const [mode, setMode] = useState("one-to-one")
//   const [language, setLanguage] = useState("javascript")
//   const [maxUsers, setMaxUsers] = useState(5)
//   const [error, setError] = useState("")
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     if (!userLoading && !userData) {
//       console.log("[v0] No user data, redirecting to home")
//       nav("/")
//     }
//   }, [userData, userLoading, nav])

//   if (userLoading) {
//     return (
//       <div className="form-container">
//         <div className="form-box">
//           <h2>Loading...</h2>
//         </div>
//       </div>
//     )
//   }

//   async function doCreate() {
//     setError("")

//     if (!userData || !userData._id) {
//       setError("You must be logged in to create a room. Please log in first.")
//       console.log("[v0] User data invalid:", userData)
//       return
//     }

//     try {
//       setLoading(true)
//       console.log("[v0] Creating room with user:", userData)
//       const res = await createRoom(userData, mode, maxUsers, language)
//       console.log("[v0] Room created response:", res)

//       if (res?.room?.roomId) {
//         nav(`/room/${res.room.roomId}`)
//       } else {
//         setError("Failed to create room - invalid response")
//       }
//     } catch (err) {
//       console.error("[v0] Room creation error:", err)
//       const errorMsg = err.response?.data?.message || err.message || "Error creating room"
//       setError(errorMsg)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="form-container">
//       <div className="form-box">
//         <div className="form-header">
//           <button onClick={() => nav("/dashboard")} className="back-btn">
//             ← Back
//           </button>
//           <h2>Create a New Room</h2>
//         </div>

//         <div className="form-content">
//           <div className="form-group">
//             <label>Session Mode</label>
//             <select value={mode} onChange={(e) => setMode(e.target.value)} className="form-select" disabled={loading}>
//               <option value="one-to-one">One-to-one</option>
//               <option value="class">Class</option>
//             </select>
//           </div>

//           <div className="form-group">
//             <label>Programming Language</label>
//             <select
//               value={language}
//               onChange={(e) => setLanguage(e.target.value)}
//               className="form-select"
//               disabled={loading}
//             >
//               <option value="javascript">JavaScript</option>
//               <option value="python">Python</option>
//               <option value="java">Java</option>
//               <option value="cpp">C++</option>
//               <option value="c">C</option>
//               <option value="typescript">TypeScript</option>
//             </select>
//           </div>

//           {mode === "class" && (
//             <div className="form-group">
//               <label>Max Participants</label>
//               <input
//                 type="number"
//                 min="2"
//                 max="50"
//                 value={maxUsers}
//                 onChange={(e) => setMaxUsers(Number.parseInt(e.target.value || "5"))}
//                 className="form-input"
//                 disabled={loading}
//               />
//             </div>
//           )}

//           {error && <div className="error-message">{error}</div>}

//           <button onClick={doCreate} className="btn btn-primary" disabled={loading}>
//             {loading ? "Creating..." : "Create Room"}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
