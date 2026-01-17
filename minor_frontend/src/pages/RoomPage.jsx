"use client"

import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Editor } from "@monaco-editor/react"
import { RoomContext } from "../context/RoomContext"
import { UserContext } from "../context/UserContext"
import ChatBox from "../components/ChatBox"
import Cursor from "../components/Cursor"
import VSCodeFileExplorer from "../components/VSCodeFileExplorer"
import VSCodeTerminal from "../components/VSCodeTerminal"
import MentorPanel from "../components/MentorPanel"
import { toast } from "../utils/toast"

function RoomPage() {
  const navigate = useNavigate()
  const { user, loading: userLoading } = useContext(UserContext)
  const {
    room,
    files,
    code,
    setCode,
    selectFile,
    loading: roomLoading,
    socket,
    createFile,
    selectedFile,
    canEdit,
  } = useContext(RoomContext)
  const editorRef = useRef(null)
  const [cursors, setCursors] = useState([])
  const [copied, setCopied] = useState(false)
  const [participants, setParticipants] = useState([])
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [showChat, setShowChat] = useState(true)
  const [showTerminal, setShowTerminal] = useState(true)
  const [terminalHeight, setTerminalHeight] = useState(25)
  const [isDragging, setIsDragging] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const handleCopy = () => {
    if (room?.roomId) {
      navigator.clipboard.writeText(room.roomId)
      setCopied(true)
      toast.success("Room ID copied!")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    const container = document.getElementById("room-container")
    if (!container) return
    const rect = container.getBoundingClientRect()
    const newHeight = Math.max(15, Math.min(50, ((rect.bottom - e.clientY) / rect.height) * 100))
    setTerminalHeight(newHeight)
  }

  useEffect(() => {
    if (!userLoading && !user) {
      navigate("/")
      return
    }
  }, [user, userLoading, navigate])

  useEffect(() => {
    if (!room || !socket || !user || userLoading || roomLoading) return

    socket.emit("join-room", { roomId: room.roomId, user })

    socket.on("cursor:move", ({ userId, position, username }) => {
      if (userId === user._id || userId === user.id) return

      const editor = editorRef.current
      if (!editor) return

      const coords = editor.getScrolledVisiblePosition(position)
      if (!coords) return

      setCursors((prev) => {
        const existing = prev.find((c) => c.userId === userId)
        if (existing) {
          return prev.map((c) => (c.userId === userId ? { ...c, x: coords.left, y: coords.top } : c))
        } else {
          return [
            ...prev,
            {
              userId,
              x: coords.left,
              y: coords.top,
              username,
              color: "#" + Math.floor(Math.random() * 16777215).toString(16),
            },
          ]
        }
      })
    })

    socket.on("user:leave", ({ userId }) => setCursors((prev) => prev.filter((c) => c.userId !== userId)))

    socket.on("update-participants", (newParticipants) => {
      setParticipants(newParticipants)
    })

    socket.on("room-full", () => {
      toast.error("This room is full. Redirecting...")
      setTimeout(() => navigate("/dashboard"), 1500)
    })

    socket.on("file-created", ({ file }) => {
      toast.info(`New file created: ${file.name}`)
    })

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      if (socket) {
        socket.emit("leave-room", { roomId: room.roomId, userId: user._id || user.id })
        socket.off("cursor:move")
        socket.off("user:leave")
        socket.off("update-participants")
        socket.off("room-full")
        socket.off("file-created")
      }
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [room, socket, user, userLoading, roomLoading, navigate])

  if (userLoading || roomLoading || !room) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#1e1e1e",
          color: "#d4d4d4",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: "1rem", fontSize: "1.125rem" }}>Loading room...</div>
          <div
            style={{
              width: "2rem",
              height: "2rem",
              border: "4px solid #007acc",
              borderTop: "transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto",
            }}
          ></div>
        </div>
      </div>
    )
  }

  const onFileSelect = (file) => {
    selectFile(file)
    const ext = file.name?.split(".").pop()?.toLowerCase()
    const languageMap = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      html: "html",
      css: "css",
      json: "json",
      rb: "ruby",
      go: "go",
      rs: "rust",
      php: "php",
      swift: "swift",
      kotlin: "kotlin",
    }
    setSelectedLanguage(languageMap[ext] || "javascript")
  }

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor
    editor.onDidChangeCursorPosition((e) => {
      if (socket && room) {
        socket.emit("cursor:move", { roomId: room.roomId, position: e.position })
      }
    })
  }

  return (
    <div
      id="room-container"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        background: "#1e1e1e",
        color: "#d4d4d4",
        fontFamily: "'Segoe UI', 'Monaco', 'Consolas', monospace",
      }}
    >
      {/* VS Code Style Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.5rem 1rem",
          background: "#323233",
          borderBottom: "1px solid #3e3e42",
          height: "35px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1 }}>
          <h2 style={{ fontSize: "0.875rem", fontWeight: "500", color: "#cccccc", margin: 0 }}>
            {room?.name || "Code Room"}
          </h2>
          <span style={{ fontSize: "0.75rem", color: "#858585" }}>Room ID: {room?.roomId}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.75rem", color: "#858585" }}>@{user?.username}</span>
          <button
            onClick={handleCopy}
            title="Copy Room ID"
            style={{
              padding: "0.35rem 0.75rem",
              fontSize: "0.75rem",
              background: "#0e639c",
              color: "#ffffff",
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#1177bb")}
            onMouseOut={(e) => (e.target.style.background = "#0e639c")}
          >
            {copied ? "✓ Copied" : "Share"}
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "0.35rem 0.75rem",
              background: "#d16969",
              color: "white",
              border: "none",
              borderRadius: "2px",
              fontSize: "0.75rem",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#e81123")}
            onMouseOut={(e) => (e.target.style.background = "#d16969")}
          >
            Leave
          </button>
        </div>
      </header>

      {/* Main Content Area - VS Code Layout */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar - File Explorer */}
        <div
          style={{
            width: isSidebarCollapsed ? "0" : "250px",
            minWidth: isSidebarCollapsed ? "0" : "250px",
            background: "#252526",
            borderRight: "1px solid #3e3e42",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            transition: "width 0.3s",
          }}
        >
          <div
            style={{
              padding: "0.75rem",
              borderBottom: "1px solid #3e3e42",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ fontSize: "0.875rem", fontWeight: "600", margin: 0, color: "#cccccc" }}>EXPLORER</h3>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              style={{
                background: "transparent",
                border: "none",
                color: "#858585",
                cursor: "pointer",
                fontSize: "0.75rem",
              }}
            >
              {isSidebarCollapsed ? "→" : "←"}
            </button>
          </div>
          <VSCodeFileExplorer
            files={files}
            onFileSelect={onFileSelect}
            onCreateFile={createFile}
            selectedFile={selectedFile}
          />
        </div>

        {/* Editor and Terminal Split */}
        <div style={{ display: "flex", flex: 1, flexDirection: "column", overflow: "hidden" }}>
          {/* Code Editor */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
            <div
              style={{
                padding: "0.5rem 1rem",
                background: "#1e1e1e",
                borderBottom: "1px solid #3e3e42",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "0.75rem",
                color: "#858585",
              }}
            >
              <span>{selectedFile ? selectedFile.name : "No file selected"}</span>
              <span>{selectedLanguage}</span>
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <Editor
                height="100%"
                language={selectedLanguage}
                value={code}
                onChange={(value) => setCode(value)}
                theme="vs-dark"
                onMount={handleEditorDidMount}
                options={{
                  readOnly: !canEdit,
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineHeight: 1.5,
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  formatOnPaste: true,
                  formatOnType: true,
                }}
              />
              {cursors
                .filter((c) => c.userId !== user._id && c.userId !== user.id)
                .map((c) => (
                  <Cursor key={c.userId} color={c.color} name={c.username} x={c.x} y={c.y} />
                ))}
            </div>
          </div>

          {/* Terminal Section */}
          {showTerminal && (
            <>
              <div
                style={{
                  height: "4px",
                  background: "#3e3e42",
                  cursor: "row-resize",
                  transition: "background 0.2s",
                }}
                onMouseDown={handleMouseDown}
                onMouseOver={(e) => (e.target.style.background = "#555")}
                onMouseOut={(e) => (e.target.style.background = "#3e3e42")}
              />
              <div
                style={{
                  height: `${terminalHeight}%`,
                  background: "#1e1e1e",
                  borderTop: "1px solid #3e3e42",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <VSCodeTerminal language={selectedLanguage} code={code} onClose={() => setShowTerminal(false)} />
              </div>
            </>
          )}
        </div>

        {/* Right Sidebar - Chat and Mentor Panel */}
        {showChat && (
          <div
            style={{
              width: "280px",
              background: "#252526",
              borderLeft: "1px solid #3e3e42",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "0.75rem",
                borderBottom: "1px solid #3e3e42",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ fontSize: "0.875rem", fontWeight: "600", margin: 0, color: "#cccccc" }}>CHAT & MENTOR</h3>
              <button
                onClick={() => setShowChat(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#858585",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                }}
              >
                ×
              </button>
            </div>
            <ChatBox participants={participants} />
            <MentorPanel room={room} user={user} selectedFile={selectedFile} />
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default RoomPage
