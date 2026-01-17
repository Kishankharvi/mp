"use client"

import { useState } from "react"
import { toast } from "../utils/toast"

export default function DebugPanel({ socket, roomId, code }) {
  const [breakpoints, setBreakpoints] = useState([])
  const [watches, setWatches] = useState([])
  const [newWatchExpr, setNewWatchExpr] = useState("")
  const [debugOutput, setDebugOutput] = useState("")

  const handleAddBreakpoint = (lineNumber) => {
    if (breakpoints.includes(lineNumber)) {
      setBreakpoints(breakpoints.filter((b) => b !== lineNumber))
      toast.info(`Breakpoint removed from line ${lineNumber}`)
    } else {
      setBreakpoints([...breakpoints, lineNumber])
      toast.info(`Breakpoint added at line ${lineNumber}`)
    }

    if (socket && roomId) {
      socket.emit("breakpoint-toggle", { roomId, lineNumber })
    }
  }

  const handleAddWatch = () => {
    if (!newWatchExpr.trim()) {
      toast.warning("Enter a variable or expression")
      return
    }

    const watch = {
      id: Date.now().toString(),
      expression: newWatchExpr,
      value: "pending",
    }

    setWatches([...watches, watch])
    setNewWatchExpr("")
    toast.success("Watch added!")
  }

  return (
    <div
      style={{
        padding: "1rem",
        background: "#1e293b",
        borderRadius: "0.5rem",
        border: "1px solid #334155",
        color: "white",
      }}
    >
      <h4 style={{ margin: "0 0 1rem 0", fontSize: "0.875rem", fontWeight: "bold", color: "#f1f5f9" }}>
        Debug Console
      </h4>

      {/* Breakpoints Section */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#cbd5e1", marginBottom: "0.5rem" }}>
          Breakpoints ({breakpoints.length})
        </div>
        {breakpoints.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {breakpoints.map((bp) => (
              <div
                key={bp}
                onClick={() => handleAddBreakpoint(bp)}
                style={{
                  padding: "0.25rem 0.5rem",
                  background: "#dc2626",
                  borderRadius: "0.25rem",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#991b1b")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#dc2626")}
              >
                Line {bp} ✕
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: "#64748b", fontSize: "0.75rem" }}>No breakpoints set</div>
        )}
      </div>

      {/* Watch Expressions */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#cbd5e1", marginBottom: "0.5rem" }}>
          Watch Expressions
        </div>
        <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.5rem" }}>
          <input
            type="text"
            value={newWatchExpr}
            onChange={(e) => setNewWatchExpr(e.target.value)}
            placeholder="variable or expression"
            style={{
              flex: 1,
              padding: "0.5rem",
              fontSize: "0.875rem",
              background: "#0f172a",
              color: "white",
              border: "1px solid #334155",
              borderRadius: "0.25rem",
              outline: "none",
            }}
          />
          <button
            onClick={handleAddWatch}
            style={{
              padding: "0.5rem 0.75rem",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: "600",
            }}
          >
            Add
          </button>
        </div>

        {watches.length > 0 ? (
          <div style={{ maxHeight: "150px", overflowY: "auto" }}>
            {watches.map((watch) => (
              <div
                key={watch.id}
                style={{
                  padding: "0.5rem",
                  background: "#0f172a",
                  borderRadius: "0.25rem",
                  marginBottom: "0.25rem",
                  fontSize: "0.75rem",
                  fontFamily: "monospace",
                  borderLeft: "2px solid #3b82f6",
                }}
              >
                <div style={{ color: "#cbd5e1" }}>{watch.expression}</div>
                <div style={{ color: "#10b981", fontSize: "0.7rem" }}>→ {watch.value}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: "#64748b", fontSize: "0.75rem" }}>No watches added</div>
        )}
      </div>

      {/* Debug Output */}
      <div>
        <div style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#cbd5e1", marginBottom: "0.5rem" }}>
          Debug Output
        </div>
        <div
          style={{
            padding: "0.5rem",
            background: "#0f172a",
            borderRadius: "0.25rem",
            fontSize: "0.75rem",
            fontFamily: "monospace",
            color: "#e2e8f0",
            maxHeight: "120px",
            overflowY: "auto",
            minHeight: "60px",
            border: "1px solid #334155",
          }}
        >
          {debugOutput || "Debug output will appear here..."}
        </div>
      </div>
    </div>
  )
}
